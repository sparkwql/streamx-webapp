import { useRouter } from 'vue-router';
import { omit } from 'lodash-es';
import { Ref, unref } from 'vue';
import options from '../data/option';
import { buildUUID } from '/@/utils/uuid';
import { createLocalStorage } from '/@/utils/cache';
import { fetchAppConf, fetchCreate } from '/@/api/flink/app';
import { decodeByBase64 } from '/@/utils/cipher';

export const useAppSubmit = (
  flinkClusters: Ref,
  k8sTemplate: any,
  configOverride: Ref,
  handleApplyPom: Fn,
  uploadJar: Ref,
) => {
  const router = useRouter();
  const optionsKeyMapping = new Map();
  const ls = createLocalStorage();
  options.forEach((item) => {
    optionsKeyMapping.set(item.key, item);
  });

  function handleCluster(values) {
    if (values.flinkClusterId) {
      const cluster =
        unref(flinkClusters).filter(
          (c) => c.id === values.flinkClusterId && c.clusterState === 1,
        )[0] || null;
      values.clusterId = cluster.id;
      values.flinkClusterId = cluster.id;
      values.yarnSessionClusterId = cluster.clusterId;
    }
    if (values.yarnSessionClusterId) {
      const cluster =
        unref(flinkClusters).filter(
          (c) => c.clusterId === values.yarnSessionClusterId && c.clusterState === 1,
        )[0] || null;
      values.clusterId = cluster.id;
      values.flinkClusterId = cluster.id;
      values.yarnSessionClusterId = cluster.clusterId;
    }
  }
  /* custom模式 */
  async function handleSubmitCustomJob(values) {
    const options = handleFormValue(values);
    handleCluster(values);
    const params = {
      jobType: 1,
      executionMode: values.executionMode,
      versionId: values.versionId,
      projectId: values.project || null,
      module: values.module || null,
      jobName: values.jobName,
      tags: values.tags,
      args: values.args,
      options: JSON.stringify(options),
      yarnQueue: handleYarnQueue(values),
      cpMaxFailureInterval: values.cpMaxFailureInterval || null,
      cpFailureRateInterval: values.cpFailureRateInterval || null,
      cpFailureAction: values.cpFailureAction || null,
      dynamicOptions: values.dynamicOptions,
      resolveOrder: values.resolveOrder,
      k8sRestExposedType: values.k8sRestExposedType,
      restartSize: values.restartSize,
      alertId: values.alertId,
      description: values.description,
      k8sNamespace: values.k8sNamespace || null,
      clusterId: values.clusterId || null,
      flinkClusterId: values.flinkClusterId || null,
      flinkImage: values.flinkImage || null,
      yarnSessionClusterId: values.yarnSessionClusterId || null,
      appType: values.appType,
    };
    if (params.executionMode === 6) {
      Object.assign(params, {
        k8sPodTemplate: k8sTemplate.podTemplate,
        k8sJmPodTemplate: k8sTemplate.jmPodTemplate,
        k8sTmPodTemplate: k8sTemplate.tmPodTemplate,
        k8sHadoopIntegration: values.useSysHadoopConf,
      });
    }

    // common params...
    const resourceFrom = values.resourceFrom;
    if (resourceFrom != null) {
      if (resourceFrom === 'cvs') {
        params['resourceFrom'] = 1;
        //streampark flink
        if (values.appType === 1) {
          const configVal = values['config'];
          params['format'] = configVal.endsWith('.properties') ? 2 : 1;
          if (configOverride == null) {
            const res = await fetchAppConf({
              config: configVal,
            });
            params['config'] = res;
            handleCreateApp(params);
          } else {
            params['config'] = decodeByBase64(unref(configOverride));
            handleCreateApp(params);
          }
        } else {
          params['jar'] = values.jar || null;
          params['mainClass'] = values.mainClass || null;
          handleCreateApp(params);
        }
      } else {
        // from upload
        Object.assign(params, {
          resourceFrom: 2,
          appType: 2,
          jar: unref(uploadJar),
          mainClass: values.mainClass,
        });
        handleCreateApp(params);
      }
    }
  }
  /* flink sql 模式 */
  function handleSubmitSQL(values) {
    const options = handleFormValue(values);
    //触发一次pom确认操作.
    handleApplyPom();
    // common params...
    const dependency: { pom?: string; jar?: string } = {};
    if (values.dependency !== null && values.dependency.length > 0) {
      Object.assign(dependency, {
        pom: values.dependency,
      });
    }
    if (values.uploadJars != null && values.uploadJars.length > 0) {
      Object.assign(dependency, {
        jar: values.dependency,
      });
    }

    let config = unref(configOverride);
    if (config != null && config !== undefined && config.trim() != '') {
      config = decodeByBase64(config);
    } else {
      config = null;
    }

    handleCluster(values);
    const params = {
      jobType: 2,
      executionMode: values.executionMode,
      versionId: values.versionId,
      flinkSql: values.flinkSql,
      appType: 1,
      config: config,
      format: values.isSetConfig ? 1 : null,
      jobName: values.jobName,
      tags: values.tags,
      args: values.args || null,
      dependency:
        dependency.pom === undefined && dependency.jar === undefined
          ? null
          : JSON.stringify(dependency),
      options: JSON.stringify(options),
      yarnQueue: handleYarnQueue(values),
      cpMaxFailureInterval: values.cpMaxFailureInterval || null,
      cpFailureRateInterval: values.cpFailureRateInterval || null,
      cpFailureAction: values.cpFailureAction || null,
      dynamicOptions: values.dynamicOptions || null,
      resolveOrder: values.resolveOrder,
      k8sRestExposedType: values.k8sRestExposedType,
      restartSize: values.restartSize,
      alertId: values.alertId,
      description: values.description || null,
      k8sNamespace: values.k8sNamespace || null,
      clusterId: values.clusterId || null,
      flinkClusterId: values.flinkClusterId || null,
      flinkImage: values.flinkImage || null,
      yarnSessionClusterId: values.yarnSessionClusterId || null,
    };
    if (params.executionMode === 6) {
      Object.assign(params, {
        k8sPodTemplate: k8sTemplate.podTemplate,
        k8sJmPodTemplate: k8sTemplate.jmPodTemplate,
        k8sTmPodTemplate: k8sTemplate.tmPodTemplate,
        k8sHadoopIntegration: values.useSysHadoopConf,
      });
    }
    handleCreateApp(params);
  }

  function handleYarnQueue(values) {
    if (values.executionMode === 4) {
      const queue = values['yarnQueue'];
      if (queue != null && queue !== '' && queue !== undefined) {
        return queue;
      }
      return null;
    }
  }

  /* 发送创建请求 */
  async function handleCreateApp(params: Recordable) {
    const param = {};
    for (const k in params) {
      const v = params[k];
      if (v != null && v !== undefined) {
        param[k] = v;
      }
    }
    const socketId = buildUUID();
    ls.set('DOWN_SOCKET_ID', socketId);
    Object.assign(param, { socketId });
    const created = await fetchCreate(param);
    if (created) {
      router.push({ path: '/flink/app' });
    }
  }

  /* 拼接参数 */
  function handleFormValue(values) {
    const options = {};
    for (const k in omit(values, ['totalOptions', 'jmOptions', 'tmOptions'])) {
      const v = values[k];
      if (v != null && v !== '' && v !== undefined) {
        if (k === 'parallelism') {
          options['parallelism.default'] = v;
        } else if (k === 'slot') {
          options['taskmanager.numberOfTaskSlots'] = v;
        } else {
          if (
            values.totalOptions.includes(k) ||
            values.jmMemoryItems.includes(k) ||
            values.tmMemoryItems.includes(k)
          ) {
            const opt = optionsKeyMapping.get(k);
            const unit = opt['unit'] || '';
            const name = opt['name'];
            if (typeof v === 'string') {
              options[name] = v.replace(/[k|m|g]b$/g, '') + unit;
            } else if (typeof v === 'number') {
              options[name] = v + unit;
            } else {
              options[name] = v;
            }
          }
        }
      }
    }
    return options;
  }
  return { handleSubmitCustomJob, handleSubmitSQL };
};
