import { Component, OnInit, Input } from '@angular/core';
import * as moment from "moment";

@Component({
  selector: 'batch-table-date-range',
  templateUrl: './table-date-range.component.html',
  styleUrls: ['./table-date-range.component.less']
})
export class TableDateRangeComponent implements OnInit {
  @Input() data: any[];
  @Input() i: number;
  @Input() id: string;

  dateRange = [];

  constructor() { }

  ngOnInit() {
    let _dateRange = this.data[this.i][this.id];
    if (_dateRange && _dateRange.length > 0) {
      this.dateRange = [
        _dateRange[0] ? moment(_dateRange[0]).format("YYYY-MM-DD") : null,
        _dateRange[1] ? moment(_dateRange[1]).format("YYYY-MM-DD") : null
      ];
    }
  }

  onChange(result: Date): void {
    this.data[this.i][this.id] = [
      moment(result[0]).format("YYYY-MM-DD"),
      moment(result[1]).format("YYYY-MM-DD")
    ];
  }

}
