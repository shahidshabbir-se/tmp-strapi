import type { Core } from '@strapi/strapi';

export default ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb',
      jsonLimit: '256mb',
      textLimit: '256mb',
      formidable: {
        maxFileSize: env.int('UPLOAD_MAX_FILE_SIZE', 500 * 1024 * 1024), // 500MB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
