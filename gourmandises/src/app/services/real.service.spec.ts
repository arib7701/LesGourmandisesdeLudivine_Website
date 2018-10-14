import { TestBed, inject } from '@angular/core/testing';

import { RealService } from './real.service';
import { TestsModule } from '../tests/tests.module';

describe('RealService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealService],
      imports: [TestsModule]
    });
  });

  it('should be created', inject([RealService], (service: RealService) => {
    expect(service).toBeTruthy();
  }));
});
