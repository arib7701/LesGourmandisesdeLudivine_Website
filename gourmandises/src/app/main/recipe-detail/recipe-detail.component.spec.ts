import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetailComponent } from './recipe-detail.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeDetailComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
