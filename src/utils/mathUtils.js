// 检查是不是数字
export function numberCheck(val, toFix) {
  const rtl = Number.isNaN(val) ? 0 : val.toFixed(toFix);
  return rtl;
}

export function parseStr(val) {
  return parseFloat(val);
}
