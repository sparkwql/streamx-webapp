import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { ProjectModel } from '/@/api/flink/project/model/projectModel';

enum Api {
  BRANCHES = '/flink/project/branches',
  GIT_CHECK = '/flink/project/gitcheck',
  EXISTS = '/flink/project/exists',
  CREATE = '/flink/project/create',
  GET = '/flink/project/get',
  UPDATE = '/flink/project/update',
  COPY = '/flink/project/copy',
  BUILD = '/flink/project/build',
  BUILD_LOG = '/flink/project/buildlog',
  CLOSE_BUILD = '/flink/project/closebuild',
  LIST = '/flink/project/list',
  FILE_LIST = '/flink/project/filelist',
  MODULES = '/flink/project/modules',
  LIST_CONF = '/flink/project/listconf',
  JARS = '/flink/project/jars',
  DELETE = '/flink/project/delete',
  SELECT = '/flink/project/select',
}

export function getList(params?) {
  return defHttp.post<ProjectModel>({
    url: Api.LIST,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function isExist(params) {
  return defHttp.post({
    url: Api.EXISTS,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function gitCheck(params) {
  return defHttp.post({
    url: Api.GIT_CHECK,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function branches(params) {
  return defHttp.post({
    url: Api.BRANCHES,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function createProject(params) {
  return defHttp.post({
    url: Api.CREATE,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function getDetail(params) {
  return defHttp.post({
    url: Api.GET,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function updateProject(params) {
  return defHttp.post({
    url: Api.UPDATE,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function buildProject(params) {
  return defHttp.post({
    url: Api.BUILD,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function buildLog(params) {
  return defHttp.post({
    url: Api.BUILD_LOG,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function closeBuild(params) {
  return defHttp.post({
    url: Api.CLOSE_BUILD,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function deleteProject(params) {
  return defHttp.post({
    url: Api.DELETE,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function modules(params) {
  return defHttp.post({
    url: Api.MODULES,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function jars(params) {
  return defHttp.post({
    url: Api.JARS,
    data: params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}
