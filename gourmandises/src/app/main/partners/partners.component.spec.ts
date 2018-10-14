import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersComponent } from './partners.component';
import { TestsModule } from 'src/app/tests/tests.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PartnersComponent', () => {
  let component: PartnersComponent;
  let fixture: ComponentFixture<PartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartnersComponent],
      imports: [TestsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
