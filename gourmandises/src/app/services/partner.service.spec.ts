import { TestBed, inject } from '@angular/core/testing';

import { PartnerService } from './partner.service';
import { TestsModule } from '../tests/tests.module';

describe('PartnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartnerService],
      imports: [TestsModule]
    });
  });

  it('should be created', inject(
    [PartnerService],
    (service: PartnerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
