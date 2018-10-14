import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { Subscription } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: string;
  subscriptionRecipe: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.subscriptionRecipe = this.recipeService
      .getRecipeById(this.id)
      .valueChanges()
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptionRecipe.unsubscribe();
  }
}
