<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="40%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { DrawerTypeEnum, formSchema } from './user.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { addUser, updateUser } from '/@/api/sys/user';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const drawerType = ref(DrawerTypeEnum.View);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate, clearValidate }] =
        useForm({
          labelWidth: 120,
          schemas: formSchema(unref(drawerType)),
          showActionButtonGroup: false,
          baseColProps: { lg: 22, md: 22 },
        });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({
          confirmLoading: false,
          showFooter: data.drawerType !== DrawerTypeEnum.View,
        });
        drawerType.value = data.drawerType;

        updateSchema(formSchema(unref(drawerType)));

        if (unref(drawerType) !== DrawerTypeEnum.Create) {
          const roleIds = data.record?.roleId ?? [];
          data.record.roleId = Array.isArray(roleIds) ? roleIds : roleIds.split(',');
          setFieldsValue({
            ...data.record,
          });
          clearValidate('username');
          clearValidate('nickname');
        }
      });

      const getTitle = computed(() => {
        return {
          [DrawerTypeEnum.Create]: 'Add User',
          [DrawerTypeEnum.Edit]: 'Edit User',
          [DrawerTypeEnum.View]: 'View User',
        }[unref(drawerType)];
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          unref(drawerType) === DrawerTypeEnum.Edit
            ? await updateUser(values)
            : await addUser(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
