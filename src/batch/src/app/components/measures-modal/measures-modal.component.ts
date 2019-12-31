import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'batch-measures-modal',
  templateUrl: './measures-modal.component.html',
  styleUrls: ['./measures-modal.component.less']
})
export class MeasuresModalComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() data: Array<any>;
  @Input() selectKeys: Array<any>;
  @Input() isVisible: boolean = false;
  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  @Output() iconClick = new EventEmitter<any>();

  isCheckAll: boolean = false;
  isIndeterminate: boolean = false;
  selectedRowKeys: { [key: string]: boolean } = {};
  selectedRows;

  constructor() { }

  ngOnChanges() {
    if (this.isVisible) {
      this.setInit();
    }
  }

  ngOnInit() {
  }

  setInit = () => {
    this.selectKeys.map((item) => {
      this.selectedRowKeys[item] = true;
    });
  }

  showModal() {
    this.iconClick.emit();
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleOk() {
    this.selectedRows = this.data
      .filter(item => this.selectedRowKeys[item.id]);
    const selectKeys = this.selectedRows.map(item => item.id);
    const selectValue = this.selectedRows.map(item => item.name);
    let params = {
      selectKeys,
      selectValue,
    };
    this.onOk.emit(params);
  }

  rowClick(id) {
    this.selectedRowKeys[id] = !this.selectedRowKeys[id];
    this.refreshStatus();
  }

  refreshStatus(): void {
    let numberOfChecked = this.data.filter(item => this.selectedRowKeys[item.id]).length;
    let len = this.data.length;
    this.isIndeterminate = numberOfChecked > 0
      && numberOfChecked < len;
    this.isCheckAll = numberOfChecked === len;
  }

  checkAll(value) {
    this.isIndeterminate = false;
    this.data.map((item) => {
      this.selectedRowKeys[item.id] = value;
    });
  }
}
