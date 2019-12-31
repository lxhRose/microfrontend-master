import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { TableData, Column } from "../../interface";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { VitalSignsService } from "./../../vital-signs.service";

@Component({
  selector: 'table-input',
  templateUrl: './table-input.component.html',
  styleUrls: ['./table-input.component.less']
})
export class TableInputComponent implements OnInit {
  @Input() data: TableData[];
  @Input() i: number;
  @Input() column: Column;
  @Input() num: number;
  @Input() parameters: any;

  @Output() startEdit = new EventEmitter<string>();
  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  @ViewChild('inputElementSBP', { static: false }) inputElementSBP: ElementRef;
  @ViewChild('inputElementDBP', { static: false }) inputElementDBP: ElementRef;

  range: Array<any> = [];
  normalRange: Array<any> = [];
  status: number = 2; //状态 2:正常  0:过低  1:过高 3:过低加过高
  SBPStatus: number = 2;
  DBPStatus: number = 2;
  measuresData: Array<any> = [];
  measuresSelectKeys: Array<any> = [];
  measuresVisible: boolean = false;
  hasReason: boolean = false;

  constructor(
    private vitalSignsService: VitalSignsService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.setInit();
    if (this.column.range) {
      this.setRange();
    }
    this.vitalSignsService.getChangeReason().subscribe((data) => {
      let id = this.column.id;
      if (
        data.index === this.i && data.id === id
        && !this.measuresVisible
      ) {
        this.hasReason = true;
        // bp时一个做代表就行了，只是为了打开护理措施弹框
        this.onBlur(id === 'bp' ? "SBP" : id, true);
      }
    });
  }

  setInit = () => {
    let _default = this.column.default,
      id = this.column.id,
      i = this.i;
    if (id !== "bp") {
      this.data[i][id] = !this.data[i][id] && _default
        ? _default : this.data[i][id];
      this.onBlur(id, false);
    } else {
      this.onBlur("SBP", false);
      this.onBlur("DBP", false);
    }
  }

  setRange() {
    let range = this.parameters[this.column.range];
    this.range = range ? range.split("-") : [];
    if (this.column.id === 'bp') {
      let norange_0 = this.parameters[this.column.normalRange[0]];
      let norange_1 = this.parameters[this.column.normalRange[1]];
      this.normalRange = [
        norange_0 ? norange_0.split("-") : [],
        norange_1 ? norange_1.split("-") : []
      ];
    } else {
      let normal = this.parameters[this.column.normalRange];
      this.normalRange = normal ? normal.split("-") : [];
    }
  }

  onChange(value, id) {
    if (this.data[this.i][`${id}Reason`]) {
      this.data[this.i][`${id}Reason`] = null;
      this.data[this.i][id] = '';
    } else if (!this.column.noNumber) { // 数字输入框，校验
      let element = 'inputElement';
      if (this.column.id === 'bp') element = `${element}${id}`;
      this.updateValue(value, id, element);
    } else {
      this.data[this.i][id] = value;
    }
  }

