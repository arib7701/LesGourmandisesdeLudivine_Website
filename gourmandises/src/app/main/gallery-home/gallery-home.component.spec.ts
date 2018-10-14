import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryHomeComponent } from './gallery-home.component';
import { TestsModule } from 'src/app/tests/tests.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GalleryHomeComponent', () => {
  let component: GalleryHomeComponent;
  let fixture: ComponentFixture<GalleryHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryHomeComponent],
      imports: [TestsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
