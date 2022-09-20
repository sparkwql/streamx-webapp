import { AppListResponse, DashboardResponse } from './app.type';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

enum APP_API {
  READ_CONF = '/flink/app/readConf',
  UPDATE = '/flink/app/update',
  COPY = '/flink/app/copy',
  UPLOAD = '/flink/app/upload',
  START_LOG = '/flink/app/detail',
  DEPLOY = '/flink/app/deploy',
  MAPPING = '/flink/app/mapping',
  YARN = '/flink/app/yarn',
  LIST = '/flink/app/list',
  GET = '/flink/app/get',
  DASHBOARD = '/flink/app/dashboard',
  MAIN = '/flink/app/main',
  NAME = '/flink/app/name',
  CHECK_NAME = '/flink/app/checkName',
  CANCEL = '/flink/app/cancel',
  FORCED_STOP = '/flink/app/forcedStop',
  DELETE = '/flink/app/delete',
  DELETE_BAK = '/flink/app/deletebak',
  CREATE = '/flink/app/create',
  START = '/flink/app/start',
  CLEAN = '/flink/app/clean',
  BACKUPS = '/flink/app/backups',
  ROLLBACK = '/flink/app/rollback',
  REVOKE = '/flink/app/revoke',
  OPTION_LOG = '/flink/app/optionlog',
  DOWN_LOG = '/flink/app/downlog',
  CHECK_JAR = '/flink/app/checkjar',
  VERIFY_SCHEMA = '/flink/app/verifySchema',
  CHECK_SAVEPOINT_PATH = '/flink/app/checkSavepointPath',
}

/**
 * 读取配置文件
 * @returns Promise<any>
 */
export function fetchAppConf(params?: { config: Recordable }) {
  return defHttp.post<any>({
    url: APP_API.READ_CONF,
    params,
  });
}

/**
 * 仪表盘数据
 * @returns Promise<DashboardResponse>
 */
export function fetchDashboard() {
  return defHttp.post<DashboardResponse>({
    url: APP_API.DASHBOARD,
    params: {},
  });
}

/**
 * 获取 app 列表数据
 * @returns Promise<AppListResponse>
 */
export function fetchAppRecord(params) {
  return defHttp.post<AppListResponse>({
    url: APP_API.LIST,
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
/**
 * 移出 app
 * @returns Promise<boolean>
 */
export function fetchAppRemove(id: string) {
  return defHttp.post<boolean>({
    url: APP_API.DELETE,
    params: { id },
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
/**
 * 获取 yarn 地址
 * @returns Promise<any>
 */
export function fetchYarn() {
  return defHttp.post<string>({
    url: APP_API.YARN,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
/**
 * 导出
 * @returns Promise<any>
 */
export function fetchFlamegraph(params: { appId: string; width: number }) {
  return defHttp.post<Blob>(
    {
      url: APP_API.YARN,
      params,
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
      responseType: 'blob',
    },
    {
      isReturnNativeResponse: true,
    },
  );
}

/**
 * 获取项目
 * @returns Promise<any>
 */
export function fetchSelect() {
  return defHttp.post<any>({
    url: '/flink/project/select',
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function fetchListConf(params) {
  return defHttp.post<any>({
    url: '/flink/project/listconf',
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
export function fetchListJars(params) {
  return defHttp.post<string[]>({
    url: '/flink/project/jars',
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

/**
 * 获取项目
 * @returns Promise<any>
 */
export function fetchCheckName(params: { jobName: string }) {
  return defHttp.post<number>({
    url: APP_API.CHECK_NAME,
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function fetchMain(params) {
  return defHttp.post({
    url: APP_API.MAIN,
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
/**
 * 上传
 * @param params
 * @returns {String} 文件路径
 */
export function fetchUpload(params) {
  return defHttp.post<string>({
    url: APP_API.UPLOAD,
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
    timeout: 1000 * 60 * 10, // 上传文件超时10分钟
  });
}

/**
 * 创建
 * @param params 创建参数
 * @returns {Promise<boolean>}
 */
export function fetchCreate(params) {
  return defHttp.post<boolean>({
    url: APP_API.CREATE,
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  });
}
