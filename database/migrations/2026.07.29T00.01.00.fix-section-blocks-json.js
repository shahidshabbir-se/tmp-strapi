'use strict';

/**
 * The "Body" field on the shared.section component was changed from `text`
 * to `blocks`. Strapi's schema sync then tries to run
 * `ALTER COLUMN ... TYPE jsonb USING (col::jsonb)`, which fails on any row
 * that still holds plain text from before the change. This migration runs
 * before that sync and rewrites plain-text values into valid Blocks JSON
 * (a single paragraph containing the original text), leaving already-valid
 * JSON/null values untouched.
 */

const TABLE = 'components_shared_sections';
const COLUMNS = ['body'];

function toParagraphBlock(text) {
  return JSON.stringify([
    {
      type: 'paragraph',
      children: [{ type: 'text', text }],
    },
  ]);
}

module.exports = {
  async up(knex) {
    const hasTable = await knex.schema.hasTable(TABLE);
    if (!hasTable) {
      return;
    }

    for (const column of COLUMNS) {
      const hasColumn = await knex.schema.hasColumn(TABLE, column);
      if (!hasColumn) {
        continue;
      }

      const rows = await knex(TABLE).select('id', column).whereNotNull(column);

      for (const row of rows) {
        const value = row[column];
        if (typeof value !== 'string' || value.length === 0) {
          continue;
        }

        try {
          JSON.parse(value);
          // Already valid JSON (e.g. previously migrated) — leave as is.
          continue;
        } catch {
          // Not valid JSON — wrap the plain text in a Blocks paragraph.
        }

        await knex(TABLE)
          .where({ id: row.id })
          .update({ [column]: toParagraphBlock(value) });
      }
    }
  },

  async down() {
    throw new Error('This migration cannot be reverted.');
  },
};
