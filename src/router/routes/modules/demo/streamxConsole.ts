import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

const system: AppRouteModule = {
  path: '/streamx-flink',
  name: 'StreamxFlink',
  component: LAYOUT,
  redirect: '/streamx-flink/app',
  meta: {
    orderNo: 1,
    icon: 'ion:settings-outline',
    title: 'Streamx',
  },
  children: [
    {
      path: 'project',
      name: 'FlinkProject',
      component: IFrame,
      meta: {
        frameSrc: '/streamx/#/flink/project',
        title: 'Project',
      },
    },
    {
      path: 'app',
      name: 'FlinkApp',
      component: IFrame,
      meta: {
        frameSrc: '/streamx/#/flink/app',
        title: 'Application',
      },
    },
    {
      path: 'notebook',
      name: 'FlinkNotebook',
      component: IFrame,
      meta: {
        frameSrc: '/streamx/#/flink/notebook/view',
        title: 'Notebook',
      },
    },
    {
      path: 'setting',
      name: 'FlinkSetting',
      component: IFrame,
      meta: {
        frameSrc: '/streamx/#/flink/setting',
        title: 'Setting',
      },
    },
  ],
};

export default system;
