import {
  Component, Input, Output, EventEmitter, OnInit
} from '@angular/core';
import { TableData, Select } from "../../interface";
import { VitalSignsService } from "./../../vital-signs.service";

@Component({
  selector: 'table-checkbox',
  templateUrl: './table-checkbox.component.html',
  styleUrls: ['./table-checkbox.component.less']
})
export class TableCheckboxComponent implements OnInit {
  @Input() data: TableData[];
  @Input() i: number;
  @Input() id: string;
  @Input() settings: any;
  @Input() childrenId: string;
  indeterminate: boolean = false;
  select: Select = {
    timeObj: [],
    headerTime: ''
  };

  constructor(private vitalSignsService: VitalSignsService) { }

  ngOnInit() {
    this.select = this.vitalSignsService.getSelect();
    if (this.id === 'isTpr' && this.settings.isAllTpr) {
      this.onCheckChange(true, true);
    }
    this.rowCheckIndeterminate(this.i, true);
    this.vitalSignsService.getChangeRowCheckbox().subscribe((index) => {
      if (index === this.i) this.rowCheckIndeterminate(index, false);
    });
    this.vitalSignsService.getRowCheckboxChecked().subscribe((obj) => {
      const { id, value } = obj;
      if (id === this.id) {
        this.onCheckChange(value, false);
      }
    })
  }

  rowCheckIndeterminate = (index, isInit) => { //一行样式状态
    let chooseRow = [...this.data];
    const chooseRowObj = chooseRow[index];
    const hasHujiList = this.settings.inputColumns
      .filter(item => !item.noOther && this.settings.settingCode[item.id]
        && !this.settings.settingCode[item.id][`no${this.childrenId}`]);
    const hujiList = this.settings.inputColumns.filter(item => {
      return chooseRowObj[`${item.id}${this.childrenId}`];
    });
    if (hujiList.length > 0 && hujiList.length < hasHujiList.length) {
      if (chooseRowObj[this.id]) {
        this.data[index][this.id] = false;
        this.changeAll(isInit);
      }
      this.indeterminate = true;
    } else if (hujiList.length === hasHujiList.length) {
      if (!chooseRowObj[this.id]) {
        this.data[index][this.id] = true;
        this.changeAll(isInit);
      }
      this.indeterminate = false;
    } else if (hujiList.length === 0) {
      if (chooseRowObj[this.id]) {
        this.data[index][this.id] = false;
        this.changeAll(isInit);
      }
      this.indeterminate = false;
    }
  }

  // 外部全选样式
  changeAll(isInit) {
    if (isInit) { // 避免初始化时报错ExpressionChangedAfterItHasBeenCheckedError
      if (this.i !== this.data.length - 1) {
        return;
      } else {
        setTimeout(() => {
          this._changeAll();
        }, 0);
      }
    } else {
      this._changeAll();
    }
  }

  _changeAll() {
    let _checkedLength = this.data.filter((item) => item[this.id]).length;
    let _len = this.data.length;
    this.vitalSignsService.setCheckBoxChange({
      type: this.id,
      indeterminate: !!_checkedLength && _checkedLength < _len,
      checkAll: _checkedLength > 0 && _checkedLength === _len
    });
  }

  // 行checkbox change事件
  onCheckChange(value: boolean, isInit: boolean): void {
    this.indeterminate = false;
    let row = this.data[this.i];
    this.settings.inputColumns.map(item => {
      if (
        !item.noOther && this.settings.settingCode[item.id]
        && !this.settings.settingCode[item.id][`no${this.childrenId}`]
      ) {
        row[`${item.id}${this.childrenId}`] = value;

        if (this.id === 'isTpr') {
          if (!row[`${item.id}TimePoint`] && value) {
            row[`${item.id}TimePoint`] = this.select.headerTime;
          } else if (row[`${item.id}TimePoint`] && !value) {
            row[`${item.id}TimePoint`] = null;
          }
        }
      }
    })
    this.changeAll(isInit);
  }
}
