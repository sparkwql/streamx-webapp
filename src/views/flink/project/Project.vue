<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> Add User </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: 'modify',
              auth: 'user:edit',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'clarity:info-standard-line',
              tooltip: 'view detail',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              auth: 'user:reset',
              tooltip: 'reset password',
              popConfirm: {
                title: 'reset password, are you sure',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import MenuDrawer from './MenuDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { deleteUser, getUserList } from '/@/api/sys/user';
  import { columns, searchFormSchema } from './project.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'User',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { notification } = useMessage();
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        title: 'User List',
        api: getUserList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        rowKey: 'userId',
        isTreeTable: true,
        pagination: true,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: false,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 120,
          title: 'Operation',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      // see detail
      function handleView(record: Recordable) {
        console.log(record);
      }

      // delete current user
      function handleDelete(record: Recordable) {
        deleteUser({ userId: record.userId });
      }

      // add/edit user success
      function handleSuccess({ isUpdate, values }) {
        notification.success({
          message: 'Tip',
          description: 'Success',
        });
        isUpdate ? updateTableDataRecord(values.userId, values) : reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleView,
      };
    },
  });
</script>
