import { watch, Ref, unref, ref } from 'vue';
import { until, createEventHook, tryOnUnmounted } from '@vueuse/core';

import type { editor as Editor } from 'monaco-editor';
import setupMonaco from '/@/monaco';
import { useDark } from '@vueuse/core';
export const isDark = useDark();
interface EditorOption {
  code?: any;
  language: string;
  options?: Editor.IStandaloneEditorConstructionOptions;
}

export function useMonaco(target: Ref, options: EditorOption) {
  const changeEventHook = createEventHook<string>();
  const isSetup = ref(false);
  let editor: Editor.IStandaloneCodeEditor;

  const setContent = async (content: string) => {
    await until(isSetup).toBeTruthy();
    if (editor) editor.setValue(content);
  };

  const init = async () => {
    const { monaco } = await setupMonaco();
    watch(
      target,
      () => {
        const el = unref(target);
        if (!el) {
          return;
        }

        const model = monaco.editor.createModel(options.code, options.language);
        const defaultOptions = {
          model,
          tabSize: 2,
          insertSpaces: true,
          autoClosingQuotes: 'always',
          detectIndentation: false,
          folding: false,
          automaticLayout: true,
          theme: 'vs',
          minimap: {
            enabled: false,
          },
        };
        editor = monaco.editor.create(el, Object.assign(defaultOptions, options.options || {}));

        isSetup.value = true;
        watch(
          isDark,
          () => {
            if (isDark.value) monaco.editor.setTheme('vs-dark');
            else monaco.editor.setTheme('vs');
          },
          { immediate: true },
        );

        editor.getModel()?.onDidChangeContent(() => {
          changeEventHook.trigger(editor.getValue());
        });
      },
      {
        flush: 'post',
        immediate: true,
      },
    );
  };

  init();

  tryOnUnmounted(() => stop());

  return {
    onChange: changeEventHook.on,
    setContent,
  };
}
