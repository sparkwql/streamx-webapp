import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: 'User Name',
    dataIndex: 'username',
    width: 200,
    align: 'left',
  },
  {
    title: 'Nick Name',
    dataIndex: 'nickName',
  },
  {
    title: 'Team',
    dataIndex: 'teamName',
    width: 180,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 0;
      const color = enable ? 'red' : 'green';
      const text = enable ? 'Effective' : 'locked';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'teamId',
    label: 'Team',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'All Team', value: '0' },
        { label: 'BIGDATA', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'username',
    label: 'User Name',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'username',
    label: 'User Name',
    component: 'Input',
    required: true,
  },
  {
    field: 'nickName',
    label: 'Nick Name',
    component: 'Input',
    required: true,
  },
  {
    field: 'email',
    label: 'E-Mail',
    component: 'Input',
  },
  {
    field: 'password',
    label: 'Password',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => {
      console.log(values);
      return !values.password;
    },
  },
  {
    field: 'description',
    label: 'Description',
    component: 'Input',
  },
  {
    field: 'status',
    label: 'Status',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: 'locked', value: '0' },
        { label: 'effective', value: '1' },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'sex',
    label: 'Gender',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: 'male', value: '0' },
        { label: 'female', value: '1' },
        { label: 'secret', value: '2' },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
];

export const editFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: 'User Name',
    component: 'Input',
  },
  {
    field: 'nickName',
    label: 'Nick Name',
    component: 'Input',
  },
  {
    field: 'email',
    label: 'E-Mail',
    component: 'Input',
  },
  {
    field: 'description',
    label: 'Description',
    component: 'Input',
  },
  {
    field: 'status',
    label: 'Status',
    component: 'RadioGroup',
    defaultValue: '0',
    required: true,
    componentProps: {
      options: [
        { label: 'locked', value: '0' },
        { label: 'effective', value: '1' },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'sex',
    label: 'Gender',
    component: 'RadioGroup',
    defaultValue: '0',
    required: true,
    componentProps: {
      options: [
        { label: 'male', value: '0' },
        { label: 'female', value: '1' },
        { label: 'secret', value: '2' },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
];
