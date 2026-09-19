// 购物好官 · 尺码粗算（仅供参考，以试穿为准）
// 输入：性别、身高(cm)、体重(kg)、版型偏好(修身/标准/宽松)
// 输出：建议尺码 XS~XXL
function calcSize(sex, h, w, fit) {
  if (!h || !w) return '';
  let size = '';
  if (sex === '女') {
    if (h < 158) size = w < 48 ? 'XS' : w < 53 ? 'S' : w < 60 ? 'M' : w < 67 ? 'L' : 'XL';
    else if (h < 165) size = w < 50 ? 'S' : w < 57 ? 'M' : w < 64 ? 'L' : 'XL';
    else if (h < 172) size = w < 54 ? 'M' : w < 62 ? 'L' : w < 70 ? 'XL' : 'XXL';
    else size = w < 58 ? 'L' : w < 66 ? 'XL' : 'XXL';
  } else {
    if (h < 170) size = w < 60 ? 'S' : w < 70 ? 'M' : w < 80 ? 'L' : 'XL';
    else if (h < 178) size = w < 65 ? 'M' : w < 75 ? 'L' : w < 85 ? 'XL' : 'XXL';
    else size = w < 70 ? 'L' : w < 82 ? 'XL' : 'XXL';
  }
  if (fit === '宽松') {
    const up = { XS: 'S', S: 'M', M: 'L', L: 'XL', XL: 'XXL' };
    size = up[size] || size;
  } else if (fit === '修身') {
    const down = { S: 'XS', M: 'S', L: 'M', XL: 'L', XXL: 'XL' };
    size = down[size] || size;
  }
  return size;
}

module.exports = { calcSize };
