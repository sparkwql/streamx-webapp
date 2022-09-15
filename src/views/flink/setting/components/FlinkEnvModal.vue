<script lang="ts">
  import { defineComponent } from 'vue';
  import {
    fetchExistsEnv,
    fetchFlinkCreate,
    fetchFlinkUpdate,
  } from '/@/api/flink/setting/flinkEnv';
  export default defineComponent({
    name: 'FlinkModal',
  });
</script>
<script lang="ts" setup name="FlinkModal">
  import { h, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { SvgIcon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['reload', 'register']);
  const versionId = ref<string | null>(null);

  const { createConfirm, createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 120,
    colon: true,
    showActionButtonGroup: false,
    labelCol: { lg: 7, sm: 7 },
    wrapperCol: { lg: 16, sm: 4 },
    baseColProps: { span: 24 },
    schemas: [
      {
        field: 'flinkName',
        label: 'Flink Name',
        component: 'Input',
        componentProps: {
          placeholder: 'Please enter flink name',
          allowClear: true,
        },
        helpMessage: 'the flink name, e.g: flink-1.12 ',
        rules: [{ required: true, message: 'flink name is required' }],
      },
      {
        field: 'flinkHome',
        label: 'Flink Home',
        component: 'Input',
        componentProps: {
          placeholder: 'Please enter flink home',
          allowClear: true,
        },
        helpMessage: 'The absolute path of the FLINK_HOME',
        rules: [{ required: true, message: 'flink home is required' }],
      },
      {
        field: 'description',
        label: 'Description',
        component: 'InputTextArea',
        componentProps: {
          placeholder: 'Please enter description',
          allowClear: true,
        },
      },
    ],
  });
  const [registerModalInner, { changeOkLoading, closeModal }] = useModalInner(async (data) => {
    resetFields();
    if (data) {
      versionId.value = data.versionId;
      setFieldsValue(data);
    }
  });
  // setModalProps({
  //   afterClose: () => {
  //     resetFields();
  //   },
  // });
  /* 表单提交 */
  async function handleSubmit() {
    try {
      changeOkLoading(true);
      const formValue = await validate();
      // 检测环境
      const isExist = await fetchExistsEnv({
        id: versionId.value,
        flinkName: formValue.flinkName,
        flinkHome: formValue.flinkHome,
      });
      // 环境检测成功
      if (isExist) {
        // 创建
        if (versionId.value == null) {
          const { data } = await fetchFlinkCreate(formValue);
          if (data.data) {
            createMessage.success('create successfully');
            closeModal();
            emit('reload');
          } else {
            createMessage.error(data.message.replaceAll(/\[StreamPark]/g, ''));
          }
        } else {
          //更新
          const { data } = await fetchFlinkUpdate({
            id: versionId.value,
            ...formValue,
          });
          if (data.data) {
            createMessage.success(formValue.flinkName.concat(' update successful!'));
            closeModal();
            emit('reload');
          } else {
            createMessage.error(data.message.replaceAll(/\[StreamPark]/g, ''));
          }
        }
      } else {
        createConfirm({
          iconType: 'error',
          title: 'Failed',
          content: 'can no found flink-dist or found multiple flink-dist, FLINK_HOME error',
        });
      }
    } catch (error: any) {
      /* 自定义提示消息 */
      if (error?.response?.data?.message) {
        createConfirm({
          iconType: 'error',
          title: 'Operation Failed',
          content: h(
            'div',
            { class: 'whitespace-pre-wrap' },
            error?.response?.data?.message.replaceAll(/\[StreamPark]/g, ''),
          ),
        });
      } else {
        console.error(error);
        createMessage.error('error');
      }
    } finally {
      changeOkLoading(false);
    }
  }
</script>
<template>
  <BasicModal @register="registerModalInner" v-bind="$attrs" @ok="handleSubmit">
    <template #title>
      <SvgIcon name="flink" />
      Add Flink
    </template>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<style lang="less"></style>
