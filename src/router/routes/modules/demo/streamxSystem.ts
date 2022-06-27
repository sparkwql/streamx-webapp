import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

const system: AppRouteModule = {
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
      component: IFrame,
      meta: {
        frameSrc: '/streamx/#/system/token',
        title: 'Token Management',
      },
    },
    {
      path: 'user',
      name: 'SystemUser',
      component: IFrame,
      meta: {
        frameSrc: '/streamx/#/system/user',
        title: 'User Management',
      },
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: IFrame,
      meta: {
        frameSrc: '/streamx/#/system/role',
        title: 'Role Management',
      },
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: IFrame,
      meta: {
        frameSrc: '/streamx/#/system/menu',
        title: 'Router Management',
      },
    },
  ],
};

export default system;
