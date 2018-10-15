import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealListComponent } from './real-list.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('RealListComponent', () => {
  let component: RealListComponent;
  let fixture: ComponentFixture<RealListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RealListComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
