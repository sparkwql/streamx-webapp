<script setup lang="ts" name="SystemSetting">
  import { Collapse } from 'ant-design-vue';
  import { ref, onMounted, computed } from 'vue';
  import { fetchSystemSetting } from '/@/api/flink/setting';
  import { SystemSetting } from '/@/api/flink/types/settingType';
  import SettingList from './SettingList.vue';
  import { fetchSystemSettingUpdate } from '/@/api/flink/setting/alert';
  import { useMessage } from '/@/hooks/web/useMessage';

  const CollapsePane = Collapse.Panel;
  const { createMessage } = useMessage();
  const settings = ref<SystemSetting[]>([]);

  const settingsList = computed(() => {
    return [
      {
        key: 1,
        title: 'Maven Setting',
        isPassword: (item) => item.settingKey === 'streamx.maven.auth.password',
        data: settings.value.filter((i) => i.settingKey.indexOf('streamx.maven') > -1),
      },
      {
        key: 2,
        title: 'Docker Setting',
        isPassword: (item) => item.settingKey === 'docker.register.password',
        data: settings.value.filter((i) => i.settingKey.indexOf('docker.register') > -1),
      },
      {
        key: 3,
        title: 'Sender Email Setting',
        isPassword: (item) => item.settingKey === 'alert.email.password',
        data: settings.value.filter((i) => i.settingKey.indexOf('alert.email') > -1),
      },
      {
        key: 4,
        title: 'Console Setting',
        isPassword: () => false,
        data: settings.value.filter((i) => i.settingKey.indexOf('streamx.console') > -1),
      },
    ];
  });
  const collapseActive = ref(['1', '2', '3', '4']);
  /* 获取所有系统设置 */
  async function getSettingAll() {
    const res = await fetchSystemSetting();
    settings.value = res;
  }

  /* 更新设置值 */
  async function handleSettingUpdate(record: SystemSetting) {
    await fetchSystemSettingUpdate({
      settingKey: record.settingKey,
      settingValue: record.settingValue !== 'true',
    });
    createMessage.success('setting updated successfully');
    getSettingAll();
  }

  onMounted(() => {
    getSettingAll();
  });
</script>

<template>
  <Collapse class="collapse" v-model:activeKey="collapseActive">
    <CollapsePane v-for="item in settingsList" :key="item.key" :header="item.title">
      <div class="bg-white">
        <SettingList
          :data="item.data"
          :isPassword="item.isPassword"
          @update-value="handleSettingUpdate"
          @reload="getSettingAll"
        />
      </div>
    </CollapsePane>
  </Collapse>
</template>
