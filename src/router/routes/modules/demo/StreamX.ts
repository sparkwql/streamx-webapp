import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const streamxConsole: AppRouteModule = {
  path: '/streamx-flink',
  name: 'StreamxFlink',
  component: LAYOUT,
  redirect: '/streamx-flink/app',
  meta: {
    orderNo: 1,
    icon: 'ion:settings-outline',
    title: 'StreamX',
  },
  children: [
    {
      path: 'project',
      name: 'FlinkProject',
      component: () => import('/@/views/demo/comp/button/index.vue'),
      meta: {
        title: 'Project',
      },
    },
    {
      path: 'app',
      name: 'FlinkApp',
      component: () => import('/@/views/demo/comp/button/index.vue'),
      meta: {
        title: 'Application',
      },
    },
    {
      path: 'notebook',
      name: 'FlinkNotebook',
      component: () => import('/@/views/demo/comp/button/index.vue'),
      meta: {
        title: 'Notebook',
      },
    },
    {
      path: 'setting',
      name: 'FlinkSetting',
      component: () => import('/@/views/demo/comp/button/index.vue'),
      meta: {
        title: 'Setting',
      },
    },
  ],
};

export default streamxConsole;
