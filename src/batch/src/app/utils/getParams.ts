import { getParams } from "./../../../../common/utils/getParams";
//通过时间，算出对应时间点 返回对应时间点
function fromTimeToPoint(hours, timeObj = []) {
  hours = parseInt(hours);
  let timeList = timeObj.map(item => item.sddName);
  let newTimeList = timeList.map(item => item.split(":")[0])
  const inter = newTimeList[0] - 2;//非标准2、6方式 计算与2的间隔
  if (inter !== 0) {
    let point = hours - inter;
    if (point < 0) {
      point = newTimeList[newTimeList.length - 1] - 0;
    }
    return timeList[Math.floor(point / 4)];
  } else {
    return timeList[Math.floor(hours / 4)];
  }
}

export {
  getParams,
  fromTimeToPoint
}
