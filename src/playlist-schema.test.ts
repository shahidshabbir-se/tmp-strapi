import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

describe('Strapi Playlist and Video Schemas', () => {
  const playlistSchemaPath = path.resolve(
    __dirname,
    'api/playlist/content-types/playlist/schema.json',
  );
  const videoSchemaPath = path.resolve(
    __dirname,
    'api/video/content-types/video/schema.json',
  );

  it('defines Playlist schema with required attributes and options', () => {
    assert.ok(
      fs.existsSync(playlistSchemaPath),
      'Playlist schema file should exist',
    );

    const schema = JSON.parse(fs.readFileSync(playlistSchemaPath, 'utf8'));

    assert.strictEqual(schema.kind, 'collectionType');
    assert.strictEqual(schema.collectionName, 'playlists');
    assert.strictEqual(schema.options?.draftAndPublish, true);

    const attrs = schema.attributes;
    assert.ok(attrs, 'Attributes should be defined');

    // title (string, required)
    assert.strictEqual(attrs.title?.type, 'string');
    assert.strictEqual(attrs.title?.required, true);

    // slug (uid, required)
    assert.strictEqual(attrs.slug?.type, 'uid');
    assert.strictEqual(attrs.slug?.required, true);

    // description (text)
    assert.strictEqual(attrs.description?.type, 'text');

    // coverImage (media)
    assert.strictEqual(attrs.coverImage?.type, 'media');

    // videos relation to Video
    assert.strictEqual(attrs.videos?.type, 'relation');
    assert.strictEqual(attrs.videos?.target, 'api::video.video');
  });

  it('extends Video schema with optional externalUrl and playlists relation', () => {
    assert.ok(fs.existsSync(videoSchemaPath), 'Video schema file should exist');

    const schema = JSON.parse(fs.readFileSync(videoSchemaPath, 'utf8'));
    const attrs = schema.attributes;

    assert.strictEqual(attrs.externalUrl?.type, 'string');
    assert.strictEqual(attrs.externalUrl?.required, undefined);

    assert.strictEqual(attrs.playlists?.type, 'relation');
    assert.strictEqual(attrs.playlists?.target, 'api::playlist.playlist');
  });
});
