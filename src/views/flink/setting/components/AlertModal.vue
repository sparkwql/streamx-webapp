<script setup lang="ts" name="AlertNodal">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { SvgIcon } from '/@/components/Icon';
  import { fetchExistsAlert } from '/@/api/flink/setting/alert';
  import { ref } from 'vue';
  import { Select } from 'ant-design-vue';
  const SelectOption = Select.Option;
  const props = defineProps({
    alertId: {
      type: String,
      default: '',
    },
  });
  const alertTypes = ref([
    { name: 'E-mail', value: 1, disabled: false, icon: 'mail' },
    { name: 'Ding Talk', value: 2, disabled: false, icon: 'dingtalk' },
    { name: 'Wechat', value: 4, disabled: false, icon: 'wecom' },
    { name: 'SMS', value: 8, disabled: true, icon: 'message' },
    { name: 'Lark', value: 16, disabled: false, icon: 'lark' },
  ]);
  const [registerModal] = useModalInner();
  const [registerForm] = useForm({
    labelWidth: 160,
    colon: true,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    labelCol: { lg: 5, sm: 7 },
    wrapperCol: { lg: 16, sm: 4 },
    schemas: [
      {
        field: 'alertName',
        label: 'Alert Name',
        component: 'Input',
        componentProps: { allowClear: true, placeholder: 'Please enter alert name' },
        itemProps: { help: 'the alert name, e.g: streamx team alert' },
        colProps: {
          style: { marginBottom: '20px' },
        },
        dynamicRules: () => {
          return [
            {
              validator: async (_, value) => {
                if (value === null || value === undefined || value === '') {
                  return Promise.reject('Alert Name is required');
                } else {
                  if (!props.alertId) {
                    try {
                      await fetchExistsAlert({ alertName: value, isJsonType: true });
                      return Promise.resolve();
                    } catch (error) {
                      return Promise.reject('error happened ,caused by: ' + error);
                    }
                  }
                }
                return Promise.resolve();
              },
              required: true,
              message: 'Alert Name is required',
            },
          ];
        },
      },
      {
        field: 'alertType',
        label: 'Fault Alert Type',
        component: 'Input',
        slot: 'type',
        rules: [{ required: true }],
      },
    ],
  });
  // async function handleSubmit() {
  //   const formValue = await submit();
  //   console.log('formValue', formValue);
  // }
</script>

<template>
  <BasicModal @register="registerModal" v-bind="$attrs">
    <template #title>
      <SvgIcon name="alarm" size="25" />
      Alert Setting
    </template>
    <BasicForm @register="registerForm">
      <template #type="{ model, field }">
        <Select v-model:value="model[field]" placeholder="Alert Type" allowClear>
          <SelectOption
            v-for="(o, index) in alertTypes"
            :key="`alertType_${index}`"
            :disabled="o.disabled"
            :value="o.value"
          >
            <SvgIcon :name="o.icon" />
            {{ o.name }}
          </SelectOption>
        </Select>
      </template>
    </BasicForm>
  </BasicModal>
</template>
