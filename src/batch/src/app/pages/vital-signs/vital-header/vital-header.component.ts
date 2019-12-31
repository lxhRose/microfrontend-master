import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HeaderOption, CheckBox, CheckAllOption, Select } from "../interface";
import { VitalSignsService } from "./../vital-signs.service";
import { getParams, fromTimeToPoint } from "./../../../utils/getParams";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as moment from "moment";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'vital-header',
  templateUrl: './vital-header.component.html',
  styleUrls: ['./vital-header.component.less']
})
export class VitalHeaderComponent implements OnInit {
  @Input()
  set option(option: HeaderOption) {
    this._option = option;
  }
  get option(): HeaderOption {
    return this._option;
  }
  @Input() ivIds;
  @Input() chooseRow: Array<any>;

  @Output() chooseModalData = new EventEmitter<boolean>();
  @Output() getData = new EventEmitter<boolean>();

  _option: HeaderOption;
  select: Select = {
    timeObj: [],
    headerTime: ''
  };
  hiddenChooseTip: boolean = true;
  isTpr: CheckAllOption = {
    indeterminate: false,
    checkAll: false
  };
  writeCareSheet: CheckAllOption = {
    indeterminate: false,
    checkAll: false
  };

  constructor(
    private vitalSignsService: VitalSignsService,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.vitalSignsService.getCheckBoxChange().subscribe((obj: CheckBox) => {
      this[obj.type] = {
        indeterminate: obj.indeterminate,
        checkAll: obj.checkAll
      }
    });
    this.vitalSignsService.getInitTimeSelect().subscribe((select: Select) => {
      this.select = select;
    });
  }

  // checkbox全选/取消
  _onCheckAllChange(id): void {
    this[id].indeterminate = false;
    this.chooseRow.map(item => {
      item[id] = this[id].checkAll
    });
    this.vitalSignsService.setRowCheckboxChecked(id, this[id].checkAll);
  }

  // 选择患者回调
  _chooseModalData(data) {
    this.chooseModalData.emit(data);
  }

  // 时间选择器
  dateHandleChange(date) {
    let settings = this._option.settings;
    this._option.headerDate = date;
    if (!settings.defalutTimePoint) {
      if (!settings.isTimepoint) {
        this.select.headerTime =
          fromTimeToPoint(moment(date).format("HH"), this.select.timeObj);
      } else {
        this.select.headerTime =
          fromTimeToPoint(moment().format("HH"), this.select.timeObj);
      }
    }
    if (settings.isTimepoint) {
      this.getData.emit();
    }
  }


  // 时间下拉框
  timeHandleChange(value) {
    let settings = this._option.settings;
    if (settings.isTimepoint) {
      this.getData.emit();
    } else {
      this.chooseRow.map(item => {
        settings.inputColumns.map(ntem => {
          if (
            !ntem.noOther && ntem.type !== "select"
            && settings.settingCode[ntem.id]
            && !settings.settingCode[ntem.id].noTpr
          ) {
            item[`${ntem.id}TimePoint`] = value;
          }
        });
      });
    }
  }

  showTip(hide) {
    this.hiddenChooseTip = hide;
  }

