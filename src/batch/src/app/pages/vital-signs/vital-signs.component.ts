/**
 * 生命体征批量录入
 * 吕兴海
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  TableOption,
  TableData,
  HeaderOption,
  Select,
  MessageOption
} from "./interface";
import { VitalSignsService } from "./vital-signs.service";
import { AppService } from "../../app.service";
import * as moment from "moment";
import { vitalSettings } from "./../../utils/hospitalSettings/vitalSettings";
import { getParams, fromTimeToPoint } from "../../utils/getParams";

@Component({
  selector: 'batch-vital-signs',
  templateUrl: './vital-signs.component.html',
  styleUrls: ['./vital-signs.component.less']
})
export class VitalSignsComponent implements OnInit, OnDestroy {
  chooseRow: any[] = [];
  headerOption: HeaderOption = {
    headerDate: '',
    settings: {}
  };
  tableOption: TableOption = {
    settings: {},
    columnData: null,
    parameters: {},
  }
  timer = null;
  settings;
  keyId = "visitno";
  select: Select = {
    timeObj: [],
    headerTime: ''
  };
  ivIds = [];
  oldIds = [];//疼痛取消暂存旧的id
  columnData;

  constructor(
    private vitalSignsService: VitalSignsService,
    private appService: AppService,
  ) { }

  ngOnInit() {
    this.settings = vitalSettings(getParams('hi_Id'));
    // this.settings = vitalSettings(4);
    this.select.headerTime = this.settings.defalutTimePoint
      ? this.settings.defalutTimePoint : "";
    this.headerOption.settings = this.settings;
    this.headerOption.headerDate = this.settings.isTimepoint
      ? moment().format("YYYY-MM-DD")
      : moment().format();
    this.appService.getAllDic().subscribe((dictionaryResponse) => {
      this.getVitalSign(dictionaryResponse);
    });
    this.tableOption.settings = this.settings;
    window.addEventListener("message", this.receiveMessage, false);
  }

  ngOnDestroy() {
    window.removeEventListener("message", this.receiveMessage);
  }

  receiveMessage = (event) => {
    // console.log(event, event.data)
    if (event.origin !== getParams('origin')) return;
    this.vitalSignsService.saveParentWindow(event);
    let option: MessageOption = JSON.parse(event.data);
    switch (option.id) {
      case 'userMessage':
        // localStorage.setItem('userMessage', JSON.stringify(option.data));
        // 告诉父级window收到数据了，不用再继续轮询
        let _option: MessageOption = { id: 'close' }
        event.source.postMessage(JSON.stringify(_option), event.origin);
        break;
      case 'painCallback':
        this.vitalSignsService.setPainCallback(option.data);
        break;
    }
  }

  //获取字典
  getVitalSign(allDic) {
    const { dictionrays, parameters } = allDic;
    if (!dictionrays || !parameters) return false;
    const {
      timepoint,
      unable_cause,
      consciousness,
      special_events,
      faecesType
    } = dictionrays;
    //数字键盘是否自动：BulkMeasurementViewType
    const { BulkMeasurementViewType } = parameters;
    let timeObj = timepoint || [];
    this.select = {
      timeObj,
      headerTime: this.settings.defalutTimePoint
        ? this.settings.defalutTimePoint
        : fromTimeToPoint(moment().format("HH"), timeObj)
    };
    this.tableOption.parameters = parameters;
    this.columnData = {
      measureViewType: BulkMeasurementViewType === "0" ? false : true,
      unableCauseList: unable_cause ? unable_cause : [],
      specialEventsList: special_events ? special_events : [],
      consciousnessList: consciousness ? consciousness : [],
      faecesList: faecesType ? faecesType : []
    }
    this.vitalSignsService.setColumnData(this.columnData);
    this.vitalSignsService.setInitTimeSelect(this.select);
    this.getData(false);
  }

  // 选择患者回调
  chooseModalData(data) {
    let chooseRow = [];
    data.map((item, index) => {
      const itemIndex = this.chooseRow.findIndex(chooseItem => chooseItem[this.keyId] === item[this.keyId]);
      if (itemIndex > -1) {
        chooseRow.push(this.chooseRow[itemIndex]);
      } else {
        let returnItem = item;
        if (this.settings.defaultValue) {
          returnItem = { ...returnItem, ...this.settings.defaultValue }
        }
        chooseRow.push(returnItem);
      }
    });
    chooseRow.sort((a, b) => { return a.sort - b.sort });
    this.chooseRow = chooseRow;
    this.vitalSignsService.setCheckBoxChange({
      type: 'isTpr',
      indeterminate: false,
      checkAll: false
    });
    this.vitalSignsService.setCheckBoxChange({
      type: 'writeCareSheet',
      indeterminate: false,
      checkAll: false
    });
    // console.log(chooseRow);
  }

  // 获取病区数据
  getData = (hasClearRow) => {
    if (hasClearRow) this.chooseRow = [];
    const { headerDate } = this.headerOption;
    const { headerTime } = this.select;
    //取消疼痛暂存
    let deleteIds = this.chooseRow && this.chooseRow.length > 0
      ? this.chooseRow.filter(item => {//筛选有疼痛，并且修改过
        return item.pain && item.painId;
      }) : [];
    if (deleteIds.length > 0) {
      const iaIds = deleteIds.map(item => item.painId).join(",");
      const oldIds = this.oldIds.join(",");
      this.vitalSignsService.batchDeleteState({ newIds: iaIds, oldIds: oldIds })
        .subscribe(() => {
          this.oldIds = [];
        });
    }
    //获取病区数据
    this.vitalSignsService.vitalsignBulkList(
      {
        wardId: getParams('bingquId'),
        reviewTime: moment(headerDate).format("YYYY/MM/DD HH:mm"),
        reviewTimePoint: headerTime
      }, this.settings.allNoHuji ? 'v3' : 'v1')
      .subscribe((res: any) => {
        let data = res.data;
        if (!data) return false;
        let vitalSignInfo = [];
        if (data.vitalSignInfo && data.vitalSignInfo.length > 0) {
          data.vitalSignInfo.map(item => {
            if (item) {
              let returnObj = { isEdit: true };
              for (let key in item) {
                if (key === "period") {
                  if (item[key] && (item[key].value1 || item[key].value2)) {
                    returnObj["period"] = [item[key].value1, item[key].value2];
                    if (item[key].ivdTpr === 1) {//tpr
                      returnObj[key + "Tpr"] = true;
                      if (item[key].timePoint) {
                        returnObj[key + "TimePoint"] = item[key].timePoint;
                      }
                    }
                    if (item[key].ivdRecord === 1) {//护记
                      returnObj[key + "Huji"] = true
                    }
                  }

                } else if (key === "bp") {
                  if (item[key]) {
                    if (item[key].ivdTpr === 1) {//tpr
                      returnObj[key + "Tpr"] = true;
                      if (item[key].timePoint) {
                        returnObj[key + "TimePoint"] = item[key].timePoint;
                      }
                    }
                    if (item[key].ivdRecord === 1) {//护记
                      returnObj[key + "Huji"] = true
                    }
                    if (item[key].unableReason) {//未测原因
                      returnObj[key + "Reason"] = item[key].unableReason;
                      const reasonObj = this.columnData.unableCauseList
                        .find(
                          item => item.sddCode === returnObj[key + "Reason"]
                        );
                      if (reasonObj && reasonObj.sddName) {
                        returnObj["SBP"] = reasonObj.sddName;
                        returnObj["DBP"] = reasonObj.sddName;
                        // returnObj[key] = reasonObj.sddName;
                      }
                    } else {
                      returnObj["SBP"] = item[key].value1;
                      returnObj["DBP"] = item[key].value2;
                    }
                  }
                } else if (key === "note") {
                  if (item[key] && item[key].ivdName) {
                    returnObj["remarkName"] = item[key].ivdName
                  }
                  if (item[key] && item[key].value1) {
                    returnObj["remarkValue"] = item[key].value1
                  }
                } else if (key === "mews") {//mews评分
                  if (item[key]) {
                    if (item[key].value1) {
                      returnObj[key] = item[key].value1;
                      returnObj[key + "Color"] = item[key].remark;
                    }
                  }
                } else if (key === "pain") {
                  if (item[key] && item[key].value2) {
                    returnObj[key] = item[key].value1 + '分(' + item[key].value1Unit + ')';
                    returnObj[key + "Score"] = item[key].value1;
                    returnObj[key + "Id"] = item[key].value2;
                    returnObj[key + "DangerType"] = item[key].value1Unit;
                    returnObj[key + "Code"] = item[key].value2Unit;
                    returnObj[key + "Color"] = item[key].remark;
                    this.oldIds.push(item[key].value2);
                  }
                } else if (key !== "bp" && key !== "note" && key !== "period" && key !== "mews" && key !== "pain") {
                  if (this.settings.settingCode[key]) {
                    if (item[key]) {
                      if (item[key].ivdTpr === 1) {//tpr
                        returnObj[key + "Tpr"] = true;
                        if (item[key].timePoint) {
                          returnObj[key + "TimePoint"] = item[key].timePoint;
                        }
                      }
                      if (item[key].ivdRecord === 1) {//护记
                        returnObj[key + "Huji"] = true
                      }
                      if (item[key].unableReason) {//未测原因
                        if (key === "faeces") {
                          returnObj[key + "Type"] = item[key].unableReason;
                          if (item[key].value2) {
                            returnObj["faeces1"] = item[key].value2;
                          }
                        } else {
                          returnObj[key + "Reason"] = item[key].unableReason;
                          const reasonObj = this.columnData.unableCauseList.find(item => returnObj[key + "Reason"] && (item.sddCode === returnObj[key + "Reason"]));
                          if (reasonObj && reasonObj.sddName) {
                            returnObj[key] = reasonObj.sddName;
                          }
                        }
                      }
                      if (item[key].remark) {//是否有备注
                        returnObj[key + "Remark"] = item[key].remark
                      }
                      if (item[key].value1) {
                        returnObj[key] = item[key].value1;
                      }
                    }
                  } else {
                    returnObj[key] = item[key]
                  }
                }
              }
              vitalSignInfo.push(returnObj);
            }
          })
        }
        let scheduleInfo = [];
        if (data.scheduleInfo && data.scheduleInfo.length > 0) {
          scheduleInfo = data.scheduleInfo;
        }
        let chooseRow = vitalSignInfo.concat(scheduleInfo);
        if (!this.settings.allNoHuji) {
          let oldChooseRow = [...this.chooseRow];
          if (oldChooseRow.length > 0) {
            chooseRow.map(item => {
              const rowIndex = oldChooseRow.findIndex(row => row.visitno === item.visitno);
              if (rowIndex > -1) {
                oldChooseRow.splice(rowIndex, 1);
              }
            })
            oldChooseRow = oldChooseRow.map((item, index) => {
              return {
                bedno: item.bedno,
                ptname: item.ptname,
                chartno: item.chartno,
                visitno: item.visitno,
                sort: item.sort,
                departmentNo: item.departmentNo,
                reason: item.reason,
                ...this.settings.defaultValue
              };
            })
            chooseRow = chooseRow.concat(oldChooseRow)
          }
        }

        chooseRow.sort((a, b) => { return a.sort - b.sort });
        // console.log(chooseRow);
        this.vitalSignsService.setCheckBoxChange({
          type: 'isTpr',
          indeterminate: false,
          checkAll: false
        });
        this.vitalSignsService.setCheckBoxChange({
          type: 'writeCareSheet',
          indeterminate: false,
          checkAll: false
        });
        this.chooseRow = chooseRow;
        this.ivIds = data.ivIds;
      });
  }
}
