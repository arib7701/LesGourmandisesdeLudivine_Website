import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEditComponent } from './real-edit.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('RealEditComponent', () => {
  let component: RealEditComponent;
  let fixture: ComponentFixture<RealEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RealEditComponent],
      imports: [TestsModule]
    }).compileComponents();
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
