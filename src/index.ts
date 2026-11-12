import crypto from 'node:crypto';

import { sampleArticles, sampleAuthors } from './seeds/articles';
import { articlesPageSeed, globalSeed, homePageSeed } from './seeds/pages';
import { sampleResources } from './seeds/resources';
import { samplePlaylists, sampleVideos } from './seeds/videos';

export const CORE_MEMBER_ROLES = [
  {
    name: 'Member',
    type: 'member',
    description: 'Standard member / collaborative partner',
  },
  {
    name: 'Board Member',
    type: 'board_member',
    description: 'Board of Trustees, Directors, Advisory Board',
  },
  {
    name: 'Editor',
    type: 'editor',
    description: 'Content editor',
  },
  {
    name: 'Admin',
    type: 'admin',
    description: 'Administrator',
  },
] as const;

export const CORE_MEMBER_PERMISSIONS: Record<string, string[]> = {
  member: [
    'plugin::users-permissions.user.me',
    'plugin::users-permissions.role.find',
    'api::private-resource.private-resource.find',
    'api::private-resource.private-resource.findOne',
    'api::committee.committee.find',
    'api::committee.committee.findOne',
    'api::officer.officer.find',
    'api::officer.officer.findOne',
  ],
  board_member: [
    'plugin::users-permissions.user.me',
    'plugin::users-permissions.role.find',
    'api::private-resource.private-resource.find',
    'api::private-resource.private-resource.findOne',
    'api::committee.committee.find',
    'api::committee.committee.findOne',
    'api::officer.officer.find',
    'api::officer.officer.findOne',
  ],
  editor: [
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
  ],
  admin: [
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
  ],
};

export const PUBLIC_PERMISSIONS: string[] = [
  'api::committee.committee.find',
  'api::committee.committee.findOne',
  'api::officer.officer.find',
  'api::officer.officer.findOne',
  'api::topic.topic.find',
  'api::topic.topic.findOne',
];

export interface UserLifecyclePayload {
  id?: number | string;
  email?: string;
  username?: string;
  resetPasswordToken?: string | null;
}

export interface EmailService {
  send?: (options: Record<string, unknown>) => Promise<unknown>;
}

export interface StrapiPluginWithEmail {
  services?: Record<string, EmailService>;
  service?: (name: string) => EmailService;
}

export interface StrapiAppContext {
  db?: {
    query?: (entity: string) => {
      findOne?: (params: unknown) => Promise<unknown>;
      create?: (params: unknown) => Promise<unknown>;
      update?: (params: unknown) => Promise<unknown>;
    };
    lifecycles?: {
      subscribe?: (subscriber: {
        models: string[];
        afterCreate?: (event: {
          result?: UserLifecyclePayload;
        }) => Promise<void>;
      }) => void;
    };
  };
  plugins?: Record<string, StrapiPluginWithEmail>;
  plugin?: (name: string) => StrapiPluginWithEmail | null;
  log?: {
    error?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
  };
}

export async function sendUserWelcomeEmail(
  strapi: StrapiAppContext,
  user: UserLifecyclePayload,
) {
  if (!user || !user.id || !user.email) {
    return;
  }

  const token =
    user.resetPasswordToken || crypto.randomBytes(64).toString('hex');

  if (!user.resetPasswordToken && strapi.db?.query) {
    await strapi.db.query('plugin::users-permissions.user').update?.({
      where: { id: user.id },
      data: { resetPasswordToken: token },
    });
  }

  const baseUrl =
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';
  const resetUrl = `${baseUrl.replace(/\/+$/, '')}/reset-password?code=${token}`;

  const emailPlugin =
    (typeof strapi.plugin === 'function' ? strapi.plugin('email') : null) ||
    strapi.plugins?.['email'];

  const emailService =
    (typeof emailPlugin?.service === 'function'
      ? emailPlugin.service('email')
      : null) || emailPlugin?.services?.email;

  if (emailService && typeof emailService.send === 'function') {
    try {
      await emailService.send({
        to: user.email,
        from:
          process.env.SMTP_DEFAULT_FROM ||
          'no-reply@diversityandleadership.org',
        subject:
          'Welcome to Diversity and Leadership Center - Activate Your Account',
        text: `Welcome to the Diversity and Leadership Center!\n\nPlease activate your account and set your password by visiting:\n${resetUrl}\n\nIf you did not request this account, please ignore this email.`,
        html: `<p>Welcome to the <strong>Diversity and Leadership Center</strong>!</p><p>Please activate your account and set your password by clicking the link below:</p><p><a href="${resetUrl}">Activate Account and Set Password</a></p><p>If you did not request this account, please ignore this email.</p>`,
      });
    } catch (err) {
      strapi.log?.error?.('Failed to send welcome email:', err);
    }
  } else {
    strapi.log?.warn?.(
      'Email service not available; welcome email was skipped.',
    );
  }
}

