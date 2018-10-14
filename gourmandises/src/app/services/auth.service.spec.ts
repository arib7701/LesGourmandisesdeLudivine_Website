import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TestsModule } from '../tests/tests.module';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [TestsModule]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
