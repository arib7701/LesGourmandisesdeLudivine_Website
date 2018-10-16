import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuCreateComponent } from './actu-create.component';

describe('ActuCreateComponent', () => {
  let component: ActuCreateComponent;
  let fixture: ComponentFixture<ActuCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActuCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActuCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
