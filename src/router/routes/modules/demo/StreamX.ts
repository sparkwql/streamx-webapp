import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const streamxConsole: AppRouteModule = {
  path: '/flink',
  name: 'Flink',
  component: LAYOUT,
  redirect: '/flink/app',
  meta: {
    orderNo: 1,
    icon: 'fluent:stream-input-20-regular',
    title: 'StreamX',
  },
  children: [
    {
      path: 'project',
      name: 'FlinkProject',
      component: () => import('/@/views/flink/project/Project.vue'),
      meta: {
        icon: 'arcticons:projectm',
        title: 'Project',
      },
    },
    {
      path: 'app',
      name: 'FlinkApp',
      component: () => import('/@/views/flink/app/index.vue'),
      meta: {
        icon: 'arcticons:tinc-app',
        title: 'Application',
      },
    },
    {
      path: 'notebook',
      name: 'FlinkNotebook',
      component: () => import('/@/views/flink/notebook/Submit.vue'),
      meta: {
        icon: 'ep:notebook',
        title: 'Notebook',
      },
    },
    {
      path: 'setting',
      name: 'FlinkSetting',
      component: () => import('/@/views/flink/setting/index.vue'),
      meta: {
        icon: 'ion:settings-outline',
        title: 'Setting',
      },
    },
  ],
};

export default streamxConsole;
