import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyHomeComponent } from './buy-home.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('BuyHomeComponent', () => {
  let component: BuyHomeComponent;
  let fixture: ComponentFixture<BuyHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyHomeComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
