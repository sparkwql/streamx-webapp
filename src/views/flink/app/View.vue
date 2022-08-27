<template>
  <PageWrapper contentFullHeight title="" content="">
    <a-row :gutter="[20, 20]">
      <a-col :xl="10" :lg="24">
        <a-card title="BasicButton Color" />
      </a-col>
      <a-col :xl="14" :lg="24">
        <a-card title="BasicButton Types" />
      </a-col>
    </a-row> </PageWrapper
></template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Card, Row, Col } from 'ant-design-vue';
  export default defineComponent({
    components: { PageWrapper, ACard: Card, ARow: Row, ACol: Col },
  });
</script>
