import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { Subscription } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AngularFireStorage } from 'angularfire2/storage';
import { map } from 'rxjs/operators';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];

  // Paginations
  recipePage: Number = 1;

  // Subscription
  subscriptionRecipe: Subscription;

  constructor(
    private recipeService: RecipeService,
    private flashService: FlashMessagesService
  ) {
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

  onDeleteClick(type, id) {
    if (confirm('Etes-vous sure de vouloir supprimer cette donnée?')) {
      // Delete Recipe
      if (type === 'recipe') {
        this.recipeService.deleteRecipe(id);
        this.flashService.show('Recette Supprimée', {
          cssClass: 'valid-feedback',
          timeout: 4000
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.subscriptionRecipe !== undefined) {
      this.subscriptionRecipe.unsubscribe();
    }
  }
}
