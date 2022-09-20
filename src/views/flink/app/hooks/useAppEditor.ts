import { reactive, ref, unref } from 'vue';
import { getMonacoOptions } from '../data';

import setupMonaco from '/@/monaco';
export const useAppEditor = async () => {
  const flinkSql = ref();
  const pom = ref();
  const podTemplateBox = ref();
  const jmPodTemplateBox = ref();
  const tmPodTemplateBox = ref();

  const podTemplate = ref('');
  const jmPodTemplate = ref('');
  const tmPodTemplate = ref('');

  const { monaco } = await setupMonaco();

  const editorController = reactive<Recordable>({
    editor: {
      flinkSql: null,
      bigScreen: null,
      pom: null,
      podTemplate: null,
      jmPodTemplate: null,
      tmPodTemplate: null,
    },
    flinkSql: {
      defaultValue: '',
      value: null,
      errorMsg: null,
      errorStart: null,
      errorEnd: null,
      verified: false,
      success: true,
    },
    dependency: {
      pom: new Map(),
      jar: new Map(),
    },
    pom: {
      value: null,
      error: null,
      defaultValue: '',
    },
  });

  /* 初始化 flink 编辑器 */
  function initFlinkSqlEditor(value?: string) {
    if (unref(flinkSql)) return;
    if (unref(pom)) return;
    const options = Object.assign({}, getMonacoOptions(false), {
      language: 'sql',
      value: value || editorController?.flinkSql.defaultValue,
      minimap: { enabled: true },
    }) as any;
    editorController.editor.flinkSql = monaco.editor.create(unref(flinkSql), options);
    //输入事件触发...
    editorController.editor.flinkSql.onDidChangeModelContent(() => {
      editorController.flinkSql.value = editorController.editor.flinkSql.getValue();
    });
    //pom
    const pomOption = Object.assign({}, getMonacoOptions(false), {
      value: editorController.pom.defaultValue,
      language: 'xml',
      minimap: { enabled: false },
    }) as any;
    editorController.editor.pom = monaco.editor.create(unref(pom), pomOption);
    editorController.editor.pom.onDidChangeModelContent(() => {
      editorController.pom.value = editorController.editor.pom.getValue();
    });
  }

  function initPodTemplateEditor() {
    if (unref(podTemplateBox)) return;
    const basePodTmplOption = Object.assign({}, getMonacoOptions(false), {
      language: 'yaml',
      minimap: { enabled: false },
    }) as any;

    // pod template
    const podTmplOption = Object.assign({}, basePodTmplOption, { value: unref(podTemplate) });
    editorController.editor.podTemplate = monaco.editor.create(
      unref(podTemplateBox),
      podTmplOption,
    );
    editorController.editor.podTemplate.onDidChangeModelContent(() => {
      podTemplate.value = editorController.editor.podTemplate.getValue();
    });

    // jm pod template
    const jmPodTmplOption = Object.assign({}, basePodTmplOption, { value: unref(jmPodTemplate) });
    editorController.editor.jmPodTemplate = monaco.editor.create(
      unref(jmPodTemplateBox),
      jmPodTmplOption,
    );
    editorController.editor.jmPodTemplate.onDidChangeModelContent(() => {
      jmPodTemplateBox.value = editorController.editor.jmPodTemplate.getValue();
    });

    // tm pod template
    const tmPodTmplOption = Object.assign({}, basePodTmplOption, {
      value: unref(tmPodTemplate),
    });
    editorController.editor.tmPodTemplate = monaco.editor.create(
      unref(tmPodTemplateBox),
      tmPodTmplOption,
    );
    editorController.editor.tmPodTemplate.onDidChangeModelContent(() => {
      tmPodTemplate.value = editorController.editor.tmPodTemplate.getValue();
    });
  }

  return {
    initFlinkSqlEditor,
    initPodTemplateEditor,
  };
};
