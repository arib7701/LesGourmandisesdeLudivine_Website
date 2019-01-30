import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { Subscription } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

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
        this.recipes.sort(this.sortByDate);
      });
  }

  sortByDate(a: Recipe, b: Recipe): number {
    moment.locale('fr');
    const dateA = moment(a.date, 'DD MMMM YYYY').toDate();
    const dateB = moment(b.date, 'DD MMMM YYYY').toDate();

    if (dateA < dateB) {
      return 1;
    } else if (dateA === dateB) {
      return 0;
    } else {
      return -1;
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptionRecipe.unsubscribe();
  }
}
