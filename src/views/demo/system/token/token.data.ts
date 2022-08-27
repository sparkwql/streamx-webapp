import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { setTokenStatus } from '/@/api/sys/token';
import { getNoTokenUserList } from '/@/api/sys/user';

// status enum
const enum StatusEnum {
  On = 1,
  Off = 0,
}

export const columns: BasicColumn[] = [
  {
    title: 'User Name',
    dataIndex: 'username',
    width: 150,
    sorter: true,
  },
  {
    title: 'Token',
    width: 250,
    dataIndex: 'token',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
  },
  {
    title: 'Expire Time',
    dataIndex: 'expireTime',
    sorter: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === StatusEnum.On,
        checkedChildren: 'on',
        unCheckedChildren: 'off',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? StatusEnum.On : StatusEnum.Off;
          const { createMessage } = useMessage();
          setTokenStatus({ tokenId: record.id })
            .then(() => {
              record.status = newStatus;
              createMessage.success(`success`);
            })
            .catch(() => {
              createMessage.error('fail');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: 'User Name',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'userId',
    label: 'User',
    component: 'ApiSelect',
    componentProps: {
      api: getNoTokenUserList,
      resultField: 'records',
      labelField: 'username',
      valueField: 'userId',
    },
  },
  {
    field: 'description',
    label: 'Description',
    component: 'InputTextArea',
  },
  {
    field: 'ExpireTime',
    label: 'expireTime',
    component: 'DatePicker',
  },
];
