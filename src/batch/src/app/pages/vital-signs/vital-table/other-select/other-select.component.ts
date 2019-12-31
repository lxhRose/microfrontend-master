import { Component, OnInit, Input } from '@angular/core';
import { vitalSettings } from "./../../../../utils/hospitalSettings/vitalSettings";
import { getParams } from "./../../../../utils/getParams";
import { VitalSignsService } from "./../../vital-signs.service";
import { TableData, Select } from "./../../interface";

@Component({
  selector: 'batch-other-select',
  templateUrl: './other-select.component.html',
  styleUrls: ['./other-select.component.less']
})
export class OtherSelectComponent implements OnInit {
  @Input() index: number;
  @Input() id: string;
  @Input() data: TableData[];
  isVisible: boolean = false;
  settings;
  unableCauseList;
  ColumnData;
  select: Select = {
    timeObj: [],
    headerTime: ''
  };
  reasonSelect: string = null; // 之所以设置为null，是为了正常显示nzPlaceHolder
  typeSelect: string = null;
  hujiCheck: boolean = false;
  tprCheck: boolean = false;
  timePointSelect: string = null;

  constructor(private vitalSignsService: VitalSignsService) { }

  ngOnInit() {
    this.settings = vitalSettings(getParams('hi_Id'));
    // console.log(this.settings.settingCode[this.id])
    this.ColumnData = this.vitalSignsService.getColumnDataOther();
    this.select = this.vitalSignsService.getSelect();
    this.unableCauseList = this.ColumnData
      ? this.ColumnData.unableCauseList
      : [];
  }

  showModal() {
    this.isVisible = true;
    // if (this.index < 0) return false;
    let row = this.data[this.index];
    if (row[`${this.id}Reason`]) {
      this.reasonSelect = row[`${this.id}Reason`];
    }
    if (row[`${this.id}Type`]) {
      this.typeSelect = row[`${this.id}Type`];
    }
    if (row[`${this.id}Huji`]) {
      this.hujiCheck = row[`${this.id}Huji`]
    }
    if (row[`${this.id}Tpr`]) {
      this.tprCheck = row[`${this.id}Tpr`];
      this.timePointSelect = row[`${this.id}TimePoint`];
    } else {
      this.timePointSelect = this.select.headerTime;
    }
  }

  handleOk() {
    let chooseRow = [...this.data],
      index = this.index,
      id = this.id,
      reasonSelect = this.reasonSelect,
      chooseRowI = chooseRow[index];
    chooseRowI[`${id}Huji`] = this.hujiCheck;
    chooseRowI[`${id}Tpr`] = this.tprCheck;
    // chooseRowI[`${id}IsRefresh`] = true;
    chooseRowI[`${id}TimePoint`] = this.timePointSelect;
    if (reasonSelect) {
      chooseRowI[`${id}Reason`] = reasonSelect;
      const rowObj = this.unableCauseList.find(item => item.sddCode === reasonSelect);
      if (rowObj.sddName) {
        if (id !== "bp") {
          chooseRowI[id] = rowObj.sddName
        } else {
          chooseRowI["SBP"] = rowObj.sddName
          chooseRowI["DBP"] = rowObj.sddName
        }
      }
    } else if (
      chooseRowI[`${id}Reason`] && chooseRowI[id] && id !== "bp"
    ) {
      chooseRowI[id] = "";
      chooseRowI[`${id}Reason`] = null;
    } else if (
      chooseRowI[`${id}Reason`] && chooseRowI["SBP"]
      && chooseRowI["DBP"] && id === "bp"
    ) {
      chooseRowI["SBP"] = "";
      chooseRowI["DBP"] = "";
      chooseRowI[`${id}Reason`] = null;
    }

    this.data[index] = chooseRowI;
    this.vitalSignsService.setChangeRowCheckbox(index);
    this.clearStatus();
    this.vitalSignsService.setChangeReason(index, id);
  }

  handleCancel() {
    this.clearStatus();
  }

  clearStatus() {
    this.isVisible = false;
    this.reasonSelect = null;
    this.typeSelect = null;
    this.hujiCheck = false;
    this.tprCheck = false;
    this.timePointSelect = null;
  }
}
