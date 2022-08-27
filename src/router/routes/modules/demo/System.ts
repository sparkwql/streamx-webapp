import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const streamParkSystem: AppRouteModule = {
  path: '/streamx-system',
  name: 'StreamxSystem',
  component: LAYOUT,
  redirect: '/streamx-system/user',
  meta: {
    orderNo: 0,
    icon: 'ion:settings-outline',
    title: 'System',
  },
  children: [
    {
      path: 'token',
      name: 'SystemToken',
      component: () => import('/@/views/demo/system/token/index.vue'),
      meta: {
        title: 'Token Management',
      },
    },
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('/@/views/demo/system/user/index.vue'),
      meta: {
        title: 'User Management',
      },
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('/@/views/demo/system/role/index.vue'),
      meta: {
        title: 'Role Management',
      },
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('/@/views/demo/system/menu/index.vue'),
      meta: {
        title: 'Router Management',
      },
    },
    {
      path: 'team',
      name: 'SystemTeam',
      component: () => import('/@/views/demo/system/team/index.vue'),
      meta: {
        title: 'Team Management',
      },
    },
  ],
};

export default streamParkSystem;
