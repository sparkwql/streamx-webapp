<script setup lang="ts" name="AppCreate">
  import {
    Input,
    Dropdown,
    Menu,
    Switch,
    Select,
    Space,
    Popover,
    Tag,
    InputNumber,
    Form,
  } from 'ant-design-vue';
  import { reactive, ref, unref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { PageWrapper } from '/@/components/Page';
  import { useAddFlinkForm } from './hooks/useFlinkForm';
  import { BasicForm } from '/@/components/Form';
  import { SettingTwoTone } from '@ant-design/icons-vue';
  import { cpTriggerAction, descriptionFilter } from './data';
  import options from './data/option';
  import { useDrawer } from '/@/components/Drawer';
  import Mergely from './components/Mergely.vue';
  import { handleConfTemplate } from '/@/api/flink/config';
  import { decodeByBase64 } from '/@/utils/cipher';
  import FlinkSqlEditor from './components/flinkSql.vue';
  import Dependency from './components/Dependency.vue';
  import PomTemplateTab from './components/PomTemplateTab.vue';
  import HadoopConfDrawer from './components/HadoopConfDrawer.vue';
  import UploadDragger from './components/UploadDragger.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useAppSubmit } from './hooks/useAppSubmit';
  import { fetchMain, fetchUpload } from '/@/api/flink/app';

  const MenuItem = Menu.Item;
  const InputGroup = Input.Group;
  const InputTextArea = Input.TextArea;
  const SelectOption = Select.Option;
  const FormItem = Form.Item;

  const flinkSql = ref();
  const dependencyRef = ref();
  const uploadLoading = ref(false);
  const uploadJar = ref('');
  const configOverride = ref<Nullable<string>>(null);
  const k8sTemplate = reactive({
    podTemplate: '',
    jmPodTemplate: '',
    tmPodTemplate: '',
  });

  const { createMessage } = useMessage();
  const { registerAppForm, setFieldsValue, historyRecord, flinkEnvs } = useAddFlinkForm();
  const [registerConfDrawer, { openDrawer: openConfDrawer }] = useDrawer();
  const [registerHadoopConf, { openDrawer: openHadoopConfDrawer }] = useDrawer();
  const { handleSubmitCustomJob, handleSubmitSQL } = useAppSubmit(
    flinkEnvs,
    k8sTemplate,
    configOverride,
    () => unref(dependencyRef)?.handleApplyPom(),
    uploadJar,
  );
  function handleCheckCheckpoint(values: Recordable) {
    const { cpMaxFailureInterval, cpFailureRateInterval, cpFailureAction } = values;
    if (cpMaxFailureInterval != null && cpFailureRateInterval != null && cpFailureAction != null) {
      if (cpFailureAction === 1) {
        const alertEmail = values.alertEmail;
        if (alertEmail == null) {
          // this.form.setFields({
          //   alertEmail: {
          //     errors: [new Error('checkPoint failure trigger is alert,email must not be empty')],
          //   },
          // });
          return Promise.reject('trigger action is alert,email must not be empty');
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    } else if (
      cpMaxFailureInterval == null &&
      cpFailureRateInterval == null &&
      cpFailureAction == null
    ) {
      return Promise.resolve();
    } else {
      return Promise.reject('options all required or all empty');
    }
  }

  /* 打开sqlConf drawer */
  async function handleSQLConf(checked: boolean) {
    if (checked) {
      if (unref(configOverride) != null) {
        openConfDrawer(true, {
          configOverride: unref(configOverride),
        });
      } else {
        const res = await handleConfTemplate();
        openConfDrawer(true, {
          configOverride: decodeByBase64(res),
        });
      }
    } else {
      openConfDrawer(false);
      configOverride.value = null;
      setFieldsValue({ isSetConfig: false });
    }
  }

  /* conf drawer 点击确定 */
  function handleEditConfOk(value: Nullable<string>) {
    if (value == null || !value.replace(/^\s+|\s+$/gm, '')) {
      setFieldsValue({ isSetConfig: false });
      configOverride.value = null;
    } else {
      setFieldsValue({ isSetConfig: true });
      configOverride.value = value;
    }
  }

  /* conf drawer 点击关闭 */
  function handleEditConfClose() {
    if (!unref(configOverride)) {
      setFieldsValue({ isSetConfig: false });
    }
    openConfDrawer(false);
  }

  /* 获取totalOptions 的选择项 */
  function getTotalOptions() {
    return [
      {
        name: 'process memory(进程总内存)',
        options: options.filter((x) => x.group === 'process-memory'),
      },
      {
        name: 'total memory(Flink 总内存)',
        options: options.filter((x) => x.group === 'total-memory'),
      },
    ];
  }

  function hasOptions(items) {
    return options.filter((x) => items.includes(x.key)) as any;
  }
  /* 自定义job 上传 */
  async function handleCustomJobRequest(data) {
    const formData = new FormData();
    formData.append('file', data.file);
    try {
      const path = await fetchUpload(formData);
      uploadLoading.value = false;
      uploadJar.value = data.file.name;
      const res = await fetchMain({
        jar: path,
      });
      setFieldsValue({ mainClass: res });
    } catch (error) {
      console.error(error);
    } finally {
      uploadLoading.value = false;
    }
  }
  /* 提交创建 */
  function handleAppCreate(formValue: Recordable) {
    console.log(formValue);
    if (formValue.jobType === 'sql') {
      if (formValue.flinkSql == null || formValue.flinkSql.trim() === '') {
        createMessage.warning('Flink Sql is required');
      } else {
        const access = flinkSql?.value?.handleVerifySql();
        if (!access) return;
      }
    }
    if (formValue.jobType === 'customcode') {
      handleSubmitCustomJob(formValue);
    } else {
      handleSubmitSQL(formValue);
    }
  }
</script>

<template>
  <PageWrapper contentFullHeight contentBackground contentClass="p-24px app_controller">
    <BasicForm @register="registerAppForm" @submit="handleAppCreate">
      <template #k8sNamespace="{ model, field }">
        <Input type="text" placeholder="default" v-model:value="model[field]" allowClear>
          <template #addonAfter>
            <Dropdown placement="bottomRight">
              <template #overlay>
                <Menu trigger="['click', 'hover']">
                  <MenuItem
                    v-for="item in historyRecord.k8sNamespace"
                    :key="item"
                    @click="model[field] = item"
                    class="pr-60px"
                  >
                    <Icon icon="ant-design:plus-circle-outlined" />
                    {{ item }}
                  </MenuItem>
                </Menu>
              </template>
              <Icon icon="ant-design:history-outlined" />
            </Dropdown>
          </template>
        </Input>
      </template>
      <template #clusterId="{ model, field }">
        <Input
          type="text"
          placeholder="Please enter Kubernetes clusterId"
          v-model:value="model[field]"
          allowClear
        >
          <template #addonAfter v-if="model && model.executionMode == 5">
            <Dropdown placement="bottomRight">
              <template #overlay>
                <Menu trigger="['click', 'hover']">
                  <MenuItem
                    v-for="item in historyRecord.k8sSessionClusterId"
                    :key="item"
                    @click="model[field] = item"
                    class="pr-60px"
                  >
                    <Icon icon="ant-design:plus-circle-outlined" />
                    {{ item }}
                  </MenuItem>
                </Menu>
              </template>
              <Icon icon="ant-design:history-outlined" />
            </Dropdown>
          </template>
        </Input>
      </template>
      <template #flinkSql="{ model, field }">
        <FlinkSqlEditor
          ref="flinkSql"
          v-model:value="model[field]"
          :versionId="model['versionId']"
        />
      </template>
      <template #dependency="{ model, field }">
        <Dependency
          ref="dependencyRef"
          v-model:value="model[field]"
          :form-model="model"
          :flink-envs="flinkEnvs"
        />
      </template>
      <template #flinkImage="{ model, field }">
        <Input
          type="text"
          placeholder="Please enter the tag of Flink base docker image, such as: flink:1.13.0-scala_2.11-java8"
          v-model:value="model[field]"
          allowClear
        >
          <template #addonAfter>
            <Dropdown placement="bottomRight">
              <template #overlay>
                <Menu trigger="['click', 'hover']">
                  <MenuItem
                    v-for="item in historyRecord.flinkImage"
                    :key="item"
                    @click="model[field] = item"
                    class="pr-60px"
                  >
                    <Icon icon="ant-design:plus-circle-outlined" />
                    {{ item }}
                  </MenuItem>
                </Menu>
              </template>
              <Icon icon="ant-design:history-outlined" />
            </Dropdown>
          </template>
        </Input>
      </template>
      <template #isSetConfig="{ model, field }">
        <div v-show="model['executionMode'] !== 5 && model['executionMode'] !== 6">
          <Switch checked-children="ON" un-checked-children="OFF" v-model:checked="model[field]" />
          <SettingTwoTone
            v-if="model[field]"
            class="ml-10px"
            theme="twoTone"
            two-tone-color="#4a9ff5"
            @click="handleSQLConf(true)"
          />
        </div>
      </template>
      <template #uploadJobJar>
        <UploadDragger
          :custom-request="handleCustomJobRequest"
          v-model:loading="uploadLoading"
          :uploadJar="uploadJar"
          :show-upload-info="true"
        />
      </template>
      <template #cpMaxFailureInterval="{ model }">
        <InputGroup compact>
          <FormItem
            name="cpMaxFailureInterval"
            :rules="{ trigger: 'change', validator: () => handleCheckCheckpoint(model) }"
          >
            <InputNumber
              :min="1"
              :step="1"
              placeholder="checkpoint failure rate interval"
              allow-clear
              class="!w-260px mr-10px"
              v-model:value="model.cpMaxFailureInterval"
            />
          </FormItem>

          <a-button style="width: 70px"> minute </a-button>
          <FormItem
            name="cpFailureRateInterval"
            :rules="{ trigger: 'change', validator: () => handleCheckCheckpoint(model) }"
            style="margin-left: 1%"
          >
            <InputNumber
              :min="1"
              :step="1"
              placeholder="max failures per interval"
              class="!w-200px"
              v-model:value="model.cpFailureRateInterval"
            />
          </FormItem>

          <a-button style="width: 70px"> count </a-button>
          <FormItem
            name="cpFailureAction"
            :rules="{ trigger: 'change', validator: () => handleCheckCheckpoint(model) }"
            style="margin-left: 1%"
          >
            <Select
              placeholder="trigger action"
              allow-clear
              class="!w-170px"
              v-model:value="model.cpFailureAction"
            >
              <SelectOption v-for="o in cpTriggerAction" :key="o.value">
                <Icon
                  :icon="o.value === 1 ? 'ant-design:alert-outlined' : 'ant-design:sync-outlined'"
                />
                {{ o.label }}
              </SelectOption>
            </Select>
          </FormItem>
        </InputGroup>

        <p class="conf-desc my-0">
          <span class="note-info">
            <Tag color="#2db7f5" class="tag-note">Note</Tag>
            Operation after checkpoint failure, e.g:<br />
            Within <span class="note-elem">5 minutes</span>(checkpoint failure rate interval), if
            the number of checkpoint failures reaches <span class="note-elem">10</span> (max
            failures per interval),action will be triggered(alert or restart job)
          </span>
        </p>
      </template>
      <template #totalOptions="{ model, field }">
        <Select
          show-search
          allow-clear
          mode="multiple"
          :max-tag-count="2"
          :options="getTotalOptions()"
          :field-names="{ label: 'name', value: 'key', options: 'options' }"
          v-model:value="model[field]"
          placeholder="Please select the resource parameters to set"
        />
        <p class="conf-desc mt-10px">
          <span class="note-info">
            <Tag color="#2db7f5" class="tag-note">Note</Tag>
            <span>Explicitly configuring both</span>
            <span class="note-elem">total process memory</span> and
            <span class="note-elem">total Flink memory</span> is not recommended. It may lead to
            deployment failures due to potential memory configuration conflicts. Configuring other
            memory components also requires caution as it can produce further configuration
            conflicts, The easiest way is to set <span class="note-elem">total process memory</span>
          </span>
        </p>
      </template>
      <template #totalItem="{ model }">
        <template v-if="model && model['totalOptions']">
          <FormItem
            :label="conf.name.replace(/.memory/g, '').replace(/\./g, ' ')"
            v-for="conf in hasOptions(model['totalOptions'])"
            :key="conf.key"
          >
            <InputNumber
              v-if="conf.type === 'number'"
              :min="conf.min"
              :max="conf.max"
              :defaultValue="conf.defaultValue"
              :step="conf.step"
              v-model:value="model[conf.key]"
              :rules="[{ validator: conf.validator }]"
              :name="conf.key"
            />
            <span v-if="conf.type === 'switch'" class="conf-switch">
              ({{ conf.placeholder }})
            </span>
            <p class="conf-desc"> {{ descriptionFilter(conf) }} </p>
          </FormItem>
        </template>
      </template>
      <template #jmOptionsItem="{ model }">
        <template v-if="model && model['jmOptions']">
          <FormItem
            :label="conf.name.replace(/jobmanager.memory./g, '').replace(/\./g, ' ')"
            v-for="conf in hasOptions(model['jmOptions'])"
            :key="conf.key"
          >
            <InputNumber
              v-if="conf.type === 'number'"
              :min="conf.min"
              :max="conf.max"
              :defaultValue="conf.defaultValue"
              :step="conf.step"
              v-model:value="model[conf.key]"
              :rules="[{ validator: conf.validator }]"
              :name="conf.key"
            />
            <span v-if="conf.type === 'switch'" class="conf-switch">({{ conf.placeholder }})</span>
            <p class="conf-desc"> {{ descriptionFilter(conf) }} </p>
          </FormItem>
        </template>
      </template>
      <template #tmOptionsItem="{ model }">
        <template v-if="model && model['tmOptions']">
          <FormItem
            :label="conf.name.replace(/taskmanager.memory./g, '').replace(/\./g, ' ')"
            v-for="conf in hasOptions(model['tmOptions'])"
            :key="conf.key"
          >
            <InputNumber
              v-if="conf.type === 'number'"
              :min="conf.min"
              :max="conf.max"
              :defaultValue="conf.defaultValue"
              :step="conf.step"
              v-model:value="model[conf.key]"
              :rules="[{ validator: conf.validator }]"
              :name="conf.key"
            />
            <span v-if="conf.type === 'switch'" class="conf-switch">({{ conf.placeholder }})</span>
            <p class="conf-desc"> {{ descriptionFilter(conf) }} </p>
          </FormItem>
        </template>
      </template>
      <template #podTemplate>
        <PomTemplateTab
          v-model:podTemplate="k8sTemplate.podTemplate"
          v-model:jmPodTemplate="k8sTemplate.jmPodTemplate"
          v-model:tmPodTemplate="k8sTemplate.tmPodTemplate"
        />
      </template>
      <template #useSysHadoopConf="{ model, field }">
        <Switch checked-children="ON" un-checked-children="OFF" v-model:checked="model[field]" />
        <Space>
          <Popover title="Tips">
            <template #content>
              <p>Automatically copy configuration files from system environment parameters</p>
              <p><b>HADOOP_CONF_PATH</b> and <b>HIVE_CONF_PATH</b> to Flink Docker image</p>
            </template>
            <Icon icon="ant-design:question-circle-outlined" class="ml-10px" />
          </Popover>
          <transition name="slide-fade">
            <a-button
              size="small"
              v-if="model && model[field] == true"
              @click="openHadoopConfDrawer(true, { t: 1 })"
            >
              <Icon icon="ant-design:eye-outlined" class="ml-10px" />
              view
            </a-button>
          </transition>
        </Space>
      </template>
      <template #dynamicOptions="{ model, field }">
        <InputTextArea
          :rows="4"
          v-model:value="model[field]"
          placeholder="$key=$value,If there are multiple parameters,you can new line enter them (-D <arg>)"
        />
        <p class="conf-desc mt-10px">
          <span class="note-info">
            <Tag color="#2db7f5" class="tag-note">Note</Tag>
            It works the same as <span class="note-elem">-D$property=$value</span> in CLI mode,
            Allows specifying multiple generic configuration options. The available options can be
            found
            <a
              href="https://ci.apache.org/projects/flink/flink-docs-stable/ops/config.html"
              target="_blank"
              >here</a
            >
          </span>
        </p>
      </template>
    </BasicForm>
    <Mergely @close="handleEditConfClose" @ok="handleEditConfOk" @register="registerConfDrawer" />
    <HadoopConfDrawer @register="registerHadoopConf" />
  </PageWrapper>
</template>
<style lang="less">
  @import url('./styles/Add.less');
</style>
