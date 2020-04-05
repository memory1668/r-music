/**
 * @description: 转换播放数量
 * @param count 转换前的播放数量 
 * @param point 保留几位小数 
 * @return: 转换后的播放量字符串
 */
function tranCount(count, point) {
  let countStr = count.toString().split('.')[0]
  if (countStr.length < 6) {
    return countStr
  } else if (countStr.length >= 6 && countStr.length <= 8) {
    let decimal = countStr.substring(countStr.length - 4, countStr.length - 4 + point)
    return parseFloat(parseInt(count / 10000) + '.' + decimal) + '万'
  } else {
    let decimal = countStr.substring(countStr.length - 8, countStr.length - 8 + point)
    return parseFloat(parseInt(count / 100000000) + '.' + decimal) + '亿'
  }
}

module.exports = tranCount