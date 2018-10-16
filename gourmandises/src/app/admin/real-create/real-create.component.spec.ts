import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealCreateComponent } from './real-create.component';

describe('RealCreateComponent', () => {
  let component: RealCreateComponent;
  let fixture: ComponentFixture<RealCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