  save() {
    let bingquId = getParams('bingquId'),
      bulkDetailVoList = [],
      chooseRow = [...this.chooseRow],
      ivIds = [],
      bpIsDouble = true,
      hasBeizhuName = true,
      periodStart = true,
      settings = this._option.settings;
    if (!chooseRow || chooseRow.length === 0) {
      this.notification.error(
        '错误',
        '请先选择患者',
        { nzDuration: 2000 }
      );
      return false
    }
    const Arr = [
      { id: 'girth', hasStatus: true }, // 围长
      { id: 'height', hasStatus: false }, // 身高
      { id: 'pulse', hasStatus: true }, // 脉搏
      { id: 'heartRate', hasStatus: true }, // 心率
      { id: 'respire', hasStatus: true }, // 呼吸
      { id: 'spo2', hasStatus: true }, // 血氧
      { id: 'temp', hasStatus: true }, // 体温
      { id: 'weight', hasStatus: false }, // 体重
      { id: 'sleep', hasStatus: false } // 睡眠
    ];
    chooseRow.map(item => {
      if (this.ivIds.findIndex(ids => ids.patientNo === item.visitno) > -1) {
        ivIds.push(this.ivIds[
          this.ivIds.findIndex(ids => ids.patientNo === item.visitno)
        ]);
      }
      let sign = 0;
      let itemValue = {} as any;
      const codeObj = settings.settingCode;
      if ((!item.SBP && item.DBP) || (item.SBP && !item.DBP)) {
        bpIsDouble = false;
      }
      if (item.height && item.weight) {
        sign = 1;
        const weight = item.weight - 0;
        const height = (item.height - 0) / 100;
        const value = weight / (height * height)
        itemValue.bmi = { ivdCode: codeObj["bmi"].sddCode, measureDetail: "", value1: value.toFixed(1) }
      }
      Arr.map((idObj) => {
        if (item[idObj.id] || item[`${idObj.id}Reason`]) {
          sign = 1;
          this.creatRolData(itemValue, item, idObj.id, idObj.hasStatus);
          if (idObj.id === 'respire' && item.respirator) {//呼吸机
            itemValue.respire.ivdIsCpap = 1;
          }
        }
      });
      if ((item.SBP && item.DBP) || item.bpReason) {//bp
        sign = 1;
        this.creatRolData(itemValue, item, 'bp');
        console.log(itemValue);
      }
      if (item.faeces || item.faecesType) {//大便
        sign = 1;
        let params = {} as any;
        this.creatTprHuji(item, 'faeces', settings, params);
        if (item.faecesType) {
          params.unableReason = item.faecesType;
          // params.value1 = null;
          if (item.faecesType === "enemas" && item.faeces1) {
            params.value2 = item.faeces1;
          }
        }
        if (item.faeces) {
          params.value1 = item.faeces;
        }
        itemValue.faeces = { ivdCode: codeObj["faeces"].sddCode, measureDetail: "", ...params }
      }
      if (item.remarkValue && !item.remarkName) {//备注有值，没名
        hasBeizhuName = false;
      } else if (item.remarkValue && item.remarkName) {//备注有值，有名
        sign = 1;
        itemValue.beizhu = { ivdCode: codeObj["beizhu"].sddCode, measureDetail: "", ivdName: item.remarkName, value1: item.remarkValue, ivdIsTpr: 1 }
      }
      if (item.specialEvent) {//特殊事件
        sign = 1;
        let params = { ivdCode: codeObj["specialEvent"].sddCode, measureDetail: "", value1: item.specialEvent } as any;
        if (item.specialEventRemark) {
          params.remark = item.specialEventRemark;
        }
        itemValue.specialEvent = params;
      }
      if (item.cosc) {//意识
        sign = 1;
        let params = {} as any;
        this.creatTprHuji(item, 'cosc', settings, params);
        itemValue.cosc = {
          ivdCode: codeObj["cosc"].sddCode,
          measureDetail: "",
          value1: item.cosc,
          ...params
        }
      }
      if (item.period && item.period.length > 0) {//月经
        sign = 1;
        let params = {} as any;
        if (item.period[0] || item.period[1]) {
          params.value1 = item.period[0];
          params.value2 = item.period[1];
          this.creatTprHuji(item, 'period', settings, params);
        } else {
          periodStart = false;
        }
        itemValue.period = { ivdCode: codeObj["period"].sddCode, ...params }
      }
      if (item.mews) {//mews评分
        sign = 1;
        let params = { value1: item.mews, remark: item.mewsColor };
        itemValue.mews = { ivdCode: codeObj["mews"].sddCode, ...params };
      }
      if (item.pain) {
        sign = 1;
        itemValue.pain = { ivdCode: codeObj["pain"].sddCode, value1: item.painScore, value2: item.painId, value1Unit: item.painDangerType, value2Unit: item.painCode, remark: item.painColor };
      }
      if (sign === 1) {
        itemValue.writeCareSheet = item.writeCareSheet ? 1 : 0;
        itemValue.timePoint = this.select.headerTime;
        itemValue.measureTime = moment(this._option.headerDate)
          .format("YYYY/MM/DD HH:mm");
        itemValue.ivSource = 1;
        itemValue.isTpr = item.isTpr || settings.allNoHuji ? 1 : 0;
        itemValue.bedno = item.bedno;
        itemValue.patientNo = item.visitno;
        itemValue.ptname = item.ptname;
        itemValue = {
          ...itemValue,
          ...{ departmentNo: item.departmentNo, chartno: item.chartno }
        }
        bulkDetailVoList.push(itemValue);
      }
    });
    if (!bpIsDouble) {//血压没有成对出现
      this.notification.error(
        '错误',
        '血压未填写完整',
        { nzDuration: 2000 }
      );
      return false;
    }
    if (!bpIsDouble) {//月经没有第一个，有第二个
      this.notification.error(
        '错误',
        '请选择月经开始时间',
        { nzDuration: 2000 }
      );
      return false;
    }
    if (!hasBeizhuName) {//备注只填入了值，没有填名称
      this.notification.error(
        '错误',
        '请输入备注名称',
        { nzDuration: 2000 }
      );
      return false;
    }
    if (bulkDetailVoList && bulkDetailVoList.length > 0) {
      //如果页面是没有护记的，就调v3版本接口
      this.vitalSignsService.setVitalsignBulk(
        { wardId: bingquId, bulkDetailVoList, ivIds },
        settings.allNoHuji ? 'v3' : 'v1'
      ).subscribe((res: any) => {
        this.message.success('保存成功');
        if (res.data !== undefined) {
          this.getData.emit(true);
        }
      }, () => {
        this.message.error('保存失败');
      });
    } else {
      this.notification.error(
        '未填写',
        '请先填写内容',
        { nzDuration: 2000 }
      );
    }
  }

