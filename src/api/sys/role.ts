import { defHttp } from '/@/utils/http/axios';

enum Api {
  RoleUserList = '/role/listByUser',
}

export function getRoleListByUser(params?) {
  return defHttp.post({ url: Api.RoleUserList, params });
}
