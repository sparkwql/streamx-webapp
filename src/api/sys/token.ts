import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  TokenList = '/token/list',
  ToggleTokenStatus = '/token/toggle',
  AddToken = 'token/create',
  DeleteToken = 'token/delete',
}

export function getTokenList(params?) {
  return defHttp.post({ url: Api.TokenList, params });
}

export function setTokenStatus(data) {
  return defHttp.post({
    url: Api.ToggleTokenStatus,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function addToken(data) {
  return defHttp.post({
    url: Api.ToggleTokenStatus,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
export function deleteToken(data) {
  return defHttp.post({
    url: Api.DeleteToken,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
