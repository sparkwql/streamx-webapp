import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: 'Role Name',
    dataIndex: 'roleName',
  },
  {
    title: 'Description',
    dataIndex: 'remark',
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
  },
  {
    title: 'Modify Time',
    dataIndex: 'modifyTime',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: 'Role',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'createTime',
    label: 'Create Time',
    component: 'DatePicker',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'roleValue',
    label: '角色值',
    required: true,
    component: 'Input',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: ' ',
    field: 'menu',
    slot: 'menu',
    component: 'Input',
  },
];
