import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealComponent } from './real.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('RealComponent', () => {
  let component: RealComponent;
  let fixture: ComponentFixture<RealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RealComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
