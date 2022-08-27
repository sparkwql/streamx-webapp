import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { getRoleListByUser } from '/@/api/sys/role';
import { getTeamListByUser } from '/@/api/sys/team';

// user status enum
const enum StatusEnum {
  Effective = '1',
  Locked = '0',
}

export const columns: BasicColumn[] = [
  {
    title: 'User Name',
    dataIndex: 'username',
    width: 200,
    align: 'left',
    sorter: true,
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
      const enable = record?.status === StatusEnum.Effective;
      const color = enable ? 'green' : 'red';
      const text = enable ? 'Effective' : 'locked';
      return h(Tag, { color }, () => text);
    },
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
    width: 180,
    sorter: true,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: 'Team',
    field: 'teamId',
    component: 'ApiSelect',
    componentProps: {
      api: getTeamListByUser,
      resultField: 'records',
      labelField: 'teamName',
      valueField: 'teamId',
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

export const formSchema = (isUpdate = false): FormSchema[] => {
  return [
    {
      field: 'userId',
      label: 'User Id',
      component: 'Input',
      show: false,
    },
    {
      field: 'username',
      label: 'User Name',
      component: 'Input',
      required: !isUpdate,

      componentProps: {
        readonly: isUpdate,
      },
    },
    {
      field: 'nickName',
      label: 'Nick Name',
      component: 'Input',
      required: !isUpdate,
      componentProps: {
        readonly: isUpdate,
      },
    },
    {
      field: 'password',
      label: 'Password',
      component: 'InputPassword',
      required: true,
      ifShow: !isUpdate,
    },
    {
      field: 'email',
      label: 'E-Mail',
      component: 'Input',
      componentProps: {
        placeholder: 'input email',
      },
    },
    {
      label: 'Role',
      field: 'roleId',
      component: 'ApiSelect',
      componentProps: {
        api: getRoleListByUser,
        resultField: 'records',
        labelField: 'roleName',
        valueField: 'roleId',
        mode: 'multiple',
      },
      required: true,
    },
    {
      label: 'Team',
      field: 'teamId',
      component: 'ApiSelect',
      componentProps: {
        api: getTeamListByUser,
        resultField: 'records',
        labelField: 'teamName',
        valueField: 'teamId',
      },
      required: true,
      show: !isUpdate,
    },
    {
      field: 'status',
      label: 'Status',
      component: 'RadioGroup',
      defaultValue: '0',
      componentProps: {
        options: [
          { label: 'locked', value: StatusEnum.Locked },
          { label: 'effective', value: StatusEnum.Effective },
        ],
      },
      required: true,
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
      required: true,
    },
  ];
};
