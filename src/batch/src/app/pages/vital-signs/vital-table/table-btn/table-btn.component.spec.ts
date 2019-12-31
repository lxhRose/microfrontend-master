import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBtnComponent } from './table-btn.component';

describe('TableBtnComponent', () => {
  let component: TableBtnComponent;
  let fixture: ComponentFixture<TableBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
