import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuresModalComponent } from './measures-modal.component';

describe('MeasuresModalComponent', () => {
  let component: MeasuresModalComponent;
  let fixture: ComponentFixture<MeasuresModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasuresModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasuresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
