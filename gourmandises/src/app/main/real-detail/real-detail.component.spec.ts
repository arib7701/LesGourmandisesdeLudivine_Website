import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealDetailComponent } from './real-detail.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('RealDetailComponent', () => {
  let component: RealDetailComponent;
  let fixture: ComponentFixture<RealDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RealDetailComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
