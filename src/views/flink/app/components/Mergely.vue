<!--
  Licensed to the Apache Software Foundation (ASF) under one or more
  contributor license agreements.  See the NOTICE file distributed with
  this work for additional information regarding copyright ownership.
  The ASF licenses this file to You under the Apache License, Version 2.0
  (the "License"); you may not use this file except in compliance with
  the License.  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->
<script lang="ts" name="Mergely">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'Mergely',
  });
</script>
<script setup lang="ts">
  import setupMonaco from '/@/monaco';
  import { nextTick, Ref, ref, unref } from 'vue';
  import { getMonacoOptions } from '../data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { SvgIcon, Icon } from '/@/components/Icon';
  const emit = defineEmits(['ok', 'close', 'register']);
  const props = defineProps({
    readOnly: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  });
  const monaco = ref<Nullable<any>>(null);
  async function init() {
    const { monaco: monacoInstance } = await setupMonaco();
    monaco.value = monacoInstance;
  }
  init();
  const title = ref('edit configuration');
  const compareMode = ref(false);
  const visibleDiff = ref(false);
  const changed = ref(false);
  const targetValue = ref<Nullable<string>>(null);
  const originalValue = ref<Nullable<string>>(null);

  const monacoMergely = ref();
  const monacoConfig = ref();
  const loading = ref(false);
  let editor: Nullable<any> = null;

  /* 点击下一步 */
  function handleNext() {
    visibleDiff.value = true;
    title.value = 'Compare configuration';
    handleDifferent(unref(originalValue), unref(targetValue));
  }
  /* 开始diff比较 */
  function handleDifferent(original: Nullable<string>, modified: Nullable<string>) {
    if (!unref(monaco)) return;
    nextTick(() => {
      handleHeight(monacoMergely, 100);
      const originalModel = monaco.value.editor.createModel(original || '', 'yaml');
      const modifiedModel = monaco.value.editor.createModel(modified || '', 'yaml');
      const diffEditor = monaco.value.editor.createDiffEditor(monacoMergely.value, {
        language: 'yaml',
        ...(getMonacoOptions(props.readOnly) as any),
      });
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel,
      });
    });
  }

  /* 更改编辑器高度 */
  function handleHeight(ele: Ref, h: number) {
    const height = document.documentElement.offsetHeight || document.body.offsetHeight;
    unref(ele).style.height = height - h + 'px';
  }

  /* 关闭比对 */
  function handleCloseDiff() {
    title.value = 'Edit configuration';
    visibleDiff.value = false;
  }

  /* 点击确定 */
  function handleOk() {
    emit('ok', unref(targetValue));
    handleCancel();
  }

  /* 点击取消 */
  function handleCancel() {
    changed.value = false;
    targetValue.value = null;
    originalValue.value = null;
    visibleDiff.value = false;
    loading.value = false;
    emit('close');
  }
  const [registerMergelyDrawer] = useDrawerInner((data: { configOverride: string }) => {
    data && onReceiveDrawerData(data);
  });
  /* 数据接收 */
  function onReceiveDrawerData(data) {
    compareMode.value = false;
    changed.value = false;
    targetValue.value = null;
    originalValue.value = data.configOverride;
    if (props.readOnly) {
      title.value = 'Configuration detail';
    }
    nextTick(() => {
      if (editor == null) {
        editor = monaco.value.editor.create(unref(monacoConfig), {
          language: 'yaml',
          ...(getMonacoOptions(props.readOnly) as any),
        });
        editor.onDidChangeModelContent(() => {
          // 第一次
          if (targetValue.value) {
            changed.value = true;
          }
          targetValue.value = editor.getValue();
        });
        nextTick(() => {
          handleHeight(unref(monacoConfig), 130);
        });
      }
      nextTick(() => {
        visibleDiff.value = false;
        editor && editor.getModel().setValue(unref(originalValue));
      });
    });
  }
</script>

<template>
  <BasicDrawer
    @register="registerMergelyDrawer"
    :closable="false"
    :mask-closable="false"
    width="80%"
    class="drawer-conf"
  >
    <template #title>
      <SvgIcon v-if="readOnly" name="see" />
      <SvgIcon v-else name="edit" />
      {{ title }}
    </template>
    <div v-show="!visibleDiff">
      <div ref="monacoConfig"></div>
      <div class="drawer-bottom-button">
        <div style="float: right">
          <a-button type="primary" class="drwaer-button-item" @click="handleCancel">
            Cancel
          </a-button>
          <a-button v-if="changed" type="primary" class="drwaer-button-item" @click="handleNext()">
            <Icon icon="ant-design:edit-outlined" />
            Next
          </a-button>
        </div>
      </div>
    </div>

    <div v-if="visibleDiff">
      <div ref="monacoMergely"></div>
      <div class="drawer-bottom-button" style="position: absolute">
        <div style="float: right">
          <a-button
            v-if="changed"
            type="primary"
            class="drwaer-button-item"
            @click="handleCloseDiff"
          >
            <Icon icon="ant-design:left-outlined" />
            Previous
          </a-button>
          <a-button v-if="!compareMode" class="drwaer-button-item" type="primary" @click="handleOk">
            <Icon icon="ant-design:cloud-outlined" />
            Apply
          </a-button>
        </div>
      </div>
    </div>
  </BasicDrawer>
</template>
<style scoped>
  .drawer-conf :deep(.ant-drawer-body) {
    padding: 5px !important;
    padding-bottom: 0px !important;
  }

  .drawer-bottom-button {
    position: absolute;
    padding-top: 10px;
    padding-right: 50px;
    width: 100%;
    bottom: 10px;
    z-index: 9;
  }

  .drwaer-button-item {
    margin-right: 20px;
  }
</style>
