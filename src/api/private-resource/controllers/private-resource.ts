/**
 * private-resource controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::private-resource.private-resource',
  () => ({
    async find(ctx) {
      const user = ctx.state.user;
      // If user is a standard member, restrict query filters to member access level
      if (user?.role?.type === 'member') {
        const currentFilters =
          (ctx.query?.filters as Record<string, unknown>) || {};
        ctx.query = {
          ...ctx.query,
          filters: {
            ...currentFilters,
            accessLevel: 'member',
          },
        };
      }
      return super.find(ctx);
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      const response = await super.findOne(ctx);
      const accessLevel =
        response?.data?.accessLevel || response?.data?.attributes?.accessLevel;

      if (user?.role?.type === 'member' && accessLevel === 'board_only') {
        return ctx.forbidden('Access restricted to board members');
      }
      return response;
    },
  }),
);
