<script lang="ts" setup name="FlinkEnvDraw">
  import { ref, reactive } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { SyncOutlined } from '@ant-design/icons-vue';
  import { useMonaco } from '/@/hooks/web/useMonaco';
  import { FlinkEnvResponse } from '/@/api/flink/setting/types/flinkEnv.type';
  import { fetchFlinkInfo, fetchFlinkSync } from '/@/api/flink/setting/flinkEnv';
  import { useMessage } from '/@/hooks/web/useMessage';

  const flinkInfo = reactive<Recordable>({});
  const conf = ref();
  const syncLoading = ref(false);
  const { createMessage } = useMessage();
  const [registerDrawer] = useDrawerInner((data: FlinkEnvResponse) => {
    Object.assign(flinkInfo, data);
    setContent(flinkInfo.flinkConf);
    const height = document.documentElement.offsetHeight || document.body.offsetHeight;
    conf.value.style.height = height - 210 + 'px';
  });

  const { setContent } = useMonaco(conf, {
    language: 'yaml',
    options: {
      selectOnLineNumbers: false,
      foldingStrategy: 'indentation', // 代码分小段折叠
      overviewRulerBorder: false, // 不要滚动条边框
      tabSize: 2, // tab 缩进长度
      readOnly: true,
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 5,
      lineHeight: 24,
      automaticLayout: true,
      cursorStyle: 'line',
      cursorWidth: 3,
      renderFinalNewline: true,
      renderLineHighlight: 'all',
      quickSuggestionsDelay: 100, //代码提示延时
      minimap: { enabled: true },
      scrollbar: {
        useShadows: false,
        vertical: 'visible',
        horizontal: 'visible',
        horizontalSliderSize: 5,
        verticalSliderSize: 5,
        horizontalScrollbarSize: 15,
        verticalScrollbarSize: 15,
      },
    },
  });
  /* 同步配置 */
  async function handleSync() {
    try {
      syncLoading.value = true;
      await fetchFlinkSync(flinkInfo.id);
      const flinkResult = await fetchFlinkInfo(flinkInfo.id);
      Object.assign(flinkInfo, flinkResult);
      setContent(flinkInfo.flinkConf);
      createMessage.success(flinkResult.flinkName.concat(' conf sync successful!'));
    } catch (error) {
      console.error(error);
    } finally {
      syncLoading.value = false;
    }
  }
</script>
<template>
  <BasicDrawer title="Flink Conf" @register="registerDrawer" width="40%" placement="right">
    <div style="padding-bottom: 15px"> Flink Home: &nbsp;&nbsp; {{ flinkInfo.flinkHome }} </div>
    <div>
      Flink Conf:
      <div class="py-15px">
        <div ref="conf" style="height: 120px"></div>
        <a-button
          type="primary"
          class="float-right mt-10px mr-130px"
          @click="handleSync"
          :loading="syncLoading"
        >
          <SyncOutlined />
          Sync Conf
        </a-button>
      </div>
    </div>
  </BasicDrawer>
</template>
