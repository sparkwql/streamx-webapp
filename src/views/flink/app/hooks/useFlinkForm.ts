import { h, onMounted, reactive, ref, unref } from 'vue';
import { useForm } from '/@/components/Form';
import { Icon, SvgIcon } from '/@/components/Icon';
import options from '../data/option';
import { fetchFlinkEnv } from '/@/api/flink/setting/flinkEnv';
import { fetchFlinkCluster } from '/@/api/flink/setting/flinkCluster';
import { FlinkClusterResponse } from '/@/api/flink/setting/types/flinkCluster.type';
import {
  fetchFlinkBaseImages,
  fetchK8sNamespaces,
  fetchSessionClusterIds,
} from '/@/api/flink/app/flinkHistory';
import { executionModes, k8sRestExposedType, resolveOrder } from '../data';
import { fetchCheckHadoop } from '/@/api/flink/setting';
import {
  fetchCheckName,
  fetchListConf,
  fetchListJars,
  fetchMain,
  fetchSelect,
} from '/@/api/flink/app';
import { fetchAlertSetting } from '/@/api/flink/setting/alert';
import { useRouter } from 'vue-router';

export const useAddFlinkForm = () => {
  const router = useRouter();
  const flinkEnvs = ref<Array<{ id: string; flinkName: string; isDefault?: boolean }>>([]);
  const flinkClusters = ref<FlinkClusterResponse[]>([]);
  const historyRecord = reactive<Record<string, Array<string>>>({
    uploadJars: [],
    k8sNamespace: [],
    k8sSessionClusterId: [],
    flinkImage: [],
    podTemplate: [],
    jmPodTemplate: [],
    tmPodTemplate: [],
  });
  const moduleList = ref<Array<{ name: string }>>([]);
  // const jobType = ref('');

  function filterOption(input, option) {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  /* 
  !原项目也未赋值 
  */
  function getConfigSchemas() {
    return [];
  }
  function handleEditConfig(config: string) {
    console.log('config', config);
  }
  const [registerAppForm, { setFieldsValue, updateSchema }] = useForm({
    labelCol: { lg: { span: 5, offset: 0 }, sm: { span: 7, offset: 0 } },
    wrapperCol: { lg: { span: 16, offset: 0 }, sm: { span: 17, offset: 0 } },
    baseColProps: { span: 24 },
    colon: true,
    schemas: [
      {
        field: 'jobType',
        label: 'Development Mode',
        component: 'Select',
        componentProps: ({ formModel }) => {
          return {
            placeholder: 'Please select Development Mode',
            options: [
              {
                label: h('div', {}, [
                  h(Icon, { icon: 'ant-design:code-outlined', color: '#108ee9' }, ''),
                  h('span', { class: 'pl-10px' }, 'Custom Code'),
                ]),
                value: 'customcode',
              },
              {
                label: h('div', {}, [
                  h(SvgIcon, { name: 'fql', color: '#108ee9' }, ''),
                  h('span', { class: 'pl-10px' }, 'Flink SQL'),
                ]),
                value: 'sql',
              },
            ],
            onChange: (value) => {
              handleInitForm();
              if (value === 'sql') {
                formModel.tableEnv = 1;
              } else {
                formModel.resourceFrom = 'csv';
              }
            },
          };
        },
        defaultValue: 'sql',
        rules: [{ required: true, message: 'Job Type is required' }],
      },
      {
        field: 'versionId',
        label: 'Flink Version',
        component: 'Select',
        componentProps: {
          fieldNames: { label: 'flinkName', value: 'id', options: 'options' },
        },
        rules: [{ required: true, message: 'Flink Version is required' }],
      },
      {
        field: 'executionMode',
        label: 'Execution Mode',
        component: 'Select',
        componentProps: {
          placeholder: 'Please select Execution Mode',
          options: executionModes,
        },
        dynamicRules: () => {
          return [
            {
              required: true,
              validator: async (_rule, value) => {
                if (value === null || value === undefined || value === '') {
                  return Promise.reject('Execution Mode is required');
                } else {
                  if ([2, 3, 4].includes(value)) {
                    const res = await fetchCheckHadoop();
                    if (res) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        'Hadoop environment initialization failed, please check the environment settings',
                      );
                    }
                  }
                  return Promise.resolve();
                }
              },
            },
          ];
        },
      },
      {
        field: 'flinkClusterId',
        label: 'Flink Cluster',
        component: 'Select',
        componentProps: ({ formModel }) => {
          return {
            allowClear: true,
            placeholder: 'Flink Cluster',
            options: unref(flinkClusters).reduce((pre: Recordable[], item: Recordable) => {
              if (item.executionMode === formModel.executionMode) {
                pre.push({ label: item.clusterName, value: item.id });
              }
              return pre;
            }, []),
          };
        },
        ifShow: ({ values }) => values.executionMode == 1,
        rules: [{ required: true, message: 'Flink Cluster is required' }],
      },
      {
        field: 'yarnSessionClusterId',
        label: 'Yarn Session ClusterId',
        component: 'Select',
        componentProps: ({ formModel }) => {
          return {
            allowClear: true,
            placeholder: 'Flink Cluster',
            options: unref(flinkClusters).reduce((pre: Recordable[], item: Recordable) => {
              if (item.executionMode === formModel.executionMode) {
                pre.push({ label: item.clusterName, value: item.clusterId });
              }
              return pre;
            }, []),
          };
        },
        ifShow: ({ values }) => values.executionMode == 3,
        rules: [{ required: true, message: 'Flink Cluster is required' }],
      },
      {
        field: 'k8sNamespace',
        label: 'Kubernetes Namespace',
        component: 'Input',
        ifShow: ({ values }) => [5, 6].includes(values.executionMode),
        slot: 'k8sNamespace',
      },
      {
        field: 'clusterId',
        label: 'Kubernetes ClusterId',
        component: 'Input',
        componentProps: {
          placeholder: 'Please enter Kubernetes clusterId',
          allowClear: true,
        },
        ifShow: ({ values }) => values.executionMode == 6,
        rules: [{ required: true, message: 'Kubernetes clusterId is required' }],
      },
      {
        field: 'clusterId',
        label: 'Kubernetes ClusterId',
        component: 'Select',
        componentProps: {
          placeholder: 'Please enter Kubernetes clusterId',
          allowClear: true,
          fieldNames: { label: 'clusterName', value: 'id', options: 'options' },
        },
        ifShow: ({ values }) => values.executionMode == 5,
        rules: [{ required: true, message: 'Kubernetes clusterId is required' }],
      },
      {
        field: 'flinkImage',
        label: 'Flink Base Docker Image',
        component: 'Input',
        ifShow: ({ values }) => values.executionMode == 6,
        slot: 'flinkImage',
        rules: [{ required: true, message: 'Flink Base Docker Image is required' }],
      },
      {
        field: 'k8sRestExposedType',
        label: 'Rest-Service Exposed Type',
        ifShow: ({ values }) => values.executionMode == 6,
        component: 'Select',
        componentProps: {
          placeholder: 'kubernetes.rest-service.exposed.type',
          allowClear: true,
          options: k8sRestExposedType,
        },
      },
      {
        field: 'flinkSql',
        label: 'Flink SQL',
        component: 'Select',
        slot: 'flinkSql',
        ifShow: ({ values }) => values?.jobType == 'sql',
      },
      {
        field: 'dependency',
        label: 'Dependency',
        component: 'Select',
        slot: 'dependency',
        ifShow: ({ values }) => values?.jobType == 'sql',
      },
      {
        field: 'isSetConfig',
        label: 'Application Conf',
        component: 'Switch',
        slot: 'isSetConfig',
        ifShow: ({ values }) => values.jobType == 'sql',
      },
      {
        field: 'resourceFrom',
        label: 'Resource From',
        component: 'Select',
        componentProps: {
          placeholder: 'Please select resource from',
          options: [
            {
              label: h('div', {}, [
                h(SvgIcon, { name: 'github' }, ''),
                h('span', { class: 'pl-10px' }, 'CICD'),
                h('span', { class: 'gray' }, '(build from CVS)'),
              ]),
              value: 'csv',
            },
            {
              label: h('div', {}, [
                h(SvgIcon, { name: 'upload' }, ''),
                h('span', { class: 'pl-10px' }, 'Upload'),
                h('span', { class: 'gray' }, '(upload local job)'),
              ]),
              value: 'upload',
            },
          ],
        },
        rules: [{ required: true, message: 'resource from is required' }],
        ifShow: ({ values }) => values?.jobType != 'sql',
      },
      {
        field: 'uploadJobJar',
        label: 'Upload Job Jar',
        component: 'Select',
        slot: 'uploadJobJar',
        ifShow: ({ values }) => values?.jobType !== 'sql' && values?.resourceFrom === 'upload',
      },
      {
        field: 'mainClass',
        label: 'Program Main',
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: 'Please enter Main class',
        },
        ifShow: ({ values }) => values?.jobType !== 'sql' && values?.resourceFrom == 'upload',
        rules: [{ required: true, message: 'Program Main is required' }],
      },
      {
        field: 'project',
        label: 'Project',
        component: 'Select',
        componentProps: {
          showSearch: true,
          optionFilterProp: 'children',
          filterOption: filterOption,
          allowClear: true,
          placeholder: 'Please select Project',
          fieldNames: { label: 'name', value: 'id', options: 'options' },
          options: [],
        },
        ifShow: ({ values }) => values?.jobType !== 'sql' && values.resourceFrom !== 'upload',
        rules: [{ required: true, message: 'Project is required' }],
      },
      {
        field: 'module',
        label: 'Module',
        component: 'Select',
        componentProps: ({ formModel }) => {
          return {
            showSearch: true,
            optionFilterProp: 'children',
            filterOption: filterOption,
            allowClear: true,
            placeholder: 'Please select module of this project',
            options: unref(moduleList),
            onChange: () => {
              Object.assign(formModel, {
                appType: undefined,
                config: undefined,
                jobName: undefined,
              });
            },
          };
        },
        ifShow: ({ values }) => values?.jobType !== 'sql' && values?.resourceFrom !== 'upload',
        rules: [{ required: true, message: 'Project is required' }],
      },
      {
        field: 'appType',
        label: 'Application Type',
        component: 'Select',
        componentProps: ({ formModel }) => {
          return {
            placeholder: 'Please select Application type',
            options: [
              { label: 'StreamPark Flink', value: '1' },
              { label: 'Apache Flink', value: '2' },
            ],
            onChange: async () => {
              Object.assign(formModel, {
                config: undefined,
                jobName: undefined,
              });
            },
          };
        },
        ifShow: ({ values }) => values?.jobType !== 'sql' && values?.resourceFrom !== 'upload',
        rules: [{ required: true, message: 'Application Type is required' }],
      },
      {
        field: 'jar',
        label: 'Program Jar',
        component: 'Select',
        componentProps: async ({ formModel }) => {
          const res = await fetchListJars({
            id: formModel.projectId,
            module: formModel.module,
          });
          return {
            placeholder: 'Please select Application type',
            options: res.map((i) => ({ label: i, value: i })),
            onChange: async (value) => {
              const res = await fetchMain({
                projectId: formModel.projectId,
                module: formModel.module,
                jar: value,
              });
              formModel.mainClass = res;
            },
          };
        },
        ifShow: ({ values }) =>
          values?.jobType !== 'sql' && values?.resourceFrom !== 'upload' && values.appType == 2,
        rules: [{ required: true, message: 'Program Jar is required' }],
      },
      {
        field: 'mainClass',
        label: 'Program Main',
        component: 'Input',
        componentProps: {
          placeholder: 'Please enter Main class',
          allowClear: true,
        },
        ifShow: ({ values }) =>
          values?.jobType !== 'sql' && values?.resourceFrom !== 'upload' && values.appType == 2,
        rules: [{ required: true, message: 'Program Main is required' }],
      },
      {
        field: 'config',
        label: 'Application conf',
        component: 'ApiTreeSelect',
        componentProps: ({ formModel }) => {
          const componentProps = {
            api: fetchListConf,
            beforeFetch: () => {
              return {
                id: formModel.projectId,
                module: formModel.module,
              };
            },
            dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
            placeholder: 'Please select config',
            treeDefaultExpandAll: true,
          };
          if (formModel.config) {
            Object.assign(componentProps, {
              suffixIcon: h(Icon, {
                icon: 'ant-design:setting-twotone',
                twoToneColor: '#4a9ff5',
                title: 'edit config',
                onClick: handleEditConfig.bind(null, formModel.config),
              }),
            });
          }
          return componentProps;
        },
        ifShow: ({ values }) =>
          values?.jobType !== 'sql' && values?.resourceFrom !== 'upload' && values.appType == 1,
        dynamicRules: () => {
          return [
            {
              required: true,
              validator: (_rule, value) => {
                if (value) {
                  const isProp = value.endsWith('.properties');
                  const isYaml = value.endsWith('.yaml') || value.endsWith('.yml');
                  if (!isProp && !isYaml) {
                    return Promise.reject(
                      'The configuration file must be (.properties|.yaml|.yml)',
                    );
                  } else {
                    return Promise.resolve();
                  }
                } else {
                  return Promise.reject('Please select config');
                }
              },
            },
          ];
        },
      },
      {
        field: 'useSysHadoopConf',
        label: 'Use System Hadoop Conf',
        component: 'Switch',
        slot: 'useSysHadoopConf',
        ifShow: ({ values }) => values.executionMode == 6,
      },
      {
        field: 'jobName',
        label: 'Application Name',
        component: 'Input',
        componentProps: {
          placeholder: 'Please enter jobName',
          allowClear: true,
        },
        dynamicRules: () => {
          return [
            {
              required: true,
              trigger: 'blur',
              validator: async (_rule, value) => {
                if (value === null || value === undefined || value === '') {
                  return Promise.reject('Application Name is required');
                } else {
                  const res = await fetchCheckName({ jobName: value });
                  switch (parseInt(res)) {
                    case 0:
                      return Promise.resolve();
                    case 1:
                      return Promise.reject(
                        'application name must be unique. The application name already exists',
                      );
                    case 2:
                      return Promise.reject(
                        'The application name is already running in yarn,cannot be repeated. Please check',
                      );
                    case 3:
                      return Promise.reject(
                        'The application name is already running in k8s,cannot be repeated. Please check',
                      );
                    default:
                      return Promise.reject(
                        'The application name is invalid.characters must be (Chinese|English|"-"|"_"),two consecutive spaces cannot appear.Please check',
                      );
                  }
                }
              },
            },
          ];
        },
      },
      {
        field: 'tags',
        label: 'Tags',
        component: 'Input',
        componentProps: {
          placeholder: 'Please enter tags,if more than one, separate them with commas(,)',
          allowClear: true,
        },
      },
      {
        field: 'resolveOrder',
        label: 'Resolve Order',
        component: 'Select',
        componentProps: {
          placeholder: 'classloader.resolve-order',
          allowClear: true,
          options: resolveOrder,
        },
        defaultValue: 0,
        rules: [{ required: true, message: 'Resolve Order is required', type: 'number' }],
      },
      {
        field: 'parallelism',
        label: 'Parallelism',
        component: 'InputNumber',
        componentProps: {
          placeholder: 'The parallelism with which to run the program',
          min: 1,
          step: 1,
        },
      },
      {
        field: 'slot',
        label: 'Task Slots',
        component: 'InputNumber',
        componentProps: {
          placeholder: 'Number of slots per TaskManager',
          min: 1,
          step: 1,
        },
      },
      {
        field: 'restartSize',
        label: 'Fault Restart Size',
        component: 'InputNumber',
        componentProps: {
          placeholder: 'restart max size',
          min: 1,
          step: 1,
        },
        show: ({ values }) => ![5, 6].includes(values.executionMode),
      },
      {
        field: 'cpMaxFailureInterval',
        label: 'CheckPoint Failure Options',
        component: 'InputNumber',
        slot: 'cpMaxFailureInterval',
        show: ({ values }) => ![5, 6].includes(values.executionMode),
      },
      {
        field: 'alertId',
        label: 'Fault Alert Template',
        component: 'Select',
        componentProps: {
          placeholder: 'Alert Template',
          fieldNames: { label: 'alertName', value: 'id', options: 'options' },
        },
      },
      ...getConfigSchemas(),
      {
        field: 'totalOptions',
        label: 'Total Memory Options',
        component: 'Select',
        slot: 'totalOptions',
      },
      { field: 'totalItem', label: 'totalItem', component: 'Select', colSlot: 'totalItem' },
      {
        field: 'jmOptions',
        label: 'JM Memory Options',
        component: 'Select',
        componentProps: {
          showSearch: true,
          allowClear: true,
          mode: 'multiple',
          maxTagCount: 2,
          placeholder: 'Please select the resource parameters to set',
          fieldNames: { label: 'name', value: 'key', options: 'options' },
          options: options.filter((x) => x.group === 'jobmanager-memory'),
        },
      },
      {
        field: 'jmOptionsItem',
        label: 'jmOptionsItem',
        component: 'Select',
        colSlot: 'jmOptionsItem',
      },
      {
        field: 'tmOptions',
        label: 'TM Memory Options',
        component: 'Select',
        componentProps: {
          showSearch: true,
          allowClear: true,
          mode: 'multiple',
          maxTagCount: 2,
          placeholder: 'Please select the resource parameters to set',
          fieldNames: { label: 'name', value: 'key', options: 'options' },
          options: options.filter((x) => x.group === 'taskmanager-memory'),
        },
      },
      {
        field: 'tmOptionsItem',
        label: 'tmOptionsItem',
        component: 'Select',
        colSlot: 'tmOptionsItem',
      },
      {
        field: 'yarnQueue',
        label: 'Yarn Queue',
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: 'Please enter yarn queue',
        },
        ifShow: ({ values }) => values.executionMode == 4,
      },
      {
        field: 'podTemplate',
        label: 'Kubernetes Pod Template',
        component: 'Input',
        slot: 'podTemplate',
        ifShow: ({ values }) => values.executionMode == 6,
      },
      {
        field: 'dynamicOptions',
        label: 'Dynamic Option',
        component: 'Input',
        slot: 'dynamicOptions',
      },
      {
        field: 'args',
        label: 'Program Args',
        component: 'InputTextArea',
        componentProps: {
          rows: 4,
          placeholder: '<arguments>',
        },
        ifShow: ({ values }) => values.jobType == 'customcode',
      },
      {
        field: 'description',
        label: 'Description',
        component: 'InputTextArea',
        componentProps: {
          rows: 4,
          placeholder: 'Please enter description for this application',
        },
      },
    ],
    submitButtonOptions: { text: 'Submit' },
    resetButtonOptions: { text: 'Cancel' },
    resetFunc: async () => router.go(-1),
    showAdvancedButton: false,
    actionColOptions: { span: 20 },
  });
  /* 初始化表单 */
  async function handleInitForm() {
    const defaultValue = {
      resolveOrder: 0,
      k8sRestExposedType: 0,
      restartSize: 1,
    };
    options.forEach((item) => {
      defaultValue[item.key] = item.defaultValue;
    });
    const v = flinkEnvs.value.filter((v) => v.isDefault)[0];
    Object.assign(defaultValue, { versionId: v.id });

    setFieldsValue(defaultValue);
    const cluster = await fetchFlinkCluster();
    flinkClusters.value = cluster;
  }

  onMounted(async () => {
    const res = await fetchFlinkEnv();
    if (res.length > 0) {
      flinkEnvs.value = res;
      updateSchema([
        {
          field: 'versionId',
          componentProps: {
            options: unref(flinkEnvs),
          },
        },
      ]);
    }
    handleInitForm();
    /* 获取项目数据 */
    const projectList = await fetchSelect();
    /* 获取告警数据 */
    const alerts = await fetchAlertSetting();
    updateSchema([
      { field: 'project', componentProps: { options: projectList } },
      { field: 'alertId', componentProps: { options: alerts } },
    ]);
    historyRecord.k8sNamespace = await fetchK8sNamespaces();
    historyRecord.k8sSessionClusterId = await fetchSessionClusterIds({ executionMode: 5 });
    historyRecord.flinkImage = await fetchFlinkBaseImages();
  });
  return { registerAppForm, setFieldsValue, flinkEnvs, historyRecord };
};
