import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import strapiConfig, {
  CORE_MEMBER_PERMISSIONS,
  seedInitialData,
  sendUserWelcomeEmail,
} from './index';

type BootstrapStrapi = Parameters<typeof strapiConfig.bootstrap>[0]['strapi'];

describe('Strapi bootstrap', () => {
  it('creates missing core roles and permissions without duplicating existing ones', async () => {
    const rolesInDb: Array<{ id: number; name: string; type: string }> = [
      { id: 1, name: 'Member', type: 'member' },
    ];
    const permissionsInDb: Array<{ id: number; action: string; role: number }> =
      [];

    let nextRoleId = 2;
    let nextPermId = 1;

    const roleFindOneMock = mock.fn(
      async ({ where }: { where: { type: string } }) => {
        return rolesInDb.find((r) => r.type === where.type) ?? null;
      },
    );

    const roleCreateMock = mock.fn(
      async ({ data }: { data: { name: string; type: string } }) => {
        const newRole = { id: nextRoleId++, ...data };
        rolesInDb.push(newRole);
        return newRole;
      },
    );

    const permissionFindOneMock = mock.fn(
      async ({ where }: { where: { action: string; role: number } }) => {
        return (
          permissionsInDb.find(
            (p) => p.action === where.action && p.role === where.role,
          ) ?? null
        );
      },
    );

    const permissionCreateMock = mock.fn(
      async ({ data }: { data: { action: string; role: number } }) => {
        const newPerm = { id: nextPermId++, ...data };
        permissionsInDb.push(newPerm);
        return newPerm;
      },
    );

    let registeredSubscriber: Record<string, unknown> | null = null;
    const subscribeMock = mock.fn((subscriber: Record<string, unknown>) => {
      registeredSubscriber = subscriber;
    });

    const fakeStrapi = {
      db: {
        query: mock.fn((entity: string) => {
          if (entity === 'plugin::users-permissions.role') {
            return {
              findOne: roleFindOneMock,
              create: roleCreateMock,
            };
          }
          if (entity === 'plugin::users-permissions.permission') {
            return {
              findOne: permissionFindOneMock,
              create: permissionCreateMock,
            };
          }
          throw new Error(`Unexpected entity: ${entity}`);
        }),
        lifecycles: {
          subscribe: subscribeMock,
        },
      },
    };

    await strapiConfig.bootstrap({
      strapi: fakeStrapi as unknown as BootstrapStrapi,
    });

    // Should have checked roles 4 + 1 (for public) = 5 times
    assert.strictEqual(roleFindOneMock.mock.callCount(), 5);
    // 'member' was already in DB, so 3 roles created
    assert.strictEqual(roleCreateMock.mock.callCount(), 3);
    assert.strictEqual(rolesInDb.length, 4);

    // Verify lifecycle hook registration
    assert.strictEqual(subscribeMock.mock.callCount(), 1);
    assert.deepStrictEqual(registeredSubscriber?.models, [
      'plugin::users-permissions.user',
    ]);
    assert.strictEqual(typeof registeredSubscriber?.afterCreate, 'function');

    // Calculate total expected permissions:
    // member: 8, board_member: 8, editor: 17, admin: 17
    const totalExpectedPerms = Object.values(CORE_MEMBER_PERMISSIONS).reduce(
      (sum, perms) => sum + perms.length,
      0,
    );
    assert.strictEqual(permissionsInDb.length, totalExpectedPerms);
    assert.strictEqual(
      permissionCreateMock.mock.callCount(),
      totalExpectedPerms,
    );

    // Verify member permissions
    const memberRole = rolesInDb.find((r) => r.type === 'member');
    assert.ok(memberRole);
    const memberPerms = permissionsInDb
      .filter((p) => p.role === memberRole.id)
      .map((p) => p.action);
    assert.deepStrictEqual(memberPerms, [
      'plugin::users-permissions.user.me',
      'plugin::users-permissions.role.find',
      'api::private-resource.private-resource.find',
      'api::private-resource.private-resource.findOne',
      'api::committee.committee.find',
      'api::committee.committee.findOne',
      'api::officer.officer.find',
      'api::officer.officer.findOne',
    ]);

    // Verify admin permissions
    const adminRole = rolesInDb.find((r) => r.type === 'admin');
    assert.ok(adminRole);
    const adminPerms = permissionsInDb
      .filter((p) => p.role === adminRole.id)
      .map((p) => p.action);
    assert.deepStrictEqual(adminPerms, [
      'plugin::users-permissions.user.me',
      'plugin::users-permissions.role.find',
      'api::private-resource.private-resource.find',
      'api::private-resource.private-resource.findOne',
      'api::private-resource.private-resource.create',
      'api::private-resource.private-resource.update',
      'api::private-resource.private-resource.delete',
      'api::committee.committee.find',
      'api::committee.committee.findOne',
      'api::committee.committee.create',
      'api::committee.committee.update',
      'api::committee.committee.delete',
      'api::officer.officer.find',
      'api::officer.officer.findOne',
      'api::officer.officer.create',
      'api::officer.officer.update',
      'api::officer.officer.delete',
    ]);

    // Second bootstrap run (idempotency check)
    roleFindOneMock.mock.resetCalls();
    roleCreateMock.mock.resetCalls();
    permissionFindOneMock.mock.resetCalls();
    permissionCreateMock.mock.resetCalls();

    await strapiConfig.bootstrap({
      strapi: fakeStrapi as unknown as BootstrapStrapi,
    });

    // Should have checked roles 4 + 1 (for public) = 5 times
    assert.strictEqual(roleFindOneMock.mock.callCount(), 5);
    assert.strictEqual(roleCreateMock.mock.callCount(), 0);
    assert.strictEqual(rolesInDb.length, 4);

    assert.strictEqual(
      permissionFindOneMock.mock.callCount(),
      totalExpectedPerms,
    );
    assert.strictEqual(permissionCreateMock.mock.callCount(), 0);
    assert.strictEqual(permissionsInDb.length, totalExpectedPerms);
  });
});

