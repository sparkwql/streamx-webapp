import { AxiosResponse } from 'axios';
import { FlinkClusterResponse } from './types/flinkCluster.type';
import { Result } from '/#/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { defHttp } from '/@/utils/http/axios';

enum FLINK_API {
  LIST = '/flink/cluster/list',
  ACTIVE_URL = '/flink/cluster/activeUrl',
  CREATE = '/flink/cluster/create',
  CHECK = '/flink/cluster/check',
  GET = '/flink/cluster/get',
  UPDATE = '/flink/cluster/update',
  START = '/flink/cluster/start',
  SHUTDOWN = '/flink/cluster/shutdown',
  DELETE = '/flink/cluster/delete',
}
/**
 * flink cluster
 * @returns Promise<FlinkEnvResponse[]>
 */
export function fetchFlinkCluster() {
  return defHttp.post<FlinkClusterResponse[]>({
    url: FLINK_API.LIST,
  });
}
/**
 * flink cluster start
 * @returns Promise<AxiosResponse>
 */
export function fetchClusterStart(id: string) {
  return defHttp.post<AxiosResponse<Result>>(
    {
      url: FLINK_API.START,
      params: { id },
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
}
/**
 * flink cluster remove
 * @returns Promise<AxiosResponse>
 */
export function fetchClusterRemove(id: string) {
  return defHttp.post<AxiosResponse<Result>>(
    {
      url: FLINK_API.DELETE,
      params: { id },
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
}
/**
 * flink cluster shutdown
 * @returns Promise<AxiosResponse>
 */
export function fetchClusterShutdown(id: string) {
  return defHttp.post<AxiosResponse<Result>>(
    {
      url: FLINK_API.SHUTDOWN,
      params: { id },
      headers: {
        'Content-Type': ContentTypeEnum.FORM_URLENCODED,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
}
