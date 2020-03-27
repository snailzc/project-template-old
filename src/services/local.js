import request from '../utils/request';

// 省
export async function getProvince() {
  return request('/api/evp/epRegion/project/region?type=1&name=111111');
}

// 区域
export async function getArea(params) {
  return request(`/api/evp/epRegion/project/region?type=4&name=${params.name}`);
}
// 区域
export async function getAllArea() {
  return request('/api/evp/epRegion/project/region?type=4&name=111111');
}

// 猪群类别
export async function getSegement() {
  return request('/api/evp/epWaterStandard/3009/111111');
}

// 场区
export async function getMarket(params) {
  return request(`/api/evp/epRegion/project/region?type=5&name=${params.name}`);
}

// 发酵区
export async function getFerment() {
  return request('/api/evp/epNetworkInfo/bd/dict/1501002');
}

// 抄表类别
export async function getMeterRecordType() {
  return request('/api/evp/epNetworkInfo/bd/dict/1501003');
}

// 水表类别
export async function getWaterType() {
  return request('/api/evp/epNetworkInfo/bd/dict/1501004');
}

// 施肥类型
export async function getFeiType() {
  return request('/api/evp/epNetworkInfo/bd/dict/1502002');
}

// 施肥种类
export async function getFeiLei() {
  return request('/api/evp/epNetworkInfo/bd/dict/1502003');
}

// 样品类型
export async function getSampleType() {
  return request('/api/evp/epNetworkInfo/bd/dict/1504001');
}

// 样品名称
export async function getSampleName(params) {
  return request(`/api/evp/epNetworkInfo/bd/dict/${params.code}`);
}

// 检测项目
export async function getIspItems() {
  return request('/api/evp/epNetworkInfo/bd/dict/1504002');
}

// 获取上传地址
export async function getUploadUrl() {
  return request('/api/admin/init/v1');
}
// 查看上传文件
export async function fetchUploadUrl(params) {
  return request(`/file/fetch/v1/${params}`);
}
// 还田类型
export async function getLandType() {
  return request('/api/evp/epNetworkInfo/bd/dict/1504003');
}

// 地块类型
export async function getBlockType() {
  return request('/api/evp/epNetworkInfo/bd/dict/1504004');
}

// 发电使用类型
export async function getPwrType() {
  return request('/api/evp/epNetworkInfo/bd/dict/1504005');
}

// 合作厂家
export async function getVendor() {
  return request('/api/evp/epNetworkInfo/bd/dict/1504006');
}

export async function getTechnique() {
  return request('/api/evp/epNetworkInfo/bd/dict/10050');
}

// 清粪工艺
export async function getNightsoil() {
  return request('/api/evp/epNetworkInfo/bd/dict/1504007');
}

// 厌氧工艺
export async function getAnaerobic() {
  return request('/api/evp/epNetworkInfo/bd/dict/1504008');
}

export async function auditedCheck(params, uri) {
  return request(`/api${uri}?ids=${params.id}`, {
    method: 'POST',
  });
}

export async function normalCheck(params, uri) {
  return request(`/api${uri}?ids=${params.id}`, {
    method: 'POST',
  });
}

// 单点登录
export async function singleLogin(params) {
  return request(`/api/auth/jwt/ticket/${params}`);
}

// 数据字典
export async function getCode(params) {
  return request(`/api/evp/epNetworkInfo/bd/dict/${params}`);
}
