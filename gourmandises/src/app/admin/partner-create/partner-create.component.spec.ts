import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCreateComponent } from './partner-create.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('PartnerCreateComponent', () => {
  let component: PartnerCreateComponent;
  let fixture: ComponentFixture<PartnerCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerCreateComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
