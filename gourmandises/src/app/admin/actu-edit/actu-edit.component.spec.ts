import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuEditComponent } from './actu-edit.component';

describe('ActuEditComponent', () => {
  let component: ActuEditComponent;
  let fixture: ComponentFixture<ActuEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActuEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