  // 构造数据
  creatRolData(itemValue, item, id, hasStatus?) {
    let settings = this._option.settings;
    const codeObj = settings.settingCode;
    let params = {} as any;
    if (id !== 'bp') {
      // status
      if (hasStatus && (item[`${id}Status`] === 0 || item[`${id}Status`] === 1)) {
        params.measureDetail =
          item[`${id}measure`] && item[`${id}measure`].length > 0
            ? item[`${id}measure`].join(",")
            : "";
      } else {
        params.measureDetail = "";
      }
    } else {
      if (item.SBPStatus === 0 || item.SBPStatus === 1) {
        params.measureDetail = item.SBPmeasure && item.SBPmeasure.length > 0 ? item.SBPmeasure.join(",") : "";
      } else if (item.DBPStatus === 0 || item.DBPStatus === 1) {
        params.measureDetail = item.DBPmeasure && item.DBPmeasure ? item.DBPmeasure.join(",") : "";
      }
    }
    this.creatTprHuji(item, id, settings, params);
    // Reason
    if (item[`${id}Reason`]) {
      params.unableReason = item[`${id}Reason`];
      params.value1 = null;
      if (id === 'bp') params.value2 = null;
    } else {
      if (id !== 'bp') {
        params.value1 = item[id];
      } else {
        params.value1 = item.SBP;
        params.value2 = item.DBP;
      }
    }

    itemValue[id === 'temp' ? `temperature` : id] = {
      ivdCode: codeObj[id].sddCode,
      ...params
    }
  }

  creatTprHuji(item, id, settings, params) {
    // tpr
    if (item[`${id}Tpr`] || settings.allNoHuji) {
      params.ivdIsTpr = 1;
      params.timePoint = item[`${id}TimePoint`]
        ? item[`${id}TimePoint`]
        : this.select.headerTime;
    }
    // Huji
    if (item[`${id}Huji`]) {
      params.ivdRecord = 1;
    }
  }
}
