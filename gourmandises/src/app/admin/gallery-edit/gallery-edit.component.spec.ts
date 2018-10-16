import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryEditComponent } from './gallery-edit.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('GalleryEditComponent', () => {
  let component: GalleryEditComponent;
  let fixture: ComponentFixture<GalleryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryEditComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
