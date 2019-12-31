import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { TableOption, TableData, Column } from "../interface";
import { VitalSignsService } from "./../vital-signs.service";
import DirectionKey from "./../../../utils/directionKey";

@Component({
  selector: 'vital-table',
  templateUrl: './vital-table.component.html',
  styleUrls: ['./vital-table.component.less']
})
export class VitalTableComponent implements OnChanges, OnInit, AfterViewChecked, OnDestroy {
  @Input() option: TableOption;
  @Input() headerDate: string;
  @Input() chooseRow: Array<TableData>;
  @ViewChild('fixedTable', { static: false }) fixedTable: ElementRef;

  inputList: any[] = [];
  commonColumns: Array<Column>;
  columns: Array<Column> = [];
  settings;
  editCache: { [key: number]: { edit: boolean; data: any } } = {};
  needFocus: boolean = false;

  constructor(
    private vitalSignsService: VitalSignsService,
  ) { }

  ngOnChanges() {
    this.updateEditCache();
    this.needFocus = true; // 数据改变了，允许重新获得焦点
  }

  ngOnInit() {
    this.creatTableHeadData();
    DirectionKey.domName = 'inp-vital-entry';
    window.addEventListener('keydown', this.onkeydown);
    window.addEventListener('click', this.removeFocus);
  }

  ngAfterViewChecked() {
    DirectionKey.inputList = Array.prototype.slice.call(
      document.getElementById('inp-vital-entry')
        .querySelectorAll(".inp-vital-input-container")
    );
    if (this.needFocus) DirectionKey.initFocus();
  }

  ngOnDestroy() {
    window.removeEventListener('click', this.removeFocus);
    window.removeEventListener('keydown', this.onkeydown);
  }

  removeFocus = () => {
    if (this.needFocus) DirectionKey.removeFocus();
    this.needFocus = false;
  }

  onkeydown = (event) => {
    DirectionKey.onkeydown(event);
    this.needFocus = false;
  }

  creatTableHeadData() {
    this.settings = this.option.settings;
    DirectionKey.settings = this.settings;
    const inputWidth = this.settings.xScroll ? "auto" : "180px";
    const baseArr = [{
      id: "bedno",
      sddName: "床号",
      type: "text",
      width: "60px",
      left: "0",
    }, {
      id: "ptname",
      sddName: "姓名",
      type: "text",
      width: "60px",
      left: "60px",
    }, {
      id: "chartno",
      sddName: "病历号",
      type: "text",
      width: "80px",
      left: "120px",
      align: "center",
    }, {
      id: "reason",
      sddName: "筛选原因",
      type: "text",
      width: "100px",
      left: "200px",
      align: "center",
    }]
    this.commonColumns = this.settings.allNoHuji
      ? baseArr
      : [
        ...baseArr,
        {
          id: "isTpr",
          childrenId: "Tpr",
          sddName: "T",
          type: "checkbox",
          width: "35px",
          left: "300px",
          align: "center",
        }, {
          id: "writeCareSheet",
          childrenId: "Huji",
          sddName: "护",
          type: "checkbox",
          width: "35px",
          left: "335px",
          align: "center",
        }];
    this.columns = this.commonColumns.concat(
      this.settings.inputColumns.map(item => {
        return {
          ...item,
          left: null,
          align: "center",
          width: item.width
            ? item.width
            : item.id !== "bp"
              ? "80px"
              : inputWidth,
          type: item.type ? item.type : "input"
        }
      })
    );
    this.vitalSignsService.getColumnData().subscribe((columnData) => {
      // console.log(columnData);
      this.columns.map((item) => {
        if (item.data) item.data = columnData[item.data];
      });
    })
  }

  updateEditCache(): void {
    this.chooseRow.forEach((data, i) => {
      this.editCache[i] = {
        edit: i < 2 ? true : false,
        data: { ...data }
      };
    });
  }

  startEdit(i: number): void {
    this.editCache[i].edit = true;
  }
}
