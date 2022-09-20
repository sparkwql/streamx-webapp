<script setup lang="ts">
  import { Upload, Alert } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
  import { useMessage } from '/@/hooks/web/useMessage';

  const UploadDragger = Upload.Dragger;
  const { createMessage } = useMessage();
  const emit = defineEmits(['update:loading']);
  defineProps({
    customRequest: {
      type: Function as PropType<(item: UploadRequestOption) => Promise<any>>,
      require: true,
    },
    showUploadInfo: {
      type: Boolean,
      default: false,
    },
    uploadJar: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  function handleUploadJar(info) {
    const status = info.file.status;
    if (status === 'error') {
      createMessage.error(`${info.file.name} file upload failed.`);
    }
    emit('update:loading', false);
  }
  /* 文件上传前回调 */
  function handleBeforeUpload(file) {
    if (file.type !== 'application/java-archive') {
      if (!/\.(jar|JAR)$/.test(file.name)) {
        emit('update:loading', false);
        createMessage.error('Only jar files can be uploaded! please check your file.');
        return false;
      }
    }
    emit('update:loading', true);
    return true;
  }
</script>

<template>
  <UploadDragger
    name="file"
    :multiple="true"
    @change="handleUploadJar"
    :showUploadList="loading"
    :customRequest="customRequest"
    :beforeUpload="handleBeforeUpload"
  >
    <div class="h-266px">
      <p class="ant-upload-drag-icon !pt-40px">
        <Icon icon="ant-design:inbox-outlined" :style="{ fontSize: '70px' }" />
      </p>
      <p class="ant-upload-text h-45px"> Click or drag jar to this area to upload </p>
      <p class="ant-upload-hint h-45px">
        Support for a single upload. You can upload a local jar here to support for current Job.
      </p>
    </div>
  </UploadDragger>
  <Alert v-if="uploadJar && showUploadInfo" class="uploadjar-box" type="info">
    <template #message>
      <span class="tag-dependency-pom">
        {{ uploadJar }}
      </span>
    </template>
  </Alert>
</template>
