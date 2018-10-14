import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeHomeComponent } from './recipe-home.component';
import { TestsModule } from 'src/app/tests/tests.module';

describe('RecipeHomeComponent', () => {
  let component: RecipeHomeComponent;
  let fixture: ComponentFixture<RecipeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeHomeComponent],
      imports: [TestsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
