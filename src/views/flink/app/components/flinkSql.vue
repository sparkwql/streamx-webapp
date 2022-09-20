<script lang="ts">
  import { defineComponent, reactive, ref, unref } from 'vue';
  import { getMonacoOptions } from '../data';
  import { Icon } from '/@/components/Icon';
  import { useMonaco } from '/@/hooks/web/useMonaco';
  import { Button } from 'ant-design-vue';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { fetchFlinkSqlVerify } from '/@/api/flink/app/flinkSql';
  import { format } from '../FlinkSqlFormatter';
  import { useFullscreen } from '@vueuse/core';

  const ButtonGroup = Button.Group;

  export default defineComponent({
    name: 'FlinkSql',
  });
</script>

<script setup lang="ts" name="FlinkSql">
  const vertifyRes = reactive({
    errorMsg: '',
    verified: false,
    errorStart: 0,
    errorEnd: 0,
  });
  const flinkSql = ref();
  const flinkScreen = ref();
  const { isFullscreen, toggle } = useFullscreen(flinkScreen);
  const emit = defineEmits(['update:value']);
  const { createMessage } = useMessage();
  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    versionId: {
      type: String as PropType<Nullable<string>>,
    },
  });
  const defaultValue = '';

  /* 验证 */
  async function handleVerifySql() {
    if (isEmpty(props.value)) {
      vertifyRes.errorMsg = 'empty sql';
    }

    if (!props.versionId) {
      createMessage.error('please set flink version first.');
    } else {
      try {
        const { data } = await fetchFlinkSqlVerify({
          sql: props.value,
          versionId: props.versionId,
        });
        const success = data.data === true || data.data === 'true';
        if (success) {
          vertifyRes.errorMsg = '';
          syntaxError();
          return true;
        } else {
          vertifyRes.errorStart = parseInt(data.start);
          vertifyRes.errorEnd = parseInt(data.end);
          switch (data.type) {
            case 4:
              vertifyRes.errorMsg = 'Unsupported sql';
              break;
            case 5:
              vertifyRes.errorMsg = "SQL is not endWith ';'";
              break;
            default:
              vertifyRes.errorMsg = data.data.message;
              break;
          }
          syntaxError();
        }
      } catch (error) {
        console.error(error);
      }
    }
    vertifyRes.verified = true;
  }

  async function syntaxError() {
    const editor = await getInstance();
    if (editor) {
      const model = editor.getModel();
      const monaco = await getMonacoInstance();

      if (vertifyRes.errorMsg) {
        try {
          monaco.editor.setModelMarkers(model, 'sql', [
            {
              startLineNumber: 1,
              endLineNumber: 4,
              severity: monaco.MarkerSeverity.Error,
              message: 'dsadfs',
            },
          ]);
        } catch (e) {
          console.log(e);
        }
      } else {
        monaco.editor.setModelMarkers(model, 'sql', []);
      }
    }
  }
  /* 格式化 */
  function handleFormatSql() {
    const formatSql = format(props.value);
    setContent(formatSql);
  }
  /* 全屏 */
  function handleBigScreen() {
    toggle();
    unref(flinkSql).style.width = '0';
    setTimeout(() => {
      unref(flinkSql).style.width = '100%';
      unref(flinkSql).style.height = isFullscreen.value ? '100vh' : '550px';
    }, 100);
  }

  const { onChange, setContent, getInstance, getMonacoInstance } = useMonaco(flinkSql, {
    language: 'sql',
    code: props.value || defaultValue,
    options: {
      minimap: { enabled: true },
      ...(getMonacoOptions(false) as any),
    },
  });

  onChange((data) => {
    emit('update:value', data);
  });

  defineExpose({ handleVerifySql });
</script>

<template>
  <div>
    <div ref="flinkScreen">
      <div
        class="sql-box"
        ref="flinkSql"
        :class="'syntax-' + (vertifyRes.errorMsg ? 'false' : 'true')"
      ></div>

      <ButtonGroup class="flinksql-tool">
        <a-button class="flinksql-tool-item" type="primary" size="small" @click="handleVerifySql">
          <Icon icon="ant-design:check-outlined" />
          Verify
        </a-button>
        <a-button class="flinksql-tool-item" size="small" type="default" @click="handleFormatSql">
          <Icon icon="ant-design:thunderbolt-outlined" />
          Format
        </a-button>
        <a-button class="flinksql-tool-item" type="default" size="small" @click="handleBigScreen">
          <Icon
            :icon="
              isFullscreen
                ? 'ant-design:fullscreen-exit-outlined'
                : 'ant-design:fullscreen-outlined'
            "
          />
          {{ isFullscreen ? 'Exit' : '' }} Full Screen
        </a-button>
      </ButtonGroup>

      <p class="conf-desc mt-10px">
        <span class="text-red-600" v-if="vertifyRes.errorMsg"> {{ vertifyRes.errorMsg }} </span>
        <span v-else class="sql-desc text-green-600">
          <span v-if="vertifyRes.verified"> successful </span>
        </span>
      </p>
    </div>
  </div>
</template>

<style></style>
