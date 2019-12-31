import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CheckBox, Select } from "./interface";
import { HttpClient } from '@angular/common/http';
import { AppService } from "./../../app.service";

@Injectable({
  providedIn: 'root'
})
export class VitalSignsService {
  private initColumnData = new Subject<any>();
  private checkBoxChange = new Subject<any>();
  private initTimeSelect = new Subject<any>();
  private changeRowCheckbox = new Subject<any>();
  private painCallback = new Subject<any>();
  private changeReason = new Subject<any>();
  private rowCheckboxChecked = new Subject<any>();
  private columnData;
  private select: Select;
  private parentWindow;
  baseUrl = 'inpnurse/v1/vitalsign/';

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) { }

  // 获取病区所有病人信息
  getPatientList(params) {
    this.appService.setNoLoading(true);
    return this.http.get(`${this.baseUrl}patientList`, { params });
  }

  // 获取生命体征护理措施
  getVitialMethod(params) {
    // this.appService.setNoLoading(true);
    return this.http.put(`${this.baseUrl}measures`, params);
  }

  //menus评分
  getMews(params) {
    return this.http.post(`inpnurse/v1/geriatricHospital/mews`, params);
  }

  //批量增加生命,没有护记 version=v3,有version=v1
  setVitalsignBulk(params, version) {
    return this.http.post(`inpnurse/${version}/vitalsign/bulk`, params);
  }

  //获取批量生命
  vitalsignBulkList(params, version) {
    return this.http.get(`inpnurse/${version}/vitalsign/bulkList`, { params });
  }

  //取消保存删除暂存数据,并恢复旧数据(用于生命体征和护理记录单)
  batchDeleteState(params) {
    return this.http.delete(
      `inpnurse/v1/inpAssessment/batchDeleteState`,
      { params }
    );
  }

  // 表头时间select数据和初始值
  setInitTimeSelect(select: Select) {
    this.select = { ...select };
    this.initTimeSelect.next({ ...select });
  }
  getInitTimeSelect(): Observable<any> {
    return this.initTimeSelect.asObservable();
  }
  getSelect(): Select {
    return this.select;
  }

  // 表格中的复选框和头部复选框状态联动
  setCheckBoxChange(obj: CheckBox) {
    this.checkBoxChange.next(obj);
  }
  getCheckBoxChange(): Observable<any> {
    return this.checkBoxChange.asObservable();
  }

  setColumnData(columnData) {
    this.columnData = { ...columnData };
    this.initColumnData.next({ ...columnData });
  }
  getColumnData(): Observable<any> {
    return this.initColumnData.asObservable();
  }
  getColumnDataOther() {
    return this.columnData;
  }

  // other-select中的复选框和table-checkbox中的复选框联动
  setChangeRowCheckbox(index: number) {
    this.changeRowCheckbox.next(index);
  }
  getChangeRowCheckbox(): Observable<any> {
    return this.changeRowCheckbox.asObservable();
  }

  // table-header中的复选框和table-checkbox中的复选框联动
  setRowCheckboxChecked(id: string, value: boolean) {
    this.rowCheckboxChecked.next({ id, value });
  }
  getRowCheckboxChecked(): Observable<any> {
    return this.rowCheckboxChecked.asObservable();
  }

  // postMessage必须的iframe父级对象存取
  saveParentWindow(obj) {
    this.parentWindow = obj;
  }
  getParentWindow() {
    return this.parentWindow;
  }

  // 疼痛评分返回
  setPainCallback(obj) {
    this.painCallback.next(obj);
  }
  getPainCallback(): Observable<any> {
    return this.painCallback.asObservable();
  }

  // 未测原因
  setChangeReason(index, id) {
    this.changeReason.next({ index, id });
  }
  getChangeReason(): Observable<any> {
    return this.changeReason.asObservable();
  }
}
