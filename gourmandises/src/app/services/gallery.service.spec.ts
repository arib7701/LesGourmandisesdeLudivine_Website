import { TestBed, inject } from '@angular/core/testing';

import { GalleryService } from './gallery.service';
import { TestsModule } from '../tests/tests.module';

describe('GalleryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GalleryService],
      imports: [TestsModule]
    });
  });

  it('should be created', inject(
    [GalleryService],
    (service: GalleryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
