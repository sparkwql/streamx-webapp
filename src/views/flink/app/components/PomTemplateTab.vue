<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { Tabs, Button, Empty, Card } from 'ant-design-vue';
  import { BasicDrawer, useDrawer } from '/@/components/Drawer';
  const TabPane = Tabs.TabPane;
  const ButtonGroup = Button.Group;
  const podTemplateTab = ref('');
  const podTemplate = ref('');
  const jmPodTemplate = ref('');
  const tmPodTemplate = ref('');
  const historyRecord = reactive({
    uploadJars: [],
    k8sNamespace: [],
    k8sSessionClusterId: [],
    flinkImage: [],
    podTemplate: [],
    jmPodTemplate: [],
    tmPodTemplate: [],
  });
  const [registerPodHistoryDrawer] = useDrawer();

  function showPodTemplateDrawer(key) {
    if (key == 'ptVisual') {
      console.log('ptVisual');
    }
  }

  function handleGetInitPodTemplate(key) {
    if (key == 'ptVisual') {
      console.log('ptVisual');
    }
  }
  function showTemplateHostAliasDrawer(visualType) {
    if (visualType == 'ptVisual') {
      console.log('ptVisual');
    }
  }
  function handleChoicePodTemplate(visualType, content) {
    switch (visualType) {
      case 'ptVisual':
        podTemplate.value = content;
        // this.controller.editor.podTemplate.setValue(content);
        break;
      case 'jmPtVisual':
        jmPodTemplate.value = content;
        // this.controller.editor.jmPodTemplate.setValue(content);
        break;
      case 'tmPtVisual':
        tmPodTemplate.value = content;
        // this.controller.editor.tmPodTemplate.setValue(content);
        break;
    }
  }
</script>
<template>
  <Tabs type="card" v-model:activeKey="podTemplateTab">
    <TabPane key="pod-template" tab="Pod Template" forceRender>
      <ButtonGroup class="pod-template-tool">
        <a-button
          size="small"
          type="primary"
          class="pod-template-tool-item"
          @click="showPodTemplateDrawer('ptVisual')"
        >
          <Icon icon="ant-design:history-outlined" />
          History
        </a-button>
        <a-button
          type="default"
          size="small"
          class="pod-template-tool-item"
          @click="handleGetInitPodTemplate('ptVisual')"
        >
          <Icon icon="ant-design:copy-outlined" />
          Init Content
        </a-button>
        <a-button
          type="default"
          size="small"
          class="pod-template-tool-item"
          @click="showTemplateHostAliasDrawer('ptVisual')"
        >
          <Icon icon="ant-design:share-alt-outlined" />
          Host Alias
        </a-button>
        <a-button type="default" size="small" disabled ghost class="pod-template-tool-item">
          <Icon icon="ant-design:hdd-outlined" />
          PVC
        </a-button>
      </ButtonGroup>
      <div class="pod-template-box syntax-true"></div>
    </TabPane>

    <TabPane key="jm-pod-template" tab="JM Pod Template" forceRender>
      <ButtonGroup class="pod-template-tool">
        <a-button
          size="small"
          type="primary"
          class="pod-template-tool-item"
          @click="showPodTemplateDrawer('jmPtVisual')"
        >
          <Icon icon="ant-design:history-outlined" />
          History
        </a-button>
        <a-button
          type="default"
          size="small"
          class="pod-template-tool-item"
          @click="handleGetInitPodTemplate('jmPtVisual')"
        >
          <Icon icon="ant-design:copy-outlined" />
          Init Content
        </a-button>
        <a-button
          type="default"
          size="small"
          class="pod-template-tool-item"
          @click="showTemplateHostAliasDrawer('jmPtVisual')"
        >
          <Icon icon="ant-design:share-alt-outlined" />
          Host Alias
        </a-button>
        <a-button type="default" size="small" disabled ghost class="pod-template-tool-item">
          <Icon icon="ant-design:hdd-outlined" />
          PVC
        </a-button>
      </ButtonGroup>
      <div class="jm-pod-template-box syntax-true"></div>
    </TabPane>

    <TabPane key="tm-pod-template" tab="TM Pod Template" forceRender>
      <ButtonGroup class="pod-template-tool">
        <a-button
          size="small"
          type="primary"
          class="pod-template-tool-item"
          @click="showPodTemplateDrawer('tmPtVisual')"
        >
          <Icon icon="ant-design:history-outlined" />
          History
        </a-button>
        <a-button
          type="default"
          size="small"
          class="pod-template-tool-item"
          @click="handleGetInitPodTemplate('tmPtVisual')"
        >
          <Icon icon="ant-design:copy-outlined" />
          Init Content
        </a-button>
        <a-button
          type="default"
          size="small"
          class="pod-template-tool-item"
          @click="showTemplateHostAliasDrawer('tmPtVisual')"
        >
          <Icon icon="ant-design:share-alt-outlined" />
          Host Alias
        </a-button>
        <a-button
          type="default"
          size="small"
          icon="hdd"
          disabled
          ghost
          class="pod-template-tool-item"
        >
          <Icon icon="ant-design:hdd-outlined" />
          PVC
        </a-button>
      </ButtonGroup>
      <div class="tm-pod-template-box syntax-true"></div>
    </TabPane>
  </Tabs>
  <BasicDrawer @register="registerPodHistoryDrawer">
    <Empty v-if="historyRecord.podTemplate == null || historyRecord.podTemplate.length == 0" />
    <Card
      title="pod-template.yaml"
      size="small"
      hoverable
      class="mb-8px"
      v-for="(item, index) in historyRecord.podTemplate"
      :key="index"
    >
      <template #extra>
        <a @click="handleChoicePodTemplate('ptVisual', item)">Choice</a>
      </template>
      <pre style="font-size: 12px">{{ item }}</pre>
    </Card>
  </BasicDrawer>
</template>
