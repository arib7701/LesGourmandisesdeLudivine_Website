import { TestBed, inject } from '@angular/core/testing';

import { RecipeService } from './recipe.service';
import { TestsModule } from '../tests/tests.module';

describe('RecipeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeService],
      imports: [TestsModule]
    });
  });

  it('should be created', inject([RecipeService], (service: RecipeService) => {
    expect(service).toBeTruthy();
  }));
});
