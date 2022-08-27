<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增用户 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: 'modify',
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
  import { defineComponent, nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import MenuDrawer from './MenuDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { getUserList } from '/@/api/sys/user';
  import { columns, searchFormSchema } from './team.data';

  export default defineComponent({
    name: 'User',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, expandAll, updateTableDataRecord }] = useTable({
        title: '用户列表',
        api: getUserList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        rowKey: 'teamId',
        isTreeTable: true,
        pagination: true,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
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

      function handleView(record: Recordable) {
        console.log(record);
      }

      function handleDelete(record: Recordable) {
        console.log(record);
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
          console.log(result);
        } else {
          reload();
        }
      }

      function onFetchSuccess(res) {
        console.log(res);
        // 演示默认展开所有表项
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        handleView,
      };
    },
  });
</script>
