<template>
  <BasicModal v-bind="$attrs" :title="LogName" @ok="handleOk" @register="registerModal">
    <template #title>
      <svg-icon name="code" />&nbsp;
      {{ logName }}
    </template>
    <div id="terminal" ref="terminal" class="terminal"></div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { SvgIcon } from '/@/components/Icon';

  const props = defineProps({
    id: { type: Number, required: true },
    visible: { type: Boolean, default: false },
    logName: { type: String },
  });

  const [registerModal, { closeModal }] = useModalInner();

  function handleOk() {
    closeModal();
  }
</script>