  updateValue(value, id, element) {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      if (this.num && this.num === 1) {
        value = value.toFixed(1);
      }
      this.data[this.i][id] = value;
    }
    this[element].nativeElement.value = this.data[this.i][id];
  }

  editTr(i) {
    if (i < this.data.length) this.startEdit.emit(i + 1);
  }

  // 失焦校验
  onBlur(id, flage) {
    if (!this.data[this.i][id]) return; // 空值直接退出
    const inputValue = this.data[this.i][id];
    const reason = this.data[this.i][this.column.id + 'Reason'];
    let element = 'inputElement';
    if (this.column.id === 'bp') element = `${element}${id}`;

    // 值为其他选项时，改变状态
    if (reason && /.*[\u4e00-\u9fa5]+.*$/.test(inputValue)) {
      const statusString = this.column.id !== 'bp' ? "status" : `${id}Status`;
      this[statusString] = 3;
      this.hasReason && this.inputHandleBlur(inputValue, id, 3);
      this.hasReason = false;
      return false;
    }

    if (this.range && this.range.length > 0) { // 可输入范围异常
      if (
        inputValue - 0 > this.range[1] - 0
        || inputValue - 0 < this.range[0] - 0
      ) {
        this.notification.error(
          '数值超出范围',
          `${this.column.sddName}可输入范围为${this.range[0]}-${this.range[1]}`,
          { nzDuration: 2000 }
        );
        // 恢复默认状态
        this[element].nativeElement.value = "";
        this.data[this.i][id] = "";
        this.status = 2;
        this.SBPStatus = 2;
        this.DBPStatus = 2;
        flage && this.inputHandleBlur('', id, this.status);
      } else if (
        id === "SBP"
        && (this.data[this.i].DBP - 0) > (inputValue - 0)
      ) {
        this[element].nativeElement.value = "";
        this.data[this.i][id] = "";
        this.SBPStatus = 2;
        if (this.data[this.i].DBP) {
          this.notification.error(
            '数值超出范围',
            `收缩压应大于舒张压`,
            { nzDuration: 2000 }
          );
        }
        flage && this.inputHandleBlur('', id, this.SBPStatus);
      } else if (
        id === "DBP"
        && (this.data[this.i].SBP - 0) < (inputValue - 0)
      ) {
        if (this.data[this.i].SBP) {
          this[element].nativeElement.value = "";
          this.data[this.i][id] = "";
          this.DBPStatus = 2;
          this.notification.error(
            '数值超出范围',
            `收缩压应大于舒张压`,
            { nzDuration: 2000 }
          );
          flage && this.inputHandleBlur('', id, this.DBPStatus);
        } else {
          flage && this.inputHandleBlur(inputValue, id, this.DBPStatus);
        }
      } else { // 正常输入框
        let _len = this.normalRange.length;
        if (id !== 'SBP' && id !== 'DBP' && this.normalRange && _len > 0) {
          // 正常范围异常
          if (inputValue - 0 > this.normalRange[1] - 0) { // 超出
            this.status = 1;
          } else if (inputValue - 0 < this.normalRange[0] - 0) { //低于
            this.status = 0;
          } else {
            this.status = 2;
          }
          flage && this.inputHandleBlur(inputValue, id, this.status);
        } else if (
          id === "SBP"
          && this.normalRange && _len > 0
          && this.normalRange[0] && this.normalRange[0].length > 0
        ) { //SBP正常范围异常
          if (inputValue - 0 > this.normalRange[0][1] - 0) { //超出
            this.SBPStatus = 1;
          } else if (inputValue - 0 < this.normalRange[0][0] - 0) {  //低于
            this.SBPStatus = 0;
          } else {
            this.SBPStatus = 2;
          }
          flage && this.inputHandleBlur(inputValue, id, this.SBPStatus);
        } else if (
          id === "DBP"
          && this.normalRange && _len > 0
          && this.normalRange[1] && this.normalRange[1].length > 0
        ) { //DBP正常范围异常
          if (inputValue - 0 > this.normalRange[1][1] - 0) { //超出
            this.DBPStatus = 1;
          } else if (inputValue - 0 < this.normalRange[1][0] - 0) {//低于
            this.DBPStatus = 0;
          } else {
            this.DBPStatus = 2;
          }
          flage && this.inputHandleBlur(inputValue, id, this.DBPStatus);
        }
      }
    } else {
      flage && this.inputHandleBlur(inputValue, id, this.status);
    }
  }

  //status 0:过低  1：过高  2：正常 3:过低加过高
  inputHandleBlur = (value, id, status) => {
    let index = this.i, item = this.column;
    let chooseRow = [...this.data];
    let chooseRowItem = chooseRow[index];
    const { measureViewType } = this.vitalSignsService.getColumnDataOther();
    if (!item.noNumber) {
      chooseRowItem[id + "Status"] = status;
      chooseRowItem[id] = value;

      if (
        chooseRowItem[id + "Status"]
        && chooseRowItem[id + "Status"] !== status
      ) {
        chooseRowItem[id + "keys"] = [];
        chooseRowItem[id + "measure"] = [];
      }

      if (
        !value && id === "SBP" && chooseRowItem["DBP"]
        && /.*[\u4e00-\u9fa5]+.*$/.test(chooseRowItem["DBP"])
      ) {
        chooseRowItem["DBP"] = "";
        chooseRowItem["bpReason"] = null;
      } else if (
        !value && id === "DBP" && chooseRowItem["SBP"]
        && /.*[\u4e00-\u9fa5]+.*$/.test(chooseRowItem["SBP"])
      ) {
        chooseRowItem["SBP"] = "";
        chooseRowItem["bpReason"] = null;
      }
      if (!(/.*[\u4e00-\u9fa5]+.*$/.test(value))) {
        chooseRowItem[`${id}Reason`] = null;
        // chooseRowItem[`${id}Type`] = null;
      }
      this.data = chooseRow;
      if (item.id === "bp") {//血压
        if (
          id === "SBP" && (status === 0 || status === 1)
          && measureViewType
        ) {//收缩压时
          this.getMeasureData(
            { ivdCode: id, type: status },
            id,
            chooseRowItem
          );
        } else if (id === "SBP" && value && status === 2 && measureViewType) {
          if (chooseRowItem["DBPStatus"] === 0 || chooseRowItem["DBPStatus"] === 1) {
            this.getMeasureData(
              { ivdCode: "DBP", type: chooseRowItem["DBPStatus"] },
              "DBP",
              chooseRowItem
            );
          }
        }
        if (status === 3 && measureViewType) {
          this.getMeasureData(
            { ivdCode: id, type: status },
            id,
            chooseRowItem
          );
        }
        if (
          id === "DBP" && (status === 0 || status === 1) && measureViewType
        ) {//舒张压时
          if (
            (!chooseRowItem["SBPStatus"] && chooseRowItem["SBPStatus"] !== 0)
            || chooseRowItem["SBPStatus"] === 2
          ) {
            this.getMeasureData(
              { ivdCode: "DBP", type: chooseRowItem["DBPStatus"] },
              "DBP",
              chooseRowItem
            );
          }
        }
      } else {//非血压
        if ((status === 0 || status === 1) && measureViewType) {
          //过低或过高时调护理措施
          this.getMeasureData(
            { ivdCode: item.sddCode, type: status },
            id,
            chooseRowItem
          );
        }
        if (status === 3 && measureViewType) {
          this.getMeasureData(
            { ivdCode: id, type: status },
            id,
            chooseRowItem
          );
        }
      }
    } else {
      chooseRowItem[id] = value;
      this.data = chooseRow;
    }
  }

  // 获取体征护理措施数据并打开弹窗
  getMeasureData(params, id, item) {
    this.vitalSignsService.getVitialMethod(params).subscribe((res: any) => {
      if (!res) return false;
      this.measuresVisible = true;
      this.measuresData = res.data;
      this.measuresSelectKeys = item[id + "keys"] || [];
    })
  }

  // 体征护理措施 图标点击事件
  measuresIconClick() {
    let item = this.column,
      row = this.data[this.i];
    if (item.id !== "bp" && item.id !== "remark") {
      const params = {
        ivdCode: item.sddCode,
        type: this.status
      };
      this.getMeasureData(params, item.id, row);
    } else if (item.id === "bp") {
      const status = {
        "SBP": this.SBPStatus,
        "DBP": this.DBPStatus
      };
      const firstStr = item.value[0];
      const twoStr = item.value[1];
      if (status[firstStr] === 0 || status[firstStr] === 1) {
        const params = {
          ivdCode: firstStr,
          type: status[firstStr]
        };
        this.getMeasureData(params, firstStr, row);
      } else {
        const params = {
          ivdCode: twoStr,
          type: status[twoStr]
        };
        this.getMeasureData(params, twoStr, row);
      }
    }
  }

  measuresHandleOk(params) {
    let type = this.column.id;
    let chooseRow = this.data[this.i];
    chooseRow[type + "keys"] = params.selectKeys;
    chooseRow[type + "measure"] = params.selectValue;
    this.measuresHandleCancel();
  }

  measuresHandleCancel() {
    this.measuresVisible = false;
    this.measuresData = [];
    this.measuresSelectKeys = [];
  }
}
