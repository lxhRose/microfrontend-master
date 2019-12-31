export const vitalSettings = (hospitalId) => {
  hospitalId = parseInt(hospitalId);
  let settings = {};
  let settingCode = {
    temp: { sddCode: "temp", sddID: 13, range: "TemperatureRange", normalRange: "EarNormalRange" },//体温
    pulse: { sddCode: "pulse", sddID: 15, range: "PulseRange", normalRange: "PulseNormalRange" },//脉搏
    respire: { sddCode: "respire", sddID: 14, range: "RespireRange", normalRange: "RespireNormalRange" },//呼吸
    bp: { sddCode: "BP", sddID: 18, range: "BloodPressureRange" },//血压
    SBP: { sddCode: "SBP", sddID: 19, normalRange: "SBPNormalRange" },//收缩压
    DBP: { sddCode: "DBP", sddID: 20, normalRange: "DBPNormalRange" },//舒张压
    spo2: { sddCode: "SPO2", sddID: 17, range: "SPO2Range", normalRange: "SPO2NormalRange" },//血氧
    girth: { sddCode: "girth", sddID: 16 },//腹围
    height: { sddCode: "height", sddID: 22 },//身高
    weight: { sddCode: "weight", sddID: 23 },//体重
    bmi: { sddCode: "BMI", sddID: 205 },//bmi
    heartRate: { sddCode: "heartRate", sddID: 1118, range: "heartRateRange", normalRange: "heartRateNormalRange" },//心率
    specialEvent: { sddCode: "SpecialEvent", sddID: 40 },//特殊事件
    cosc: { sddCode: "COSC", sddID: 21, noHasReason: true },//意识
    faeces: { sddCode: "faeces", sddID: 1204, noHasReason: true, noHuji: true },//大便次数
    faecesType: { sddCode: "faecesType", sddID: 333 },//大便类型
    //灌肠次数
    faeces1: { sddCode: "faeces1", sddID: 237, sddName: "灌肠次数" },//灌肠次数
    sleep: { sddCode: "sleep", sddID: 1202, num: 1, noHuji: true },//睡眠
    period: { sddCode: "period", sddID: 1203, noHasReason: true, noHuji: true },//月经次数
    beizhu: { sddCode: "Note", sddID: 1257 },//备注
    respirator: { sddCode: "Respirator", sddID: 168, sddName: "呼吸机" },//呼吸机
    mews: { sddCode: "mews", sddID: 234, sddName: "MEWS评分" },//MEWS评分
    pain: { sddCode: "pain", sddID: 235, sddName: "疼痛评分" },//疼痛评分
  }
  switch (hospitalId) {
    case 1://老年
      settings.allNoHuji = true;//整体没有护记
      //将子项的护记去掉
      // settingCode.cosc.noHuji = true;//意识
      settingCode.temp.noHuji = true;//体温
      settingCode.pulse.noHuji = true;//脉搏
      settingCode.heartRate.noHuji = true;//心率
      settingCode.respire.noHuji = true;//呼吸
      settingCode.bp.noHuji = true;//血压
      settingCode.spo2.noHuji = true;//血氧
      settingCode.weight.noHuji = true;//体重

      settingCode.temp.noTpr = true;//体温
      settingCode.pulse.noTpr = true;//脉搏
      settingCode.heartRate.noTpr = true;//心率
      settingCode.respire.noTpr = true;//呼吸
      settingCode.bp.noTpr = true;//血压
      settingCode.spo2.noTpr = true;//血氧
      settingCode.weight.noTpr = true;//体重

      settings.isTimepoint = true;//是否通过timepoint来筛选列表
      settings.tipDataSource = [
        { sign: "*", message: "常规测量", info: "一天一次 时间点为 2pm" },
        { sign: "△", message: "小儿", info: "常规测量小孩子(年龄小于10岁)一天两次，时间点2pm,6pm" },
        { sign: "☆", message: "体温异常(小儿体温减 1℃)", info: "异常体温39℃以上,一天测6次异常体温38℃以上, 一天测4次,时间点为6am,10am,2pm,6pm异常体温37.5℃以上,一天测3次,时间点为6am,2pm,6pm出现异常体温的当天(当天测量次数如果少于以上次数不顺延)跟第二天按以上规则处理." },
        { sign: "◎", message: "体温正常后两天", info: "2 次/日(6:00、 14:00)，连续测 2 日如果第二天体温都正常，第三、四天按正常后体温处理（一天测两次，时间点为6am,2pm）,这两天后都正常 ，接着按常规测量(时间点为2pm)" },
        { sign: "1○", message: "术前", info: "(录了明日手术)要加测6pm体温,手术当天加测6am体温" },
        { sign: "○", message: "术后三天内", info: "一天三次,时间点为6am,2pm,6pm,手术当天如果少于三次不顺延" },
        { sign: "◇", message: "新病人", info: "新病人及转科病人前两天一天两次,时间点6am,2pm，入院第一天如果少于两次，则向后顺延,如6pm入院，则加测10pm体温,10pm入院,则第二,三天都测两次" },
      ];
      settings.tipAttr = { scroll: { y: 345 } };
      // settings.hasSheet = true;//是否有护记
      settings.inputColumns = [
        { id: "cosc", sddCode: settingCode["cosc"].sddCode, sddName: "意识", type: "select", data: "consciousnessList", width: "110px", noOther: true },
        { id: "temp", sddCode: settingCode["temp"].sddCode, sddName: "体温", range: settingCode["temp"].range, normalRange: settingCode["temp"].normalRange, width: "110px" },
        { id: "pulse", sddCode: settingCode["pulse"].sddCode, sddName: "脉搏", range: settingCode["pulse"].range, normalRange: settingCode["pulse"].normalRange, width: "110px" },
        { id: "heartRate", sddCode: settingCode["heartRate"].sddCode, sddName: "心率", range: settingCode["heartRate"].range, normalRange: settingCode["heartRate"].normalRange, width: "110px" },
        { id: "respire", sddCode: settingCode["respire"].sddCode, sddName: "呼吸", range: settingCode["respire"].range, normalRange: settingCode["respire"].normalRange, width: "110px" },
        // { id: "respirator", sddCode: settingCode["respirator"].sddCode, sddName: "呼吸机", width: "60px", type: "checkbox", noOther: true },
        { id: "bp", sddCode: settingCode["bp"].sddCode, value: ["SBP", "DBP"], sddName: "血压", range: settingCode["bp"].range, normalRange: [settingCode["SBP"].normalRange, settingCode["DBP"].normalRange], width: "auto" },
        { id: "spo2", sddCode: settingCode["spo2"].sddCode, sddName: "血氧", range: settingCode["spo2"].range, normalRange: settingCode["spo2"].normalRange, width: "110px" },
        { id: "faeces", sddCode: settingCode["faeces"].sddCode, sddName: "大便次数", width: "80px", noNumber: true, noOther: true },
        { id: "faecesType", sddCode: settingCode["faecesType"].sddCode, sddName: "大便类型", data: "faecesList", width: "110px", type: "select", noOther: true },
        { id: "faeces1", sddCode: settingCode["faeces1"].sddCode, sddName: "灌肠后大便次数", width: "110px", noOther: true },
        { id: "weight", sddCode: settingCode["weight"].sddCode, sddName: "体重", width: "110px" },
        { id: "specialEvent", sddCode: settingCode["specialEvent"].sddCode, sddName: "特殊事件", type: "select", data: "specialEventsList", width: "105px", noOther: true },
        { id: "remarkName", sddName: "备注", width: "110px", noOther: true, noNumber: true },
        { id: "remarkValue", sddName: "备注值", width: "110px", noOther: true },
      ]
      // settings.writeCareSheetIsCheck=true,//有异常生命体征时，护记是否默认勾选
      // settings.xScroll = 1915;//横向滚动条
      settings.xScroll = 1865;//横向滚动条
      // settings.xScroll = 1785;//横向滚动条
      settings.xLeft = 250;//第一列input的左边位置
      settings.isAllTpr = true;//新增是否默认勾选上tpr
      settings.inputLengthRow = 12;//一行input的个数
      break;
    case 3://建德
      settings.tipDataSource = [
        { sign: "*", message: "常规", info: "1次/日(14:00)" },
        { sign: "◇", message: "新入院", info: "2 次/日(6:00、 14:00)，连续测 2 日" },
        { sign: "O", message: "术后三日内", info: "3 次/日(06:00、14:00、18:00）" },
        { sign: "☆37.5", message: "≥37.5℃", info: "3 次/日(06:00、14:00、18:00）" },
        { sign: "☆38", message: "≥38℃", info: "4 次/日(06:00、 10:00、14:00、18:00）" },
        { sign: "☆39", message: "≥39℃", info: "6 次/日(06:00、10:00、14:00、18:00、 22:00、02:00）" },
        { sign: "☆38.5↓", message: "≥38.5℃", info: "有降温措施，降温后 0.5 小时～1 小时需测体温" },
        { sign: "◎", message: "恢复正常", info: "发热患者，体温正常后 2 次/日(6:00、 14:00)，连续测 2 日" },
        { sign: "△", message: "小儿常规", info: "10岁以下小儿，2 次/日(6:00、 14:00)" },
        { sign: "△☆38", message: "小儿≥38℃", info: "每日 6 次（06:00、10:00、14:00、18:00、22:00、02:00）" },
      ];
      // settings.hasSheet = true;//是否有护记
      settings.inputColumns = [
        { id: "cosc", sddCode: settingCode["cosc"].sddCode, sddName: "意识", type: "select", data: "consciousnessList", width: "130px" },
        { id: "temp", sddCode: settingCode["temp"].sddCode, sddName: "体温", range: settingCode["temp"].range, normalRange: settingCode["temp"].normalRange, width: "110px" },
        { id: "pulse", sddCode: settingCode["pulse"].sddCode, sddName: "脉搏", range: settingCode["pulse"].range, normalRange: settingCode["pulse"].normalRange, width: "110px" },
        { id: "heartRate", sddCode: settingCode["heartRate"].sddCode, sddName: "心率", range: settingCode["heartRate"].range, normalRange: settingCode["heartRate"].normalRange, width: "110px" },
        { id: "respire", sddCode: settingCode["respire"].sddCode, sddName: "呼吸", range: settingCode["respire"].range, normalRange: settingCode["respire"].normalRange, width: "110px" },
        { id: "bp", sddCode: settingCode["bp"].sddCode, value: ["SBP", "DBP"], sddName: "血压", range: settingCode["bp"].range, normalRange: [settingCode["SBP"].normalRange, settingCode["DBP"].normalRange], width: "auto" },
        { id: "spo2", sddCode: settingCode["spo2"].sddCode, sddName: "血氧", range: settingCode["spo2"].range, normalRange: settingCode["spo2"].normalRange, width: "110px" },
        { id: "faeces", sddCode: settingCode["faeces"].sddCode, sddName: "大便", width: "110px" },
        { id: "faecesType", sddCode: settingCode["faecesType"].sddCode, sddName: "大便类型", data: "faecesList", width: "130px", type: "select", noOther: true },
        { id: "faeces1", sddCode: settingCode["faeces1"].sddCode, sddName: "灌肠后大便次数", width: "120px", noOther: true },
        { id: "mews", sddCode: settingCode["mews"].sddCode, sddName: "MEWS评分", width: "96px", type: "button", placeholder: "生成评分", noOther: true },
        { id: "pain", sddCode: settingCode["pain"].sddCode, sddName: "疼痛评分", width: "96px", type: "button", placeholder: "评估", icon: "icon-211", noOther: true },
        { id: "weight", sddCode: settingCode["weight"].sddCode, sddName: "体重", width: "110px" },
        { id: "height", sddCode: settingCode["height"].sddCode, sddName: "身高", width: "110px" },
      ]
      settings.xScroll = 2030;//横向滚动条 340
      // settings.xScroll = 1946;//横向滚动条 340
      // settings.xScroll = 1534;//横向滚动条 340
      settings.xLeft = 250;//第一列input的左边位置
      settings.inputLengthRow = 11;//一行input的个数
      break;
    case 4://营山
      settings.tipDataSource = [
        { sign: "*", message: "常规", info: "1次/日(15:00)" },
        { sign: "◇", message: "新入院", info: "2 次/日(7:00、 15:00)，连续测 2 日" },
        { sign: "O", message: "术后三日内", info: "3 次/日(07:00、15:00、19:00）" },
        { sign: "☆37.5", message: "≥37.5℃", info: "3 次/日(07:00、15:00、19:00）" },
        { sign: "☆38", message: "≥38℃", info: "4 次/日(07:00、 11:00、15:00、19:00）" },
        { sign: "☆39", message: "≥39℃", info: "6 次/日(07:00、11:00、15:00、19:00、 23:00、03:00）" },
        { sign: "☆38.5↓", message: "≥38.5℃", info: "有降温措施，降温后 0.5 小时～1 小时需测体温" },
        { sign: "◎", message: "恢复正常", info: "发热患者，体温正常后 2 次/日(7:00、 15:00)，连续测 2 日" },
        { sign: "△", message: "小儿常规", info: "10岁以下小儿，2 次/日(7:00、 15:00)" },
        { sign: "△☆38", message: "小儿≥38℃", info: "每日 6 次（07:00、11:00、15:00、19:00、23:00、03:00）" },
      ];
      // settings.hasSheet = true;//是否有护记
      settings.inputColumns = [
        { id: "temp", sddCode: settingCode["temp"].sddCode, sddName: "体温", range: settingCode["temp"].range, normalRange: settingCode["temp"].normalRange, width: "110px" },
        { id: "pulse", sddCode: settingCode["pulse"].sddCode, sddName: "脉搏", range: settingCode["pulse"].range, normalRange: settingCode["pulse"].normalRange, width: "110px" },
        { id: "heartRate", sddCode: settingCode["heartRate"].sddCode, sddName: "心率", range: settingCode["heartRate"].range, normalRange: settingCode["heartRate"].normalRange, width: "110px" },
        { id: "respire", sddCode: settingCode["respire"].sddCode, sddName: "呼吸", range: settingCode["respire"].range, normalRange: settingCode["respire"].normalRange, width: "110px" },
        { id: "bp", sddCode: settingCode["bp"].sddCode, value: ["SBP", "DBP"], sddName: "血压", range: settingCode["bp"].range, normalRange: [settingCode["SBP"].normalRange, settingCode["DBP"].normalRange], width: "auto" },
        { id: "spo2", sddCode: settingCode["spo2"].sddCode, sddName: "血氧饱和度", range: settingCode["spo2"].range, normalRange: settingCode["spo2"].normalRange, width: "110px" },
        { id: "height", sddCode: settingCode["height"].sddCode, sddName: "身高", width: "110px" },
        { id: "weight", sddCode: settingCode["weight"].sddCode, sddName: "体重", width: "110px" },
        { id: "specialEvent", sddCode: settingCode["specialEvent"].sddCode, sddName: "特殊事件", type: "select", data: "specialEventsList", width: "105px", noOther: true },
        { id: "specialEventRemark", sddName: "特殊事件备注", width: "110px", noOther: true, noNumber: true },
      ]
      settings.xScroll = 1515;//横向滚动条
      // settings.xScroll = false;//横向滚动条
      settings.inputLengthRow = 10;//一行input的个数
      // settings.inputLengthRow = 9;//一行input的个数
      settings.xLeft = 340;//第一列input的左边位置
      // settings.timeList=["03:00", "07:00", "11:00", "15:00", "19:00", "23:00"]
      // settings.timeDelay=2;
      break;
    case 5://丽水
      settings.tipDataSource = [
        { sign: "*", message: "常规", info: "1次/日(14:00)" },
        { sign: "◇", message: "新入院", info: "2 次/日(10:00、 14:00)，连续测 2 日" },
        { sign: "☆37.5", message: "≥37.5℃", info: "3 次/日(12:00、16:00、20:00）" },
        { sign: "☆38", message: "≥38℃", info: "4 次/日(06:00、 12:00、16:00、20:00）" },
        { sign: "☆39", message: "≥39℃", info: "6 次/日(02:00、06:00、10:00、14:00、18:00、 22:00）" },
        { sign: "◎", message: "恢复正常", info: "发热患者，体温正常后 2 次/日(6:00、 14:00)，连续测 2 日" },
        { sign: "△", message: "小儿常规", info: "10岁以下小儿，2 次/日(6:00、 14:00)" },
        { sign: "△☆38", message: "小儿≥38℃", info: "每日 6 次（02:00、06:00、10:00、14:00、18:00、 22:00）" },
        { sign: "▲", message: "三天未大便", info: "只是标注患者不勾选" },
        { sign: "★", message: "夜眠", info: "低于6小时标注不勾选" },
      ];
      // settings.hasSheet = true;//是否有护记
      settings.inputColumns = [
        { id: "temp", sddCode: settingCode["temp"].sddCode, sddName: "体温", range: settingCode["temp"].range, normalRange: settingCode["temp"].normalRange, width: "110px" },
        { id: "pulse", sddCode: settingCode["pulse"].sddCode, sddName: "脉搏", range: settingCode["pulse"].range, normalRange: settingCode["pulse"].normalRange, width: "110px" },
        { id: "heartRate", sddCode: settingCode["heartRate"].sddCode, sddName: "心率", range: settingCode["heartRate"].range, normalRange: settingCode["heartRate"].normalRange, width: "110px" },
        { id: "respire", sddCode: settingCode["respire"].sddCode, sddName: "呼吸", range: settingCode["respire"].range, normalRange: settingCode["respire"].normalRange, width: "110px" },
        { id: "bp", sddCode: settingCode["bp"].sddCode, value: ["SBP", "DBP"], sddName: "血压", range: settingCode["bp"].range, normalRange: [settingCode["SBP"].normalRange, settingCode["DBP"].normalRange], width: "auto" },
        { id: "faeces", sddCode: settingCode["faeces"].sddCode, sddName: "大便次数", width: "110px" },
        { id: "faecesType", sddCode: settingCode["faecesType"].sddCode, sddName: "大便类型", data: "faecesList", width: "130px", type: "select", noOther: true },
        { id: "sleep", sddCode: settingCode["sleep"].sddCode, sddName: "睡眠", width: "110px" },
        { id: "spo2", sddCode: settingCode["spo2"].sddCode, sddName: "血氧", range: settingCode["spo2"].range, normalRange: settingCode["spo2"].normalRange, width: "110px" },
        { id: "weight", sddCode: settingCode["weight"].sddCode, sddName: "体重", width: "110px" },
        { id: "period", sddCode: settingCode["period"].sddCode, sddName: "月经", width: "280px", type: "dateRange" },
        { id: "girth", sddCode: settingCode["girth"].sddCode, sddName: "腹围", width: "110px" },
        { id: "height", sddCode: settingCode["height"].sddCode, sddName: "身高", width: "110px" },
        { id: "specialEvent", sddCode: settingCode["specialEvent"].sddCode, sddName: "特殊事件", type: "select", data: "specialEventsList", width: "105px", noOther: true },
      ]
      // settings.writeCareSheetIsCheck=true,//有异常生命体征时，护记是否默认勾选
      settings.xScroll = 2150;//横向滚动条
      settings.xLeft = 250;//第一列input的左边位置
      settings.defaultValue = { faecesType: "normal" };
      settings.inputLengthRow = 12;//一行input的个数
      settings.isAllTpr = true;//新增是否默认勾选上tpr
      // settings.defalutTimePoint = "14:00";
      break;
    case 6://大江东
      settings.tipDataSource = [
        { sign: "*", message: "常规", info: "1次/日(14:00)" },
        { sign: "◇", message: "新入院", info: "2 次/日(6:00、 14:00)，连续测 2 日" },
        { sign: "O", message: "术后三日内", info: "3 次/日(06:00、14:00、18:00）" },
        { sign: "☆37.5", message: "≥37.5℃", info: "3 次/日(06:00、14:00、18:00）" },
        { sign: "☆38", message: "≥38℃", info: "4 次/日(06:00、 10:00、14:00、18:00）" },
        { sign: "☆39", message: "≥39℃", info: "6 次/日(06:00、10:00、14:00、18:00、 22:00、02:00）" },
        { sign: "☆38.5↓", message: "≥38.5℃", info: "有降温措施，降温后 0.5 小时～1 小时需测体温" },
        { sign: "◎", message: "恢复正常", info: "发热患者，体温正常后 2 次/日(6:00、 14:00)，连续测 2 日" },
        { sign: "△", message: "小儿常规", info: "10岁以下小儿，2 次/日(6:00、 14:00)" },
        { sign: "△☆38", message: "小儿≥38℃", info: "每日 6 次（06:00、10:00、14:00、18:00、22:00、02:00）" },
      ];
      // settings.hasSheet = true;//是否有护记
      settings.inputColumns = [
        { id: "cosc", sddCode: settingCode["cosc"].sddCode, sddName: "意识", type: "select", data: "consciousnessList", width: "130px" },
        { id: "temp", sddCode: settingCode["temp"].sddCode, sddName: "体温", range: settingCode["temp"].range, normalRange: settingCode["temp"].normalRange, width: "110px" },
        { id: "pulse", sddCode: settingCode["pulse"].sddCode, sddName: "脉搏", range: settingCode["pulse"].range, normalRange: settingCode["pulse"].normalRange, width: "110px" },
        { id: "heartRate", sddCode: settingCode["heartRate"].sddCode, sddName: "心率", range: settingCode["heartRate"].range, normalRange: settingCode["heartRate"].normalRange, width: "110px" },
        { id: "respire", sddCode: settingCode["respire"].sddCode, sddName: "呼吸", range: settingCode["respire"].range, normalRange: settingCode["respire"].normalRange, width: "110px" },
        { id: "bp", sddCode: settingCode["bp"].sddCode, value: ["SBP", "DBP"], sddName: "血压", range: settingCode["bp"].range, normalRange: [settingCode["SBP"].normalRange, settingCode["DBP"].normalRange], width: "auto" },
        { id: "spo2", sddCode: settingCode["spo2"].sddCode, sddName: "血氧", range: settingCode["spo2"].range, normalRange: settingCode["spo2"].normalRange, width: "110px" },
        { id: "faeces", sddCode: settingCode["faeces"].sddCode, sddName: "大便", width: "110px" },
        { id: "faecesType", sddCode: settingCode["faecesType"].sddCode, sddName: "大便类型", data: "faecesList", width: "130px", type: "select", noOther: true },
        { id: "faeces1", sddCode: settingCode["faeces1"].sddCode, sddName: "灌肠后大便次数", width: "120px", noOther: true },
        { id: "mews", sddCode: settingCode["mews"].sddCode, sddName: "MEWS评分", width: "96px", type: "button", placeholder: "生成评分", noOther: true },
        { id: "pain", sddCode: settingCode["pain"].sddCode, sddName: "疼痛评分", width: "96px", type: "button", placeholder: "评估", icon: "icon-211", noOther: true },
        { id: "weight", sddCode: settingCode["weight"].sddCode, sddName: "体重", width: "110px" },
        { id: "height", sddCode: settingCode["height"].sddCode, sddName: "身高", width: "110px" },
      ]
      settings.xScroll = 2030;//横向滚动条 340
      // settings.xScroll = 1946;//横向滚动条 340
      // settings.xScroll = 1534;//横向滚动条 340
      settings.xLeft = 250;//第一列input的左边位置
      settings.inputLengthRow = 11;//一行input的个数
      break;
    default:
      settings.tipDataSource = [
        { sign: "*", message: "常规", info: "1次/日(14:00)" },
        { sign: "◇", message: "新入院", info: "2 次/日(6:00、 14:00)，连续测 2 日" },
        { sign: "O", message: "术后三日内", info: "3 次/日(06:00、14:00、18:00）" },
        { sign: "☆37.5", message: "≥37.5℃", info: "3 次/日(06:00、14:00、18:00）" },
        { sign: "☆38", message: "≥38℃", info: "4 次/日(06:00、 10:00、14:00、18:00）" },
        { sign: "☆39", message: "≥39℃", info: "6 次/日(06:00、10:00、14:00、18:00、 22:00、02:00）" },
        { sign: "☆38.5↓", message: "≥38.5℃", info: "有降温措施，降温后 0.5 小时～1 小时需测体温" },
        { sign: "◎", message: "恢复正常", info: "发热患者，体温正常后 2 次/日(6:00、 14:00)，连续测 2 日" },
        { sign: "△", message: "小儿常规", info: "10岁以下小儿，2 次/日(6:00、 14:00)" },
        { sign: "△☆38", message: "小儿≥38℃", info: "每日 6 次（06:00、10:00、14:00、18:00、22:00、02:00）" },
      ];
      // settings.hasSheet = true;//是否有护记
      settings.inputColumns = [
        { id: "temp", sddCode: settingCode["temp"].sddCode, sddName: "体温", range: settingCode["temp"].range, normalRange: settingCode["temp"].normalRange },
        { id: "pulse", sddCode: settingCode["pulse"].sddCode, sddName: "脉搏", range: settingCode["pulse"].range, normalRange: settingCode["pulse"].normalRange },
        { id: "respire", sddCode: settingCode["respire"].sddCode, sddName: "呼吸", range: settingCode["respire"].range, normalRange: settingCode["respire"].normalRange },
        { id: "bp", sddCode: settingCode["bp"].sddCode, value: ["SBP", "DBP"], sddName: "血压", range: settingCode["bp"].range, normalRange: [settingCode["SBP"].normalRange, settingCode["DBP"].normalRange] },
        { id: "spo2", sddCode: settingCode["spo2"].sddCode, sddName: "血氧饱和度", range: settingCode["spo2"].range, normalRange: settingCode["spo2"].normalRange },
        { id: "girth", sddCode: settingCode["girth"].sddCode, sddName: "腹围" },
        { id: "height", sddCode: settingCode["height"].sddCode, sddName: "身高" },
        { id: "weight", sddCode: settingCode["weight"].sddCode, sddName: "体重" },
      ]
      settings.xScroll = false;//横向滚动条
      settings.inputLengthRow = 9;//一行input的个数
      break;
  }
  settings.settingCode = settingCode;
  return settings;
}
