import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { Subscription } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscriptionRecipe: Subscription;

  constructor(private recipeService: RecipeService) {
    this.subscriptionRecipe = this.recipeService
      .getAllRecipes()
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(recipes => {
        this.recipes = [];
        recipes.forEach(element => {
          this.recipes.push(element as Recipe);
        });
        this.recipes.reverse();
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptionRecipe.unsubscribe();
  }
}
