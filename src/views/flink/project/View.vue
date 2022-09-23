<template>
  <PageWrapper contentFullHeight>
    <a-card class="header" :bordered="false">
      <a-radio-group v-model:value="queryParams.buildState">
        <a-radio-button
          v-for="item in buttonList"
          @click="handleQuery(item.key)"
          :value="item.key"
          :key="item.key"
          >{{ item.label }}</a-radio-button
        >
      </a-radio-group>
      <a-input-search class="search-input" />
      <a-button v-auth="'project:create'" class="add-btn" type="primary" @click="onAdd">
        <plus-outlined />add new</a-button
      >
    </a-card>

    <a-card :border="false">
      <a-spin :spinning="loading">
        <a-list>
          <list-item :key="item.id" v-for="item in project.records" :item="item" @edit="onEdit" />
        </a-list>
      </a-spin>
    </a-card>
    <ProjectDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';

  import { PageWrapper } from '/@/components/Page';
  import { statusList, BuildStatusEnum } from './project.data';
  import { RadioGroup, Radio, Input, Card, List, Spin } from 'ant-design-vue';
  import { getList } from '/@/api/flink/project';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import ListItem from './ListItem.vue';
  import { useDrawer } from '/@/components/Drawer';
  import ProjectDrawer from './ProjectDrawer.vue';

  export default defineComponent({
    name: 'ProjectView',
    components: {
      PageWrapper,
      ARadioGroup: RadioGroup,
      ARadioButton: Radio.Button,
      AInputSearch: Input.Search,
      ACard: Card,
      AList: List,
      PlusOutlined,
      ListItem,
      ASpin: Spin,
      ProjectDrawer,
    },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const buttonList = reactive(statusList);
      const loading = ref(false);

      const queryParams = reactive({
        buildState: BuildStatusEnum.All,
      });

      let project = reactive({
        records: [],
      });

      function onAdd() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function onEdit(record) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleSuccess() {}
      const queryData = () => {
        loading.value = true;
        getList({ ...queryParams }).then((res) => {
          loading.value = false;
          project.records = res.records;
        });
      };

      const handleQuery = function (val) {
        queryParams.buildState = val;
        queryData();
      };

      queryData();

      return {
        buttonList,
        handleQuery,
        queryParams,
        project,
        loading,
        registerDrawer,
        openDrawer,
        onAdd,
        onEdit,
        handleSuccess,
      };
    },
  });
</script>
<style lang="less" scoped>
  .search-input {
    width: 272px;
    margin-left: 16px;
  }

  .add-btn {
    margin-left: 30px;
  }
</style>
