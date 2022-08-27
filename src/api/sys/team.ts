import { defHttp } from '/@/utils/http/axios';

enum Api {
  TeamList = '/team/listByUser',
}

export function getTeamList(params?) {
  return defHttp.post({ url: Api.TeamList, params });
}
