import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalHeaderComponent } from './vital-header.component';

describe('VitalHeaderComponent', () => {
  let component: VitalHeaderComponent;
  let fixture: ComponentFixture<VitalHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VitalHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
