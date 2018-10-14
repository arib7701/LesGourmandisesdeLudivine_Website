import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryDetailComponent } from './gallery-detail.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('GalleryDetailComponent', () => {
  let component: GalleryDetailComponent;
  let fixture: ComponentFixture<GalleryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryDetailComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
