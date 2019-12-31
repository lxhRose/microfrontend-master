import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDateRangeComponent } from './table-date-range.component';

describe('TableDateRangeComponent', () => {
  let component: TableDateRangeComponent;
  let fixture: ComponentFixture<TableDateRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDateRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
