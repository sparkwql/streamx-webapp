<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> Add Token</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:copy-outlined',
              tooltip: 'Copy Token',
              onClick: handleCopy.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: 'Delete Token',
              popConfirm: {
                title: 'delete token, are you sure',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <TokenDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, unref } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import TokenDrawer from './TokenDrawer.vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useDrawer } from '/@/components/Drawer';
  import { deleteToken, getTokenList } from '/@/api/sys/token';
  import { columns, searchFormSchema } from './token.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'User',
    components: { BasicTable, TokenDrawer, TableAction },
    setup() {
      const { notification, createMessage } = useMessage();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { clipboardRef, copiedRef } = useCopyToClipboard();
      const [registerTable, { reload, expandAll, updateTableDataRecord }] = useTable({
        title: '',
        api: getTokenList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: true,
        pagination: true,
        striped: false,
        useSearchForm: true,
        showTableSetting: false,
        bordered: true,
        rowKey: 'tokenId',
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

      function handleCopy(record: Recordable) {
        clipboardRef.value = record.token;
        unref(copiedRef) && createMessage.success('copy success！');
      }

      function handleView(record: Recordable) {
        console.log(record);
      }

      function handleDelete(record: Recordable) {
        deleteToken({ tokenId: record.id });
      }

      // function handleSuccess() {
      //   reload();
      // }

      function handleSuccess({ isUpdate, values }) {
        notification.success({
          message: 'Tip',
          description: 'Success',
        });
        isUpdate ? updateTableDataRecord(values.tokenId, values) : reload();
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
        handleCopy,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        handleView,
      };
    },
  });
</script>
