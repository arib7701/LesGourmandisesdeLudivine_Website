import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { Subscription } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-home',
  templateUrl: './recipe-home.component.html',
  styleUrls: ['./recipe-home.component.css']
})
export class RecipeHomeComponent implements OnInit, OnDestroy {
  newRecipe: Recipe;
  subscriptionNew: Subscription;

  constructor(public recipeService: RecipeService) {
    this.subscriptionNew = this.recipeService
      .getNewRecipe()
      .valueChanges()
      .subscribe(newrecipe => {
        this.newRecipe = newrecipe[0] as Recipe;
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscriptionNew !== undefined) {
      this.subscriptionNew.unsubscribe();
    }
  }
}
