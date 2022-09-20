<script setup lang="ts">
  import * as monaco from 'monaco-editor';
  import { nextTick, Ref, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  const emit = defineEmits(['ok', 'close']);
  const props = defineProps({
    visiable: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    readOnly: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  });
  const title = ref('edit configuration');
  const compareMode = ref(false);
  const visibleDiff = ref(false);
  const changed = ref(false);
  const targetValue = ref<Nullable<string>>(null);
  const originalValue = ref<Nullable<string>>(null);

  const monacoMergely = ref();
  const loading = ref(false);

  /* monaco 编辑器配置 */
  function getMonacoOption(): any {
    return {
      language: 'yaml',
      selectOnLineNumbers: false,
      foldingStrategy: 'indentation', // 代码分小段折叠
      overviewRulerBorder: false, // 不要滚动条边框
      autoClosingBrackets: 'always',
      tabSize: 2, // tab 缩进长度
      readOnly: unref(props.readOnly),
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 5,
      lineHeight: 24,
      automaticLayout: true,
      cursorBlinking: 'blink',
      cursorStyle: 'line',
      cursorWidth: 3,
      renderFinalNewline: true,
      renderLineHighlight: 'all',
      quickSuggestionsDelay: 100, //代码提示延时
      scrollbar: {
        useShadows: false,
        vertical: 'visible',
        horizontal: 'visible',
        horizontalSliderSize: 5,
        verticalSliderSize: 5,
        horizontalScrollbarSize: 15,
        verticalScrollbarSize: 15,
      },
    };
  }

  /* 点击下一步 */
  function handleNext() {
    visibleDiff.value = true;
    title.value = 'Compare configuration';
    handleDifferent(unref(originalValue), unref(targetValue));
  }
  /* 开始diff比较 */
  function handleDifferent(original: Nullable<string>, modified: Nullable<string>) {
    nextTick(() => {
      handleHeight(monacoMergely, 100);
      const originalModel = monaco.editor.createModel(original || '', 'yaml');
      const modifiedModel = monaco.editor.createModel(modified || '', 'yaml');
      const diffEditor = monaco.editor.createDiffEditor(monacoMergely.value, getMonacoOption());
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
  const [registerMergelyDrawer] = useDrawerInner();
</script>
<template>
  <BasicDrawer @register="registerMergelyDrawer" width="80%" class="drawer-conf">
    <template #title>
      <SvgIcon v-if="readOnly" name="see" />
      <SvgIcon v-else name="edit" />
      {{ title }}
    </template>
    <div v-show="!visibleDiff">
      <div id="monaco_config"></div>
      <div class="drawer-bottom-button">
        <div style="float: right">
          <a-button type="primary" class="drwaer-button-item" @click="handleCancel">
            Cancel
          </a-button>
          <a-button v-if="changed" type="primary" class="drwaer-button-item" @click="handleNext()">
            <a-icon type="right" />
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
            <a-icon type="left" />
            Previous
          </a-button>
          <a-button
            v-if="!compareMode"
            class="drwaer-button-item"
            type="primary"
            icon="cloud"
            @click="handleOk"
          >
            Apply
          </a-button>
        </div>
      </div>
    </div>
  </BasicDrawer>
</template>
<style scoped>
  .drawer-conf >>> .ant-drawer-body {
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
