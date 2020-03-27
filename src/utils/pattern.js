/**
 * 通用正则表达式，用于表单格式校验
 */

export const doublePattern = {
  reg: /^(([1-9][0-9]*)|(([0](\.\d{1,2})?|[1-9][0-9]*\.\d{1,2})))$/,
  msg: '请输入不超过两位小数的数字',
};

export const doublePositive = {
  reg: /^(?=.*[0-9])\d*(?:\.\d{1,2})?$/,
  msg: '请输入不小于0且不超过两位小数的数字',
};

export const doubleZF = {
  reg: /^([\\+ \\-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,
  msg: '请输入不超过两位小数的正数或负数',
};

export const doubleFF = {
  reg: /^[1-9]+\d*(\.\d{0,2})?$|^0?(\.\d{0,2})?$/,
  msg: '请输入大于0且不超过两位小数的数字',
};

export const doubleTT = {
  reg: /^[1-9]+\d*(\.\d{0,3})?$|^0?\.\d{0,3}$/,
  msg: '请输入大于0且不超过三位小数的数字',
};

export const doublePat = {
  // reg: /^(\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*)|[0]$/,
  reg: /^-?[0-9]\d*(?:\.\d{1,2})?$/,
  msg: '请输入不超过两位小数的数字',
};

// 只能输入整数
export const intPat = {
  reg: /^-?[0-9]\d*$/,
  msg: '只能输入整数',
};

export const positiveInt = {
  reg: /^\+?[1-9]\d*$/,
  msg: '只能输入正整数',
};

export const nonNegativeInt = {
  reg: /^[+]{0,1}(\d+)$/,
  msg: '请输入大于等于0的整数！',
};

// 非负数
export const nonNegative = {
  reg: /^\d+(\.{0,1}\d+){0,1}$/,
  msg: '请输入非负数！',
};

// 0-100两位小数
export const weight = {
  reg: /^(100|[1-9]?\d(\.\d{1,2})?)$/,
  msg: '0-100两位小数',
};

// 0-100一位小数
export const percentage = {
  reg: /^(100|[1-9]?\d(\.\d)?)$/,
  msg: '0-100一位小数',
};

// 0-50整数
export const share = {
  reg: /^[1-5]?[0-9]$/,
  msg: '0-50的整数',
};

// 0-10小数两位
export const density = {
  reg: /^(10|\d(\.\d{1,2})?)$/,
  msg: '0-10两位小数',
};

// 0-600的整数
export const milliliter = {
  reg: /^(600|[1-5]?\d{0,2})$/,
  msg: '0-600的整数',
};

// 0-30的整数
export const livestock = {
  reg: /^(30|[1-2]?\d)$/,
  msg: '0-30的整数',
};

// 0-300的两位小数
export const litter = {
  reg: /^(300|[0-9]{1,2}(\.\d{1,2})?)$/,
  msg: '0-300的两位小数',
};

// 15位长度、不得含有汉字、特殊符号，但特殊符号“.”、“-”允许。
export const overbit = {
  reg: /^[A-Za-z0-9_.]{0,15}$/,
  msg: '不得超过15位、不得含有汉字、特殊符号, 但特殊符号“.”、“-”允许',
};

// 15位长度、不得含有汉字、特殊符号，但特殊符号“.”、“-”允许。
export const onlyNumber = {
  reg: /^[0-9]{0,19}$/,
  msg: '不得超过19位，且必须为纯数字',
};


// 只允许输入大写字母A/B/C/D
export const upperLetter = {
  reg: /^[A-D]{0,1}$/,
  msg: '只允许输入A、B、C、D',
};

// 经度
export const lonPattern = {
  reg: /^-?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/,
  msg: '请输入正确的经度数据！',
};

export const latPattern = {
  reg: /^-?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/,
  msg: '请输入正确的纬度数据！',
};
