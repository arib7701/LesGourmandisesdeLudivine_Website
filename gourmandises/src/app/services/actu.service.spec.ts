import { TestBed, inject } from '@angular/core/testing';

import { ActuService } from './actu.service';
import { TestsModule } from '../tests/tests.module';

describe('ActuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActuService],
      imports: [TestsModule]
    });
  });

  it('should be created', inject([ActuService], (service: ActuService) => {
    expect(service).toBeTruthy();
  }));
});
