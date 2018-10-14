import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEditComponent } from './real-edit.component';

describe('RealEditComponent', () => {
  let component: RealEditComponent;
  let fixture: ComponentFixture<RealEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
