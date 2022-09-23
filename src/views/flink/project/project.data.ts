import { FormSchema } from '/@/components/Form';
import { branches, isExist } from '/@/api/flink/project';

export const enum BuildStatusEnum {
  All = ' ',
  NotBuild = '-1',
  Building = '0',
  BuildSuccess = '1',
  BuildFail = '2',
  NeedBuild = '-2',
}

interface Status {
  label?: string;
  key?: string;
}

export const statusList: Status[] = [
  {
    label: 'All',
    key: BuildStatusEnum.All,
  },
  {
    label: 'Not Build',
    key: BuildStatusEnum.NotBuild,
  },
  {
    label: 'Building',
    key: BuildStatusEnum.Building,
  },
  {
    label: 'Build Success',
    key: BuildStatusEnum.BuildSuccess,
  },
  {
    label: 'Build Failed',
    key: BuildStatusEnum.BuildFail,
  },
];

export const buildStateMap = {
  [BuildStatusEnum.NotBuild]: {
    color: '#C0C0C0',
    label: 'NOT BUILD',
  },
  [BuildStatusEnum.NeedBuild]: {
    color: '#FFA500',
    label: 'NEED REBUILD',
  },
  [BuildStatusEnum.Building]: {
    color: '#1AB58E',
    label: 'BUILDING',
    className: 'status-processing-building',
  },
  [BuildStatusEnum.BuildSuccess]: {
    color: '#52c41a',
    label: 'SUCCESSFUL',
  },
  [BuildStatusEnum.BuildFail]: {
    color: '#f5222d',
    label: 'FAILED',
  },
};

export enum ProjectType {
  Flink = 1,
  Spark = 2,
}

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: 'Project Name',
    component: 'Input',
    rules: [
      {
        validator: async (_, value) => {
          if (!value) {
            return Promise.reject('The Project Name is required');
          }
          const res = await isExist({ name: value });
          if (!res) {
            return Promise.reject(`The Project Name is already exists. Please check`);
          }
        },
        trigger: 'blur',
      },
    ],
    componentProps: {
      placeholder: 'the project name',
    },
  },
  {
    field: 'type',
    label: 'Project Type',
    component: 'Select',
    required: true,
    defaultValue: 1,
    componentProps: {
      options: [
        {
          label: 'apache flink',
          value: 1,
          key: '1',
        },
        {
          label: 'apache spark',
          value: 2,
          key: '2',
        },
      ],
      placeholder: 'the project type',
    },
  },
  {
    field: 'repository',
    label: 'CVS',
    component: 'Input',
    rules: [
      {
        required: true,
        message: 'CVS is required',
      },
    ],
    componentProps: {
      options: [
        {
          label: 'GitHub/GitLab',
          value: 1,
          key: '1',
        },
        {
          label: 'Subversion',
          value: 2,
          key: '2',
        },
      ],
      placeholder: 'CVS',
    },
  },
  {
    field: 'url',
    label: 'Repository URL',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: 'The Repository URL for this project',
    },
  },
  {
    field: 'userName',
    label: 'UserName',
    component: 'Input',
    dynamicRules: ({ values }) => {
      return values.password ? [{ required: true, message: 'Password is required' }] : [];
    },
    componentProps: {
      placeholder: 'UserName for this project',
    },
  },
  {
    field: 'password',
    label: 'Password',
    component: 'InputPassword',
    dynamicRules: ({ values }) => {
      return values.userName ? [{ required: true, message: 'UserName is required' }] : [];
    },
    componentProps: {
      placeholder: 'Password for this project',
    },
  },
  {
    field: 'branches',
    label: 'Branches',
    component: 'ApiSelect',
    required: true,
    componentProps: ({ formModel }) => {
      return {
        api: branches,
        params: {
          userName: formModel.userName,
          password: formModel.password,
          url: formModel.url,
        },
        placeholder: 'Select a branch',
      };
    },
  },
  {
    field: 'pom',
    label: 'POM',
    component: 'Input',
    componentProps: {
      placeholder:
        'By default,lookup pom.xml in root path,You can manually specify the module to compile pom.xml"',
    },
  },
  {
    field: 'buildArgs',
    label: 'Build Argument',
    component: 'InputTextArea',
    componentProps: {
      placeholder: 'Build Argument, e.g: -Pprod',
    },
  },
  {
    field: 'description',
    label: 'description',
    component: 'InputTextArea',
    componentProps: {
      placeholder: 'Description for this project',
    },
  },
];
