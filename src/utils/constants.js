/**
 * 根据Value获取对应Label
 * @aram list
 * @param val
 * @returns {string}
 */
export function getLabelByVal(list, val) {
  const obj = list.find(item => item.value === `${val}`);
  return obj ? obj.label : '';
}

// 审核状态
export const certStatusList = [
  {
    label: '待审',
    value: '0',
  },
  {
    label: '通过',
    value: '1',
  },
  {
    label: '不通过',
    value: '2',
  },
];

// NC供应商类别
export const ncSupplierTypeList = [
  {
    name: '外部单位',
    key: '外部单位',
  },
  {
    name: '外部个人',
    key: '外部个人',
  },
  {
    name: '其他',
    key: '其他',
  },
];

// 凭证状态
export const voucherStatusList = [
  {
    name: '已上传',
    key: 1,
  },
  {
    name: '未上传',
    key: 0,
  },
  {
    name: '上传失败',
    key: -1,
  },
];

export const payStatusList = [
  {
    name: '已付款',
    key: 'AUDITED',
  },
  {
    name: '待付款',
    key: 'NORMAL',
  },
  {
    name: '未付款',
    key: 'INIT',
  },
];

export const reverStatusList = [
  {
    name: '已核销',
    key: 'AUDITED',
  },
  {
    name: '待核销',
    key: 'NORMAL',
  },
  {
    name: '未核销',
    key: 'INIT',
  },
];
