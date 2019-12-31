import { Component, OnInit, Input } from '@angular/core';
import { TableData, Column } from "../../interface";

@Component({
  selector: 'table-select',
  templateUrl: './table-select.component.html',
  styleUrls: ['./table-select.component.less']
})
export class TableSelectComponent implements OnInit {
  @Input() data: TableData[];
  @Input() i: number;
  @Input() column: Column;
  @Input() isText: boolean = false;

  showText: string = '';

  constructor() { }

  ngOnInit() {
    if (this.isText) {
      let _item = this.column.data.find(item =>
        item.sddCode === this.data[this.i][this.column.id]
      );
      this.showText = _item ? _item.sddName : '';
    }
  }

  onChange(value, id) {
    let RowItem = this.data[this.i];
    if (id === "faecesType" && value !== "enemas" && RowItem["faeces1"]) {
      RowItem["faeces1"] = "";
    }
  }
}
