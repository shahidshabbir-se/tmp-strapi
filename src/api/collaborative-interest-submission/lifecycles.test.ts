import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import lifecycles from './content-types/collaborative-interest-submission/lifecycles';

interface GlobalStrapiHolder {
  strapi: unknown;
}

describe('Collaborative Interest Submission - Lifecycle Hook', () => {
  it('dispatches notification email to RoutingEmail upon creation', async () => {
    let sentEmail: Record<string, unknown> | null = null;
    const sendMock = mock.fn(async (options: Record<string, unknown>) => {
      sentEmail = options;
    });

    const findFirstMock = mock.fn(async () => ({
      RoutingEmail: 'routing@diversityandleadership.org',
    }));

    (globalThis as unknown as GlobalStrapiHolder).strapi = {
      documents: mock.fn((uid: string) => {
        assert.strictEqual(uid, 'api::contact-page.contact-page');
        return { findFirst: findFirstMock };
      }),
      plugins: {
        email: {
          services: {
            email: {
              send: sendMock,
            },
          },
        },
      },
      log: {
        warn: mock.fn(() => {}),
      },
    };

    await lifecycles.afterCreate({
      result: {
        name: 'Dr. Jane Smith',
        email: 'jane.smith@example.org',
        organization: 'Global Leadership Institute',
        interestArea: 'Thought Partnership & Advisory',
        message: 'We would love to collaborate on joint research initiatives.',
      },
    });

    assert.strictEqual(findFirstMock.mock.callCount(), 1);
    assert.strictEqual(sendMock.mock.callCount(), 1);
    assert.strictEqual(sentEmail?.to, 'routing@diversityandleadership.org');
    assert.strictEqual(sentEmail?.replyTo, 'jane.smith@example.org');
    assert.strictEqual(
      sentEmail?.subject,
      'New collaborative interest submission from Dr. Jane Smith',
    );
    assert.ok(
      typeof sentEmail?.text === 'string' &&
        sentEmail.text.includes('Name: Dr. Jane Smith'),
    );
    assert.ok(
      typeof sentEmail?.text === 'string' &&
        sentEmail.text.includes('Organization: Global Leadership Institute'),
    );
    assert.ok(
      typeof sentEmail?.text === 'string' &&
        sentEmail.text.includes(
          'Interest Area: Thought Partnership & Advisory',
        ),
    );
    assert.ok(
      typeof sentEmail?.text === 'string' &&
        sentEmail.text.includes(
          'We would love to collaborate on joint research initiatives.',
        ),
    );
  });

  it('skips email dispatch and logs warning when no RoutingEmail is configured', async () => {
    const sendMock = mock.fn(async () => {});
    let loggedWarning = '';

    (globalThis as unknown as GlobalStrapiHolder).strapi = {
      documents: mock.fn(() => ({
        findFirst: async () => null,
      })),
      plugins: {
        email: {
          services: {
            email: {
              send: sendMock,
            },
          },
        },
      },
      log: {
        warn: mock.fn((msg: string) => {
          loggedWarning = msg;
        }),
      },
    };

    await lifecycles.afterCreate({
      result: {
        name: 'Jane Doe',
        email: 'jane@example.org',
        interestArea: 'Seminars & Convenings',
        message: 'Interested in attending.',
      },
    });

    assert.strictEqual(sendMock.mock.callCount(), 0);
    assert.ok(loggedWarning.includes('no RoutingEmail set on contact-page'));
  });
});