export async function seedInitialData(strapi: unknown) {
  const strapiAny = strapi as {
    db?: {
      query?: (entity: string) => {
        findOne?: (params: {
          where: Record<string, unknown>;
        }) => Promise<Record<string, unknown> | null>;
        create?: (params: {
          data: Record<string, unknown>;
        }) => Promise<Record<string, unknown>>;
        update?: (params: {
          where: Record<string, unknown>;
          data: Record<string, unknown>;
        }) => Promise<Record<string, unknown>>;
        count?: (params?: unknown) => Promise<number>;
      };
    };
    service?: (name: string) => Record<string, (...args: unknown[]) => unknown>;
    plugin?: (name: string) => {
      service?: (
        name: string,
      ) => Record<string, (...args: unknown[]) => unknown>;
      services?: Record<
        string,
        Record<string, (...args: unknown[]) => unknown>
      >;
    } | null;
    plugins?: Record<
      string,
      {
        service?: (
          name: string,
        ) => Record<string, (...args: unknown[]) => unknown>;
        services?: Record<
          string,
          Record<string, (...args: unknown[]) => unknown>
        >;
      }
    >;
    log?: {
      info?: (...args: unknown[]) => void;
      warn?: (...args: unknown[]) => void;
    };
  };

  try {
    // Helper to hash password using admin::auth or users-permissions service
    const getHashedPassword = async (
      rawPassword: string,
    ): Promise<string | undefined> => {
      const adminAuthService = strapiAny.service?.('admin::auth');
      if (typeof adminAuthService?.hashPassword === 'function') {
        return (await adminAuthService.hashPassword(rawPassword)) as string;
      }
      const usersPlugin =
        (typeof strapiAny.plugin === 'function'
          ? strapiAny.plugin('users-permissions')
          : null) || strapiAny.plugins?.['users-permissions'];
      const userService =
        (typeof usersPlugin?.service === 'function'
          ? usersPlugin.service('user')
          : null) || usersPlugin?.services?.user;
      if (typeof userService?.ensureHashedPasswords === 'function') {
        const hashed = (await userService.ensureHashedPasswords({
          password: rawPassword,
        })) as { password?: string };
        return hashed?.password;
      }
      return undefined;
    };

    // 1. Seed Strapi Admin User if none exists
    const adminUserQuery = strapiAny.db?.query?.('admin::user');
    const adminRoleQuery = strapiAny.db?.query?.('admin::role');
    if (adminUserQuery && adminRoleQuery) {
      const existingAdmin = await adminUserQuery.findOne?.({
        where: { email: 'admin@dlc.org' },
      });

      if (!existingAdmin) {
        const superAdminRole = await adminRoleQuery.findOne?.({
          where: { code: 'strapi-super-admin' },
        });

        const passwordHash = await getHashedPassword('Password123!');

        if (passwordHash && superAdminRole?.id) {
          await adminUserQuery.create?.({
            data: {
              firstname: 'Admin',
              lastname: 'DLC',
              username: 'admin',
              email: 'admin@dlc.org',
              password: passwordHash,
              isActive: true,
              blocked: false,
              roles: [superAdminRole.id],
            },
          });
          strapiAny.log?.info?.(
            '[Seed] Default Strapi Admin created: admin@dlc.org / Password123!',
          );
        }
      }
    }

    // 2. Seed Test Member Users in users-permissions
    const userQuery = strapiAny.db?.query?.('plugin::users-permissions.user');
    const roleQuery = strapiAny.db?.query?.('plugin::users-permissions.role');
    if (userQuery && roleQuery) {
      const testUsers = [
        {
          username: 'boardmember',
          email: 'board@dlc.org',
          password: 'Password123!',
          roleType: 'board_member',
          fullName: 'Dr. Eleanor Vance',
          organization: 'Diversity & Leadership Council',
          title: 'Trustee & Board Chair',
          bio: 'Dedicated to institutional moral leadership and fiduciary stewardship.',
        },
        {
          username: 'member',
          email: 'member@dlc.org',
          password: 'Password123!',
          roleType: 'member',
          fullName: 'Marcus Holloway',
          organization: 'Pacific Institute of Governance',
          title: 'Collaborative Research Fellow',
          bio: 'Fellow focused on interdisciplinary leadership ethics and collaborative dialogues.',
        },
        {
          username: 'editor',
          email: 'editor@dlc.org',
          password: 'Password123!',
          roleType: 'editor',
          fullName: 'Sarah Jenkins',
          organization: 'Center for Public Integrity',
          title: 'Senior Content Editor',
          bio: 'Editor managing publications, convening briefs, and digital archives.',
        },
      ];

      for (const u of testUsers) {
        const existing = await userQuery.findOne?.({
          where: { email: u.email },
        });

        const passwordHash = await getHashedPassword(u.password);

        if (!existing) {
          const role = (await roleQuery.findOne?.({
            where: { type: u.roleType },
          })) as { id?: number } | null;

          if (role?.id && passwordHash) {
            await userQuery.create?.({
              data: {
                username: u.username,
                email: u.email,
                password: passwordHash,
                provider: 'local',
                role: role.id,
                confirmed: true,
                blocked: false,
                fullName: u.fullName,
                organization: u.organization,
                title: u.title,
                bio: u.bio,
              },
            });
            strapiAny.log?.info?.(
              `[Seed] Test user created: ${u.email} / Password123!`,
            );
          }
        } else if (passwordHash && userQuery.update && existing.id) {
          // If user exists from previous run without password or provider, update them
          await userQuery.update({
            where: { id: existing.id },
            data: {
              provider: 'local',
              password: passwordHash,
              confirmed: true,
              blocked: false,
            },
          });
          strapiAny.log?.info?.(
            `[Seed] Updated test user password and provider: ${u.email} / Password123!`,
          );
        }
      }
    }

    // 3. Seed shared topics before the resources that reference them
    strapiAny.log?.info?.('[Seed] Seeding topics');
    const topicQuery = strapiAny.db?.query?.('api::topic.topic');
    const seededTopics: Record<string, number> = {};
    if (topicQuery) {
      const sampleTopics = [
        {
          name: 'Leadership',
          slug: 'leadership',
          description:
            'How leaders learn, decide, and hold themselves accountable across institutions.',
        },
        {
          name: 'Governance & Ethics',
          slug: 'governance-ethics',
          description:
            'Board stewardship, fiduciary duty, bylaws, and institutional ethics.',
        },
        {
          name: 'Diversity, Equity & Inclusion',
          slug: 'diversity-equity-inclusion',
          description:
            'Belonging, representation, and equitable outcomes in organizational life.',
        },
        {
          name: 'Community Engagement',
          slug: 'community-engagement',
          description:
            'Listening sessions, partnerships, and convening across lines of difference.',
        },
        {
          name: 'Research & Practice',
          slug: 'research-practice',
          description:
            'Working papers, evaluation methods, and scholarship that informs practice.',
        },
        {
          name: 'Convenings & Dialogue',
          slug: 'convenings-dialogue',
          description:
            'Summits, roundtables, and facilitated dialogue formats.',
        },
        {
          name: 'Faith & Public Life',
          slug: 'faith-public-life',
          description:
            'How faith commitments inform civic responsibility, pluralism, and public leadership.',
        },
        {
          name: 'Institutional Design',
          slug: 'institutional-design',
          description:
            'Structure, incentives, and accountability in organizations that serve the common good.',
        },
      ];

      for (const topic of sampleTopics) {
        let existing = (await topicQuery.findOne?.({
          where: { slug: topic.slug },
        })) as { id?: number } | null;
        if (!existing?.id) {
          existing = (await topicQuery.create?.({
            data: { ...topic, publishedAt: new Date().toISOString() },
          })) as { id?: number };
        }
        if (existing?.id) {
          seededTopics[topic.slug] = existing.id;
        }
      }
    }

    // 4. Seed Sample Private Resources
    strapiAny.log?.info?.('[Seed] Seeding private resources');
    const resourceQuery = strapiAny.db?.query?.(
      'api::private-resource.private-resource',
    );
    if (resourceQuery) {
      // Sample resources carry no attachment (`file`) metadata: nothing is
      // uploaded in local development, and invented sizes or formats would be
      // presented to visitors as fact. Each record instead points `externalUrl`
      // at a real, stable public reference document, so "Open resource" opens
      // something real. These are stand-ins for local seeding only; they are
      // never production content.

      for (const res of sampleResources) {
        const existing = await resourceQuery.findOne?.({
          where: { title: res.title },
        });
        if (!existing) {
          const { topicSlugs, ...resourceData } = res;
          const topicIds = topicSlugs
            .map((slug) => seededTopics[slug])
            .filter(Boolean);
          await resourceQuery.create?.({
            data: {
              ...resourceData,
              publishedAt: new Date().toISOString(),
              ...(topicIds.length > 0 ? { topics: topicIds } : {}),
            },
          });
        }
      }
    }

    // 5. Seed Sample Committees and Officers
    strapiAny.log?.info?.('[Seed] Seeding committees and officers');
    const committeeQuery = strapiAny.db?.query?.('api::committee.committee');
    const officerQuery = strapiAny.db?.query?.('api::officer.officer');
    if (committeeQuery && officerQuery) {
      const sampleCommittees = [
        {
          name: 'Board of Trustees',
          slug: 'board-of-trustees',
          type: 'board_of_trustees',
          description:
            'The governing body responsible for institutional oversight, strategic direction, and fiduciary stewardship.',
          displayOrder: 1,
          publishedAt: new Date().toISOString(),
        },
        {
          name: 'Executive Committee',
          slug: 'executive-committee',
          type: 'standing_committee',
          description:
            'Strategic direction, emergency governance, and executive oversight.',
          displayOrder: 2,
          publishedAt: new Date().toISOString(),
        },
        {
          name: 'Audit, Risk & Finance',
          slug: 'audit-risk-finance',
          type: 'standing_committee',
          description:
            'Fiscal compliance, 990 filings, endowment stewardship, and internal controls.',
          displayOrder: 3,
          publishedAt: new Date().toISOString(),
        },
        {
          name: 'Governance & Nominations',
          slug: 'governance-nominations',
          type: 'standing_committee',
          description:
            'Bylaws maintenance, trustee vetting, board diversity, and conflict disclosures.',
          displayOrder: 4,
          publishedAt: new Date().toISOString(),
        },
        {
          name: 'Academic & Research Advisory',
          slug: 'academic-research-advisory',
          type: 'standing_committee',
          description:
            'Methodology validation, research partnerships, and public scholarship integrity.',
          displayOrder: 5,
          publishedAt: new Date().toISOString(),
        },
        {
          name: 'Executive Advisory Board',
          slug: 'executive-advisory-board',
          type: 'advisory_board',
          description:
            'External thought leaders providing non-fiduciary counsel on cross-sector leadership initiatives.',
          displayOrder: 6,
          publishedAt: new Date().toISOString(),
        },
      ];

      const createdCommittees: Record<string, { id: number }> = {};
      for (const comm of sampleCommittees) {
        let existing = (await committeeQuery.findOne?.({
          where: { slug: comm.slug },
        })) as { id: number } | null;
        if (!existing) {
          existing = (await committeeQuery.create?.({ data: comm })) as {
            id: number;
          };
        }
        if (existing?.id) {
          createdCommittees[comm.slug] = existing;
        }
      }

      const sampleOfficers = [
        {
          fullName: 'Dr. Aris Thorne',
          role: 'Trustee Chair & President',
          bio: 'Leading institutional strategy and moral leadership across collaborative research initiatives.',
          isOfficer: true,
          isChair: true,
          displayOrder: 1,
          committeeSlugs: ['board-of-trustees', 'executive-committee'],
          publishedAt: new Date().toISOString(),
        },
        {
          fullName: 'Prof. Maya Sen',
          role: 'Vice Chair & Research Director',
          bio: 'Directing collaborative academic research and public scholarship integrity frameworks.',
          isOfficer: true,
          isChair: true,
          displayOrder: 2,
          committeeSlugs: ['board-of-trustees', 'academic-research-advisory'],
          publishedAt: new Date().toISOString(),
        },
        {
          fullName: 'Marcus Vance, CPA',
          role: 'Treasurer & Finance Chair',
          bio: 'Overseeing fiscal compliance, audit governance, and endowment stewardship.',
          isOfficer: true,
          isChair: true,
          displayOrder: 3,
          committeeSlugs: ['board-of-trustees', 'audit-risk-finance'],
          publishedAt: new Date().toISOString(),
        },
        {
          fullName: 'Elena Rostova, J.D.',
          role: 'Secretary & Governance Chair',
          bio: 'Managing bylaws adherence, trustee vetting, conflict disclosures, and organizational ethics.',
          isOfficer: true,
          isChair: true,
          displayOrder: 4,
          committeeSlugs: ['board-of-trustees', 'governance-nominations'],
          publishedAt: new Date().toISOString(),
        },
        {
          fullName: 'Dr. Eleanor Vance',
          role: 'Trustee',
          bio: 'Dedicated to institutional moral leadership and fiduciary stewardship across healthcare initiatives.',
          isOfficer: false,
          isChair: false,
          displayOrder: 5,
          committeeSlugs: ['board-of-trustees', 'audit-risk-finance'],
          publishedAt: new Date().toISOString(),
        },
        {
          fullName: 'Marcus Holloway',
          role: 'Advisory Fellow',
          bio: 'Fellow focused on interdisciplinary leadership ethics and collaborative community dialogues.',
          isOfficer: false,
          isChair: false,
          displayOrder: 6,
          committeeSlugs: [
            'executive-advisory-board',
            'academic-research-advisory',
          ],
          publishedAt: new Date().toISOString(),
        },
      ];

      for (const off of sampleOfficers) {
        const existing = await officerQuery.findOne?.({
          where: { fullName: off.fullName },
        });
        if (!existing) {
          const committeeIds = off.committeeSlugs
            .map((slug) => createdCommittees[slug]?.id)
            .filter(Boolean);
          const { committeeSlugs: _, ...officerData } = off;
          await officerQuery.create?.({
            data: {
              ...officerData,
              committees: committeeIds,
            },
          });
        }
      }
    }

    // 6. Seed Sample Videos and Playlists
    strapiAny.log?.info?.('[Seed] Seeding videos and playlists');
    const videoQuery = strapiAny.db?.query?.('api::video.video');
    const playlistQuery = strapiAny.db?.query?.('api::playlist.playlist');
    if (videoQuery && playlistQuery) {
      const seededVideos: Record<string, number> = {};
      for (const video of sampleVideos) {
        const existing = (await videoQuery.findOne?.({
          where: { slug: video.slug },
        })) as { id?: number } | null;
        if (!existing?.id) {
          const { topicSlugs, ...videoData } = video;
          const topicIds = topicSlugs
            .map((slug) => seededTopics[slug])
            .filter(Boolean);
          const created = (await videoQuery.create?.({
            data: {
              ...videoData,
              publishedAt: video.Published,
              ...(topicIds.length > 0 ? { topics: topicIds } : {}),
            },
          })) as { id?: number } | null;
          if (created?.id) {
            seededVideos[video.slug] = created.id;
          }
        } else {
          seededVideos[video.slug] = existing.id;
        }
      }

      for (const playlist of samplePlaylists) {
        const videoIds = playlist.videoSlugs
          .map((slug) => seededVideos[slug])
          .filter((id): id is number => Boolean(id));
        const existing = await playlistQuery.findOne?.({
          where: { slug: playlist.slug },
        });

        if (existing?.id) {
          // Keep already-seeded playlists in sync with the sample video list.
          await playlistQuery.update?.({
            where: { id: existing.id },
            data: { videos: videoIds },
          });
          continue;
        }

        await playlistQuery.create?.({
          data: {
            title: playlist.title,
            slug: playlist.slug,
            description: playlist.description,
            publishedAt: new Date().toISOString(),
            ...(videoIds.length > 0 ? { videos: videoIds } : {}),
          },
        });
      }
    }

    // 7. Seed Authors and Articles
    const authorQuery = strapiAny.db?.query?.('api::author.author');
    const articleQuery = strapiAny.db?.query?.('api::article.article');
    if (authorQuery && articleQuery) {
      try {
        const seededAuthors: Record<string, number> = {};
        for (const author of sampleAuthors) {
          let existing = (await authorQuery.findOne?.({
            where: { slug: author.slug },
          })) as { id?: number } | null;
          if (!existing?.id) {
            existing = (await authorQuery.create?.({
              data: {
                ...author,
                publishedAt: new Date().toISOString(),
              },
            })) as { id?: number } | null;
          }
          if (existing?.id) {
            seededAuthors[author.slug] = existing.id;
          }
        }

        for (const article of sampleArticles) {
          const existing = await articleQuery.findOne?.({
            where: { Slug: article.Slug },
          });
          if (existing) continue;

          const {
            authorSlug,
            topicSlugs,
            body: _body,
            quote: _quote,
            ...articleData
          } = article;
          const authorId = seededAuthors[authorSlug];
          const topicIds = topicSlugs
            .map((slug) => seededTopics[slug])
            .filter(Boolean);
          const publishedAt = `${article.Published}T12:00:00.000Z`;

          await articleQuery.create?.({
            data: {
              ...articleData,
              publishedAt,
              ...(authorId ? { author: authorId } : {}),
              ...(topicIds.length > 0 ? { topics: topicIds } : {}),
            },
          });
        }
      } catch (err) {
        strapiAny.log?.warn?.('[Seed] Article seeding skipped:', err);
      }
    }

    // 8. Seed the page content the website reads from single types.
    try {
      const seedSingleType = async (
        uid: string,
        data: Record<string, unknown>,
      ) => {
        const query = strapiAny.db?.query?.(uid);
        if (!query?.findOne || !query?.create) return;
        const existing = await query.findOne({ where: {} });
        if (!existing) {
          await query.create({
            data: {
              ...data,
              publishedAt: new Date().toISOString(),
            },
          });
          strapiAny.log?.info?.(`[Seed] Created ${uid}`);
        }
      };

      await seedSingleType('api::global.global', globalSeed);
      await seedSingleType(
        'api::articles-page.articles-page',
        articlesPageSeed,
      );
      await seedSingleType('api::home-page.home-page', homePageSeed);
    } catch (err) {
      strapiAny.log?.warn?.('[Seed] Page content seeding skipped:', err);
    }
  } catch (err) {
    strapiAny.log?.warn?.(
      '[Seed] Initial data seeding skipped:',
      err instanceof Error ? err.stack : err,
    );
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: unknown }) {
    const strapiTyped = strapi as StrapiAppContext & {
      db: {
        query: (entity: string) => {
          findOne: (params: {
            where: { type?: string; action?: string; role?: number };
          }) => Promise<{ id: number } | null>;
          create: (params: { data: unknown }) => Promise<{ id: number }>;
        };
      };
    };

    for (const role of CORE_MEMBER_ROLES) {
      let existing = (await strapiTyped.db
        .query('plugin::users-permissions.role')
        .findOne({
          where: { type: role.type },
        })) as { id: number } | null;

      if (!existing) {
        existing = (await strapiTyped.db
          .query('plugin::users-permissions.role')
          .create({
            data: role,
          })) as { id: number };
      }

      if (existing?.id) {
        const actions = CORE_MEMBER_PERMISSIONS[role.type] ?? [];
        for (const action of actions) {
          const existingPermission = await strapiTyped.db
            .query('plugin::users-permissions.permission')
            .findOne({
              where: {
                action,
                role: existing.id,
              },
            });

          if (!existingPermission) {
            await strapiTyped.db
              .query('plugin::users-permissions.permission')
              .create({
                data: {
                  action,
                  role: existing.id,
                },
              });
          }
        }
      }
    }

    const publicRole = (await strapiTyped.db
      .query('plugin::users-permissions.role')
      .findOne({
        where: { type: 'public' },
      })) as { id: number } | null;

    if (publicRole?.id) {
      for (const action of PUBLIC_PERMISSIONS) {
        const existingPermission = await strapiTyped.db
          .query('plugin::users-permissions.permission')
          .findOne({
            where: {
              action,
              role: publicRole.id,
            },
          });

        if (!existingPermission) {
          await strapiTyped.db
            .query('plugin::users-permissions.permission')
            .create({
              data: {
                action,
                role: publicRole.id,
              },
            });
        }
      }
    }

    strapiTyped.db?.lifecycles?.subscribe?.({
      models: ['plugin::users-permissions.user'],
      async afterCreate(event: { result?: UserLifecyclePayload }) {
        if (event?.result) {
          await sendUserWelcomeEmail(
            strapi as unknown as StrapiAppContext,
            event.result,
          );
        }
      },
    });

    // Seed initial admin, test member accounts, and sample private resources ONLY in development
    if (process.env.NODE_ENV === 'development') {
      await seedInitialData(strapi);
    }
  },
};