describe('User Welcome & Password Activation Email Hook', () => {
  it('generates token, updates user, and dispatches activation email', async () => {
    let updatedPayload: Record<string, unknown> | null = null;
    const updateMock = mock.fn(
      async ({
        where,
        data,
      }: {
        where: { id: number | string };
        data: Record<string, unknown>;
      }) => {
        assert.strictEqual(where.id, 42);
        updatedPayload = data;
        return { id: 42, ...data };
      },
    );

    let sentEmail: Record<string, unknown> | null = null;
    const sendMock = mock.fn(async (emailOptions: Record<string, unknown>) => {
      sentEmail = emailOptions;
    });

    const fakeStrapi = {
      db: {
        query: mock.fn((entity: string) => {
          assert.strictEqual(entity, 'plugin::users-permissions.user');
          return { update: updateMock };
        }),
      },
      plugins: {
        email: {
          services: {
            email: {
              send: sendMock,
            },
          },
        },
      },
      plugin: (name: string) => {
        if (name === 'email') {
          return { service: () => ({ send: sendMock }) };
        }
        return null;
      },
    };

    await sendUserWelcomeEmail(fakeStrapi, {
      id: 42,
      email: 'newmember@example.com',
      username: 'newmember',
    });

    assert.strictEqual(updateMock.mock.callCount(), 1);
    assert.ok(updatedPayload?.resetPasswordToken);
    assert.strictEqual(typeof updatedPayload.resetPasswordToken, 'string');
    assert.strictEqual(updatedPayload.resetPasswordToken.length, 128); // 64 hex bytes

    assert.strictEqual(sendMock.mock.callCount(), 1);
    assert.strictEqual(sentEmail?.to, 'newmember@example.com');
    assert.ok(sentEmail?.subject.includes('Activate Your Account'));
    assert.ok(
      sentEmail?.text.includes(
        `/reset-password?code=${updatedPayload.resetPasswordToken}`,
      ),
    );
    assert.ok(
      sentEmail?.html.includes(
        `/reset-password?code=${updatedPayload.resetPasswordToken}`,
      ),
    );
  });

  it('uses existing resetPasswordToken without re-updating DB if already provided', async () => {
    const updateMock = mock.fn(async () => {});
    let sentEmail: Record<string, unknown> | null = null;
    const sendMock = mock.fn(async (emailOptions: Record<string, unknown>) => {
      sentEmail = emailOptions;
    });

    const fakeStrapi = {
      db: {
        query: mock.fn(() => ({ update: updateMock })),
      },
      plugins: {
        email: {
          services: {
            email: {
              send: sendMock,
            },
          },
        },
      },
    };

    await sendUserWelcomeEmail(fakeStrapi, {
      id: 99,
      email: 'existing-token@example.com',
      resetPasswordToken: 'pre-existing-token-abc',
    });

    assert.strictEqual(updateMock.mock.callCount(), 0);
    assert.strictEqual(sendMock.mock.callCount(), 1);
    assert.ok(
      sentEmail?.text.includes('/reset-password?code=pre-existing-token-abc'),
    );
  });

  it('ignores invalid or incomplete user payloads without throwing', async () => {
    const updateMock = mock.fn(async () => {});
    const sendMock = mock.fn(async () => {});

    const fakeStrapi = {
      db: {
        query: mock.fn(() => ({ update: updateMock })),
      },
      plugins: {
        email: {
          services: { email: { send: sendMock } },
        },
      },
    };

    await sendUserWelcomeEmail(
      fakeStrapi,
      null as unknown as Parameters<typeof sendUserWelcomeEmail>[1],
    );
    await sendUserWelcomeEmail(
      fakeStrapi,
      {} as unknown as Parameters<typeof sendUserWelcomeEmail>[1],
    );
    await sendUserWelcomeEmail(fakeStrapi, { id: 1 } as unknown as Parameters<
      typeof sendUserWelcomeEmail
    >[1]);
    await sendUserWelcomeEmail(fakeStrapi, {
      email: 'missing-id@example.com',
    } as unknown as Parameters<typeof sendUserWelcomeEmail>[1]);

    assert.strictEqual(updateMock.mock.callCount(), 0);
    assert.strictEqual(sendMock.mock.callCount(), 0);
  });

  it('handles email send error safely by logging without throwing uncaught exceptions', async () => {
    let loggedError: { msg: string; err: unknown } | null = null;
    const updateMock = mock.fn(async () => ({}));
    const sendMock = mock.fn(async () => {
      throw new Error('SMTP connection refused');
    });

    const fakeStrapi = {
      db: {
        query: mock.fn(() => ({ update: updateMock })),
      },
      plugins: {
        email: {
          services: { email: { send: sendMock } },
        },
      },
      log: {
        error: mock.fn((msg: string, err: unknown) => {
          loggedError = { msg, err };
        }),
        warn: mock.fn(() => {}),
      },
    };

    await assert.doesNotReject(async () => {
      await sendUserWelcomeEmail(fakeStrapi, {
        id: 10,
        email: 'fail-email@example.com',
      });
    });

    assert.strictEqual(updateMock.mock.callCount(), 1);
    assert.strictEqual(sendMock.mock.callCount(), 1);
    assert.ok(loggedError);
    assert.strictEqual(loggedError.msg, 'Failed to send welcome email:');
    assert.strictEqual(loggedError.err.message, 'SMTP connection refused');
  });
});

