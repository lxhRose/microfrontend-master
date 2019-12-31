import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { VitalSignsService } from "../../vital-signs.service";
import * as moment from "moment";
import { getParams } from "../../../../utils/getParams";
import { TableData } from "./../../interface";
import { AppService } from "./../../../../app.service";

@Component({
  selector: 'batch-choose-modal',
  templateUrl: './choose-modal.component.html',
  styleUrls: ['./choose-modal.component.less']
})
export class ChooseModalComponent implements OnInit {
  @Input() reviewTimePoint: string;
  @Input() reviewTime: string;
  @Input() chooseRow: Array<TableData>;
  @Output() selcetedData = new EventEmitter<any>();

  isVisible: boolean = false;
  lCheckAll: boolean = false;
  rCheckAll: boolean = false;
  serchValue: string;
  radioValue = 0;
  listOfAllData: TableData[] = [];
  leftData: TableData[] = [];
  rightData: TableData[] = [];
  leftIsIndeterminate = false;
  rightIsIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  leftTableDom = null;
  RightTableDom = null;
  tableLoding: boolean = false;

  constructor(
    private vitalSignsService: VitalSignsService,
    private appService: AppService,
  ) { }

  ngOnInit() {
    this.initChecked();
  }

  initChecked() {
    this.chooseRow.map((item) => {
      this.mapOfCheckedId[item.visitno] = true;
    });
    this.refreshStatus(this.leftData, 1);
    this.refreshStatus(this.rightData, 2);
  }

  showModal(): void {
    this.isVisible = true;
    this.getData();
    this.tableScrollInit();
  }

  getData(): void {
    this.clearChecked();
    this.tableLoding = true;
    this.vitalSignsService.getPatientList({
      wardId: getParams('bingquId'), // bingquId
      reviewTimePoint: this.reviewTimePoint,
      reviewTime: moment(this.reviewTime).format("YYYY-MM-DD"),
      inHospitalStatus: 0,
      status: this.radioValue
    }).subscribe((res: any) => {
      this.tableLoding = false;
      if (res.code === 'SUCCESS') {
        this.listOfAllData = (res.data ? res.data : [])
          .sort((a, b) => { return a.sort - b.sort });
        let len = this.listOfAllData.length / 2;
        this.leftData = this.listOfAllData.slice(0, len);
        this.rightData = this.listOfAllData.slice(len);
        this.initChecked();
      }
    }, () => {
      this.tableLoding = false;
    });
  }

  // 获取两个table滚动元素
  tableScrollInit() {
    let timer = null;
    timer = setInterval(() => {
      if (!this.leftTableDom || !this.RightTableDom) {
        this.leftTableDom = document.getElementById("vital-left-table")
          .getElementsByClassName("ant-table-body")[0];
        this.RightTableDom = document.getElementById("vital-right-table")
          .getElementsByClassName("ant-table-body")[0];
        this.tableAddListen(timer);
      } else {
        this.tableAddListen(timer);
      }
    }, 20);
  }

  // 监听table的scroll事件
  tableAddListen(timer) {
    this.leftTableDom.addEventListener('scroll', this.listenLeftScroll);
    this.RightTableDom.addEventListener('scroll', this.listenRightScroll);
    clearInterval(timer);
  }

  listenLeftScroll = (e) => {
    // console.log(1)
    if (e.currentTarget) {
      this.RightTableDom.scrollTop = this.leftTableDom.scrollTop
    }
  }

  listenRightScroll = (e) => {
    if (e.currentTarget) {
      this.leftTableDom.scrollTop = this.RightTableDom.scrollTop
    }
  }

  // 鼠标进入左边表格时，移除右边表格的scroll监听事件；右边同理。
  tableMouseOver(type) {
    if (type === 'left') {
      this.RightTableDom.removeEventListener('scroll', this.listenRightScroll);
    } else if (type === 'right') {
      this.leftTableDom.removeEventListener('scroll', this.listenLeftScroll);
    }
  }

  // 鼠标离开时，恢复监听。
  tableMouseOut(type) {
    if (type === 'left') {
      this.RightTableDom.addEventListener('scroll', this.listenRightScroll);
    } else if (type === 'right') {
      this.leftTableDom.addEventListener('scroll', this.listenLeftScroll);
    }
  }

  handleOk(): void {
    this.isVisible = false;
    this.appService.toogleLoding(true);
    setTimeout(() => {
      let selectedData = this.listOfAllData.filter((item) => this.mapOfCheckedId[item.visitno]);
      this.selcetedData.emit(selectedData);
      this.appService.toogleLoding(false);
    }, 20);
  }

  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.isVisible = false;

  }

  leftCheckAll(value: boolean): void {
    this.leftData.map(item => {
      this.mapOfCheckedId[item.visitno] = value
    });
    // console.log(this.mapOfCheckedId);
    this.refreshStatus(this.leftData, 1);
  }

  rightCheckAll(value: boolean): void {
    this.rightData.map(item => {
      this.mapOfCheckedId[item.visitno] = value
    });
    this.refreshStatus(this.rightData, 2);
  }

  refreshStatus(data, type: number): void {
    let numberOfChecked = [...data].filter(item => this.mapOfCheckedId[item.visitno]).length;
    let len = data.length;
    let isIndeterminate = numberOfChecked > 0
      && numberOfChecked < len;
    let checkAll = numberOfChecked > 0 && numberOfChecked === len;
    if (type === 1) {
      this.leftIsIndeterminate = isIndeterminate;
      this.lCheckAll = checkAll;
    } else {
      this.rightIsIndeterminate = isIndeterminate;
      this.rCheckAll = checkAll;
    }
  }

  rowClick(visitno) {
    this.mapOfCheckedId[visitno] = !this.mapOfCheckedId[visitno];
    this.refreshStatus(this.leftData, 1);
    this.refreshStatus(this.rightData, 2);
    // console.log(visitno)
  }

  search() {
    if (this.serchValue) {
      this.rightData = this.filterData(this.rightData);
      this.leftData = this.filterData(this.leftData);
    } else {
      let len = this.listOfAllData.length / 2;
      this.leftData = this.listOfAllData.slice(0, len);
      this.rightData = this.listOfAllData.slice(len);
    }
    this.clearChecked();
  }

  // 清空选中状态
  clearChecked() {
    this.mapOfCheckedId = {};
    this.lCheckAll = false;
    this.rCheckAll = false;
    this.leftIsIndeterminate = false;
    this.rightIsIndeterminate = false;
  }

  filterData(data) {
    return data.filter((item) =>
      item.bedno && item.bedno.indexOf(this.serchValue) > -1
      || item.ptname && item.ptname.indexOf(this.serchValue) > -1
      || item.chartno && item.chartno.indexOf(this.serchValue) > -1);
  }
}
