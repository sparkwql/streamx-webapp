<script setup lang="ts" name="MavenSetting">
  import { List, Input, Switch } from 'ant-design-vue';
  import { SvgIcon } from '/@/components/Icon';
  import { SystemSetting } from '/@/api/flink/setting/types/setting.type';
  import { fetchSystemSettingUpdate } from '/@/api/flink/setting';
  import { useMessage } from '/@/hooks/web/useMessage';

  const AvatarMap = {
    'streamx.maven.central.repository': 'maven',
    'streamx.maven.auth.user': 'user',
    'streamx.maven.auth.password': 'mvnpass',
    'docker.register.address': 'docker',
    'docker.register.namespace': 'namespace',
    'docker.register.user': 'auth',
    'docker.register.password': 'password',
    'alert.email.host': 'host',
    'alert.email.port': 'port',
    'alert.email.from': 'mail',
    'alert.email.userName': 'user',
    'alert.email.password': 'keys',
    'alert.email.ssl': 'ssl',
    'streamx.console.webapp.address': 'http',
  };

  const ListItem = List.Item;
  const ListItemMeta = ListItem.Meta;

  const emits = defineEmits(['updateValue', 'reload']);
  defineProps({
    data: {
      type: Array as PropType<SystemSetting[]>,
      required: true,
    },
    isPassword: {
      type: Function as PropType<(item: Recordable) => boolean>,
      required: true,
    },
  });

  const { createMessage } = useMessage();
  function handleSwitch(record: SystemSetting) {
    emits('updateValue', record);
  }
  /* 编辑输入 */
  function handleEdit(record: SystemSetting) {
    if (!record.editable) {
      record.submitting = true;
    }
    record.editable = !record.editable;
  }
  /* 编辑提交 */
  async function handleSubmit(record: SystemSetting) {
    record.submitting = false;
    record.editable = false;
    await fetchSystemSettingUpdate({
      settingKey: record.settingKey,
      settingValue: record.settingValue,
    });
    createMessage.success('submit successfully');
    emits('reload');
  }
</script>

<template>
  <List>
    <template v-for="item in data" :key="item.settingKey">
      <ListItem>
        <ListItemMeta :title="item.settingName" :description="item.description" style="width: 50%">
          <template #avatar>
            <div class="avatar">
              <SvgIcon :name="AvatarMap[item.settingKey]" />
            </div>
          </template>
        </ListItemMeta>
        <div class="list-content" style="width: 50%">
          <div class="list-content-item" style="width: 100%">
            <template v-if="item.type === 1">
              <Input
                :type="isPassword(item) ? 'password' : 'text'"
                v-if="item.editable"
                v-model:value="item.settingValue"
                :class="item.settingKey.replace(/\./g, '_')"
                placeholder="Please enter"
                class="ant-input"
              />
              <div v-else style="width: 100%; text-align: right">
                <span v-if="isPassword(item) && item.settingValue !== null"> ******** </span>
                <span v-else>{{ item.settingValue }}</span>
              </div>
            </template>
            <template v-else>
              <Switch
                checked-children="ON"
                un-checked-children="OFF"
                style="float: right; margin-right: 30px"
                :default-checked="item.settingValue === 'true'"
                @change="handleSwitch(item)"
              />
            </template>
          </div>
        </div>
        <template #actions>
          <div v-if="item.type === 1">
            <a v-if="!item.submitting" @click="handleEdit(item)">Edit</a>
            <a v-else @click="handleSubmit(item)">Submit</a>
          </div>
        </template>
      </ListItem>
    </template>
  </List>
</template>
