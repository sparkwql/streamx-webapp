<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="60%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from './project.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { createProject, updateProject } from '/@/api/flink/project';

  export default defineComponent({
    name: 'ProjectDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 22, md: 22 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        updateSchema(formSchema);

        if (unref(isUpdate)) {
          setFieldsValue({ ...data.record });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? 'Add Project' : 'Edit Project'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });

          unref(isUpdate) ? await updateProject(values) : await createProject(values);
          closeDrawer();
          emit('success', { isUpdate, values });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
