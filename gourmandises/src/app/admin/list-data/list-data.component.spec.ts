import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDataComponent } from './list-data.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListDataComponent', () => {
  let component: ListDataComponent;
  let fixture: ComponentFixture<ListDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListDataComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
