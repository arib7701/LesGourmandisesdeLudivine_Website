import { TestBed, inject } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { TestsModule } from '../tests/tests.module';

describe('CategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryService],
      imports: [TestsModule]
    });
  });

  it('should be created', inject(
    [CategoryService],
    (service: CategoryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
