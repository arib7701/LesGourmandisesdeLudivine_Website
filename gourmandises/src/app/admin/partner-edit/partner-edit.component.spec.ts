import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerEditComponent } from './partner-edit.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('PartnerEditComponent', () => {
  let component: PartnerEditComponent;
  let fixture: ComponentFixture<PartnerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerEditComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
