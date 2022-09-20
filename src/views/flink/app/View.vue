<script lang="ts">
  import { defineComponent } from 'vue';
  import { fetchActiveURL } from '/@/api/flink/setting/flinkCluster';

  export default defineComponent({
    name: 'AppView',
  });
</script>
<script lang="ts" setup>
  import { onMounted, ref, reactive } from 'vue';
  import {
    fetchAppRecord,
    fetchDashboard,
    fetchAppRemove,
    fetchYarn,
    fetchFlamegraph,
  } from '/@/api/flink/app';
  import { Row, Col, Tooltip, Badge, Divider, Select, Input, Tag } from 'ant-design-vue';
  import StatisticCard from './components/statisticCard.vue';
  import { ActionItem, useTable } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { useFlinkApplication } from './hooks/useApp';
  import { useRouter } from 'vue-router';
  import { useFlinkAppStore } from '/@/store/modules/flinkApplication';
  import { PageWrapper } from '/@/components/Page';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import State from './components/State';
  import { AppListRecord } from '/@/api/flink/app/app.type';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getAppColumns } from './data';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';

  const launchTitleMap = new Map();
  launchTitleMap.set(-1, 'launch failed');
  launchTitleMap.set(1, 'current job need relaunch');
  launchTitleMap.set(2, 'launching');
  launchTitleMap.set(3, 'launch finished,need restart');
  launchTitleMap.set(4, 'application is rollbacked,need relaunch');

  const SelectOption = Select.Option;
  const InputGroup = Input.Group;
  const InputSearch = Input.Search;
  const router = useRouter();
  const flinkAppStore = useFlinkAppStore();
  const { createMessage } = useMessage();

  const tagsOptions = ref<Recordable>([]);
  const dashboardLoading = ref(true);
  const dashBigScreenMap = reactive<Recordable>({});
  const searchText = ref('');
  const yarn = ref<Nullable<string>>(null);

  // 获取仪表盘指标数据
  async function handleDashboard() {
    try {
      const res = await fetchDashboard();
      if (res) {
        Object.assign(dashBigScreenMap, {
          availiableTask: {
            staticstics: { title: 'Available Task Slots', value: res.availableSlot },
            footer: [
              { title: 'Task Slots', value: res.totalSlot },
              { title: 'Task Managers', value: res.totalTM },
            ],
          },
          runningJob: {
            staticstics: { title: 'Running Jobs', value: res.runningJob },
            footer: [
              { title: 'Total Task', value: res.task.total },
              { title: 'Running Task', value: res.task.running },
            ],
          },
          jobManager: {
            staticstics: { title: 'JobManager Memory', value: res.jmMemory },
            footer: [{ title: 'Total JobManager Mem', value: `${res.jmMemory} MB` }],
          },
          taskManager: {
            staticstics: { title: 'TaskManager Memory', value: res.tmMemory },
            footer: [{ title: 'Total TaskManager Mem', value: `${res.tmMemory} MB` }],
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      dashboardLoading.value = false;
    }
  }
  const [registerTable, { reload }] = useTable({
    rowKey: 'id',
    api: fetchAppRecord,
    fetchSetting: { listField: 'records' },
    immediate: true,
    canResize: false,
    columns: getAppColumns(),
    showIndexColumn: false,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      dataIndex: 'operation',
      title: 'Operation',
      width: 200,
    },
  });

  function openBuildProgressDetailDrawer(item) {
    console.log(item);
  }
  function handleSearch() {}
  function handleChangeJobType() {}
  function handleChangeUser() {}
  function handleChangeTags() {}
  /* 点击添加 */
  function handleAdd() {
    router.push({ path: '/flink/app/add' });
  }
  /* 点击编辑 */
  function handleEdit(app) {
    flinkAppStore.setApplicationId(app.id);
    if (app.appType === 1) {
      // jobType( 1 custom code 2: flinkSQL)
      router.push({ path: '/flink/app/edit_streampark' });
    } else if (app.appType === 2) {
      //Apache Flink
      router.push({ path: '/flink/app/edit_flink' });
    }
  }
  /* 点击详情 */
  function handleDetail(app) {
    flinkAppStore.setApplicationId(app.id);
    router.push({ path: '/flink/app/detail' });
  }

  /* view */
  async function handleView(app) {
    // 任务正在运行中, 重启中, 正在 savePoint 中
    if ([4, 5].includes(app.state) || app['optionState'] === 4) {
      // yarn-per-job|yarn-session|yarn-application
      const executionMode = app['executionMode'];
      if (executionMode === 1) {
        const res = await fetchActiveURL(app.flinkClusterId);
        window.open(res + '/#/job/' + app.jobId + '/overview');
      } else if ([2, 3, 4].includes(executionMode)) {
        if (yarn.value == null) {
          const res = await fetchYarn();
          yarn.value = res;
          window.open(yarn.value + '/proxy/' + app['appId'] + '/');
        } else {
          window.open(yarn.value + '/proxy/' + app['appId'] + '/');
        }
      } else {
        if (app.flinkRestUrl != null) {
          window.open(app.flinkRestUrl);
        }
      }
    }
  }
  /* 点击删除 */
  async function handleDelete(app: AppListRecord) {
    const hide = createMessage.loading('deleting', 0);
    try {
      await fetchAppRemove(app.id);
      createMessage.success('delete successful');
      reload();
    } catch (error) {
      console.error(error);
    } finally {
      hide();
    }
  }
  async function handleFlameGraph(app) {
    const hide = createMessage.loading('flameGraph generating...', 0);
    try {
      const resp = await fetchFlamegraph({
        appId: app.id,
        width: document.documentElement.offsetWidth || document.body.offsetWidth,
      });
      if (resp != null) {
        const blob = new Blob([resp], { type: 'image/svg+xml' });
        const imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);
        window.open(imageUrl);
      }
    } catch (error) {
      console.error(error);
      createMessage.error('flameGraph generate failed');
    } finally {
      hide();
    }
  }
  const {
    handleCheckLaunchApp,
    handleAppCheckStart,
    handleCancel,
    handleSeeLog,
    handleCanStop,
    handleForcedStop,
    handleCopy,
    handleMapping,
    handleIsStart,
    users,
  } = useFlinkApplication();

  async function handleInitTagsOptions() {
    const params = Object.assign(
      {},
      {
        pageSize: 999999999,
        pageNum: 1,
      },
    );
    const res = await fetchAppRecord(params);
    const dataSource = res.records;
    dataSource.forEach((record) => {
      if (record.tags !== null && record.tags !== undefined && record.tags !== '') {
        const tagsArray = record.tags.split(',');
        tagsArray.forEach((x) => {
          if (x.length > 0 && tagsOptions.value.indexOf(x) == -1) {
            tagsOptions.value.push(x);
          }
        });
      }
    });
  }

  /* 操作按扭 */
  function getTableActions(record): ActionItem[] {
    return [
      {
        tooltip: { title: 'Edit Application' },
        auth: 'app:update',
        icon: 'ant-design:edit-outlined',
        onClick: handleEdit.bind(null, record),
        type: 'default',
        shape: 'circle',
      },
      {
        tooltip: { title: 'Launch Application' },
        ifShow: [-1, 1, 4].includes(record.launch) && record['optionState'] === 0,
        icon: 'ant-design:cloud-upload-outlined',
        onClick: handleCheckLaunchApp.bind(null, record),
        type: 'default',
        shape: 'circle',
      },
      {
        tooltip: { title: 'Launching Progress Detail' },
        ifShow: [-1, 2].includes(record.launch) || record['optionState'] === 1,
        auth: 'app:update',
        icon: 'ant-design:container-outlined',
        onClick: openBuildProgressDetailDrawer.bind(null, record),
        type: 'default',
        shape: 'circle',
      },
      {
        tooltip: { title: 'Start Application' },
        ifShow: handleIsStart(record),
        auth: 'app:start',
        icon: 'ant-design:play-circle-outlined',
        onClick: handleAppCheckStart.bind(null, record),
        type: 'default',
        shape: 'circle',
      },
      {
        tooltip: { title: 'Cancel Application' },
        ifShow: record.state === 5 && record['optionState'] === 0,
        auth: 'app:cancel',
        icon: 'ant-design:pause-circle-outlined',
        onClick: handleCancel.bind(null, record),
        type: 'default',
        shape: 'circle',
      },
      {
        tooltip: { title: 'View Application Detail' },
        auth: 'app:detail',
        icon: 'ant-design:eye-outlined',
        onClick: handleDetail.bind(null, record),
        type: 'default',
        shape: 'circle',
      },
      {
        tooltip: { title: 'See Flink Start log' },
        ifShow: [5, 6].includes(record.executionMode),
        auth: 'app:detail',
        icon: 'ant-design:sync-outlined',
        onClick: handleSeeLog.bind(null, record),
        type: 'default',
        shape: 'circle',
      },
      {
        tooltip: { title: 'Forced Stop Application' },
        ifShow: handleCanStop(record),
        auth: 'app:cancel',
        icon: 'ant-design:pause-circle-outlined',
        onClick: handleForcedStop.bind(null, record),
        type: 'default',
        shape: 'circle',
      },
    ];
  }

  /* 下拉操作按扭 */
  function getActionDropdown(record): ActionItem[] {
    return [
      {
        label: 'Copy Application',
        auth: 'app:copy',
        icon: 'ant-design:copy-outlined',
        onClick: handleCopy.bind(null, record),
        shape: 'circle',
      },
      {
        label: 'Remapping Application',
        ifShow: [0, 7, 10, 11, 13].includes(record.state),
        auth: 'app:mapping',
        icon: 'ant-design:deployment-unit-outlined',
        onClick: handleMapping.bind(null, record),
        shape: 'circle',
      },
      {
        label: 'View FlameGraph',
        ifShow: record.flameGraph,
        auth: 'app:flameGraph',
        icon: 'ant-design:fire-outlined',
        onClick: handleFlameGraph.bind(null, record),
        shape: 'circle',
      },
      {
        popConfirm: {
          title: 'Are you sure delete this job ?',
          confirm: handleDelete.bind(null, record),
        },
        label: 'Delete',
        ifShow: [0, 7, 9, 10, 13, 18, 19].includes(record.state),
        auth: 'app:delete',
        icon: 'ant-design:delete-outlined',
        shape: 'circle',
        color: 'error',
      },
    ];
  }
  onMounted(async () => {
    handleDashboard();
    handleInitTagsOptions();
  });
</script>
<template>
  <PageWrapper contentFullHeight>
    <Row :gutter="24" class="dashboard">
      <Col
        class="gutter-row mt-10px"
        :md="6"
        :xs="24"
        v-for="(value, key) in dashBigScreenMap"
        :key="key"
      >
        <StatisticCard
          :statisticProps="value.staticstics"
          :footerList="value.footer"
          :loading="dashboardLoading"
        />
      </Col>
    </Row>
    <BasicTable @register="registerTable" class="app_list !px-0 mt-20px">
      <template #headerTop>
        <div class="text-right my-15px">
          <InputGroup compact>
            <Select
              placeholder="Tags"
              show-search
              allowClear
              @change="handleChangeTags"
              class="!ml-16px !w-150px text-left"
            >
              <SelectOption v-for="tag in tagsOptions" :key="tag">
                <span> {{ tag }} </span>
              </SelectOption>
            </Select>
            <Select
              placeholder="Owner"
              allowClear
              @change="handleChangeUser"
              class="!ml-16px !w-120px text-left"
            >
              <SelectOption v-for="u in users" :key="u.userId">
                <span v-if="u.nickName"> {{ u.nickName }} </span>
                <span v-else> {{ u.username }} </span>
              </SelectOption>
            </Select>
            <Select
              placeholder="Type"
              allowClear
              @change="handleChangeJobType"
              class="!ml-16px w-80px text-left"
            >
              <SelectOption value="1">JAR</SelectOption>
              <SelectOption value="2">SQL</SelectOption>
            </Select>
            <InputSearch
              placeholder="Search..."
              v-model:value="searchText"
              @change="handleSearch"
              class="!w-250px text-left"
            />
            <a-button type="primary" style="margin-left: 20px" @click="handleAdd">
              <Icon icon="ant-design:plus-outlined" />
              Add New
            </a-button>
          </InputGroup>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'jobName'">
          <span class="app_type app_jar" v-if="record['jobType'] === 1"> JAR </span>
          <span class="app_type app_sql" v-if="record['jobType'] === 2"> SQL </span>

          <span
            class="link"
            :class="{
              pointer: [4, 5].includes(record.state) || record['optionState'] === 4,
            }"
            @click="handleView(record)"
          >
            <Tooltip :title="record.description"> {{ record.jobName }} </Tooltip>
          </span>

          <template v-if="record['jobType'] === 1">
            <Badge
              v-if="record.launch === 5"
              class="build-badge"
              count="NEW"
              title="the associated project has changed and this job need to be rechecked"
            />
            <Badge
              v-else-if="record.launch >= 2"
              class="build-badge"
              count="NEW"
              title="the application has changed."
            />
          </template>
        </template>
        <template v-if="column.dataIndex === 'tags'">
          <Tooltip v-if="record.tags" :title="record.tags">
            <span
              v-for="(tag, index) in record.tags.split(',')"
              :key="'tag-'.concat(index.toString())"
            >
              <Tag color="blue" class="app-tag">{{ tag }}</Tag>
            </span>
          </Tooltip>
        </template>
        <template v-if="column.dataIndex === 'task'">
          <State option="task" :data="record" />
        </template>
        <template v-if="column.dataIndex === 'state'">
          <State option="state" :data="record" />
        </template>
        <template v-if="column.dataIndex === 'launch'">
          <State option="launch" :title="launchTitleMap.get(record.launch)" :data="record" />
          <Divider type="vertical" style="margin: 0 4px" v-if="record.buildStatus != null" />
          <State
            option="build"
            :click="openBuildProgressDetailDrawer.bind(null, record)"
            :data="record"
          />
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <TableAction
            :actions="getTableActions(record)"
            :dropDownActions="getActionDropdown(record)"
          >
            <template #more>
              <a-button type="default" shape="circle" size="small" class="ml-6px">
                <Icon icon="ant-design:more-outlined" class="icon-more" />
              </a-button>
            </template>
          </TableAction>
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<style lang="less">
  @import url('./styles/View.less');
</style>
