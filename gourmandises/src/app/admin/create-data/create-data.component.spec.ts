import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDataComponent } from './create-data.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateDataComponent', () => {
  let component: CreateDataComponent;
  let fixture: ComponentFixture<CreateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDataComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
