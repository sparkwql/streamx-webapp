<template>
  <PageWrapper contentFullHeight title="" content="">
    <a-row :gutter="[20, 20]">
      <a-col :xl="10" :lg="24">
        <a-card title="Available Task Slots">
          <div class="my-2">
            <h3>success</h3>
            <div class="py-2">
              <a-button color="success"> 成功 </a-button>
              <a-button color="success" class="ml-2" disabled> 禁用 </a-button>
              <a-button color="success" class="ml-2" loading> loading </a-button>
              <a-button color="success" type="link" class="ml-2"> link </a-button>
              <a-button color="success" type="link" class="ml-2" loading> loading link </a-button>
              <a-button color="success" type="link" class="ml-2" disabled> disabled link </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xl="14" :lg="24">
        <a-card title="JobManager Memory">
          <div class="my-2">
            <h3>primary</h3>
            <a-button type="primary" preIcon="mdi:page-next-outline"> 主按钮 </a-button>
            <a-button type="primary" class="ml-2" disabled> 禁用 </a-button>
            <a-button type="primary" class="ml-2" danger preIcon="mdi:page-next-outline">
              危险
            </a-button>
            <a-button type="primary" class="ml-2" loading> loading </a-button>
            <a-button type="link" class="ml-2"> link </a-button>
            <a-button type="link" class="ml-2" loading> loading link </a-button>
            <a-button type="link" class="ml-2" disabled> disabled link </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper></template
>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Card, Row, Col } from 'ant-design-vue';
  export default defineComponent({
    components: { PageWrapper, ACard: Card, ARow: Row, ACol: Col },
  });
</script>