describe('Private Resource Schema & Seed Data', () => {
  it('validates that private-resource schema contains public, member, and board_only access levels', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const schema = require('./api/private-resource/content-types/private-resource/schema.json');
    assert.strictEqual(schema.options.draftAndPublish, true);
    assert.strictEqual(schema.attributes.title.required, true);
    assert.strictEqual(schema.attributes.category.required, true);
    assert.deepStrictEqual(schema.attributes.accessLevel.enum, [
      'public',
      'member',
      'board_only',
    ]);
  });

  it('seeds sample resources including public, member, and board_only tiers', async () => {
    const seededResources: Array<Record<string, unknown>> = [];
    const fakeStrapi = {
      db: {
        query: mock.fn((entity: string) => {
          if (entity === 'api::private-resource.private-resource') {
            return {
              findOne: mock.fn(async () => null),
              create: mock.fn(
                async ({ data }: { data: Record<string, unknown> }) => {
                  seededResources.push(data);
                  return { id: seededResources.length, ...data };
                },
              ),
            };
          }
          return {
            findOne: mock.fn(async () => null),
            create: mock.fn(async () => ({ id: 1 })),
          };
        }),
      },
      service: mock.fn(() => ({
        hashPassword: mock.fn(async () => 'hashed_pw'),
      })),
      log: {
        info: mock.fn(() => {}),
        warn: mock.fn(() => {}),
      },
    };

    await seedInitialData(fakeStrapi);

    const publicRes = seededResources.find((r) => r.accessLevel === 'public');
    const memberRes = seededResources.find((r) => r.accessLevel === 'member');
    const boardRes = seededResources.find(
      (r) => r.accessLevel === 'board_only',
    );

    assert.ok(publicRes, 'Expected at least one public resource to be seeded');
    assert.ok(memberRes, 'Expected at least one member resource to be seeded');
    assert.ok(
      boardRes,
      'Expected at least one board_only resource to be seeded',
    );
  });

  it('seeds sample videos and playlists wired to topics', async () => {
    const seededVideos: Array<Record<string, unknown>> = [];
    const seededPlaylists: Array<Record<string, unknown>> = [];

    const fakeStrapi = {
      db: {
        query: mock.fn((entity: string) => {
          if (entity === 'api::video.video') {
            return {
              findOne: mock.fn(async () => null),
              create: mock.fn(
                async ({ data }: { data: Record<string, unknown> }) => {
                  seededVideos.push(data);
                  return { id: seededVideos.length, ...data };
                },
              ),
            };
          }
          if (entity === 'api::playlist.playlist') {
            return {
              findOne: mock.fn(async () => null),
              create: mock.fn(
                async ({ data }: { data: Record<string, unknown> }) => {
                  seededPlaylists.push(data);
                  return { id: seededPlaylists.length, ...data };
                },
              ),
            };
          }
          let counter = 0;
          return {
            findOne: mock.fn(async () => null),
            create: mock.fn(async () => ({ id: ++counter })),
          };
        }),
      },
      service: mock.fn(() => ({
        hashPassword: mock.fn(async () => 'hashed_pw'),
      })),
      log: {
        info: mock.fn(() => {}),
        warn: mock.fn(() => {}),
      },
    };

    await seedInitialData(fakeStrapi);

    assert.ok(
      seededVideos.length >= 3,
      `Expected several videos to be seeded, got ${seededVideos.length}`,
    );
    assert.ok(
      seededPlaylists.length >= 1,
      `Expected at least one playlist to be seeded, got ${seededPlaylists.length}`,
    );

    for (const video of seededVideos) {
      assert.ok(video.Title, 'Seeded video should have a Title');
      assert.ok(video.slug, 'Seeded video should have a slug');
      assert.ok(video.Description, 'Seeded video should have a Description');
      assert.ok(video.Published, 'Seeded video should have a Published date');
      assert.ok(
        video.externalUrl,
        'Seeded video should carry an externalUrl so the theater can resolve a source',
      );
      assert.ok(
        Array.isArray(video.topics) && video.topics.length > 0,
        'Seeded video should be linked to at least one topic',
      );
    }

    for (const playlist of seededPlaylists) {
      assert.ok(playlist.title, 'Seeded playlist should have a title');
      assert.ok(playlist.slug, 'Seeded playlist should have a slug');
      assert.ok(
        Array.isArray(playlist.videos) && playlist.videos.length > 0,
        'Seeded playlist should contain videos',
      );
    }
  });
});
