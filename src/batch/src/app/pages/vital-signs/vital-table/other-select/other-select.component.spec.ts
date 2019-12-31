import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSelectComponent } from './other-select.component';

describe('OtherSelectComponent', () => {
  let component: OtherSelectComponent;
  let fixture: ComponentFixture<OtherSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
