import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuHomeComponent } from './actu-home.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('ActuHomeComponent', () => {
  let component: ActuHomeComponent;
  let fixture: ComponentFixture<ActuHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActuHomeComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActuHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
