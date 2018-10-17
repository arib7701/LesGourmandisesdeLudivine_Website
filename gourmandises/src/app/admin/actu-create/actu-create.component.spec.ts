import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuCreateComponent } from './actu-create.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('ActuCreateComponent', () => {
  let component: ActuCreateComponent;
  let fixture: ComponentFixture<ActuCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActuCreateComponent],
      imports: [TestsModule]
    }).compileComponents();
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
