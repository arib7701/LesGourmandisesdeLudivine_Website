import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { Subscription } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: string;
  recipe: Recipe;
  numberIngredients: number;
  numberSteps: number;
  arrayIng = new Array<Number>();
  arrayStep = new Array<Number>();

  // Subscription
  subscriptionRecipe: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private flashService: FlashMessagesService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.recipe = new Recipe();

    this.subscriptionRecipe = this.recipeService
      .getRecipeById(this.id)
      .valueChanges()
      .subscribe(recipe => {
        this.recipe = recipe;
        this.numberIngredients = this.recipe.ingredients.length;
        this.numberSteps = this.recipe.steps.length;

        // Create Arrays to show Ingredients / Qtty / Steps
        this.arrayIng = new Array(this.numberIngredients);
        for (let i = 0; i < this.numberIngredients; i++) {
          this.arrayIng[i] = i;
        }
        this.arrayStep = new Array(this.numberSteps);
        for (let i = 0; i < this.numberSteps; i++) {
          this.arrayStep[i] = i;
        }
      });
  }

  ngOnInit() {}

  onDeleteIng(number: number) {
    if (confirm('Etes-vous sure de vouloir supprimer cette donnée?')) {
      // Remove ingredient/qtty of arrays
      this.recipe.ingredients.splice(number, 1);
      this.recipe.quantities.splice(number, 1);

      // Update Showing Array
      this.numberIngredients = this.numberIngredients - 1;
      this.arrayIng = new Array(this.numberIngredients);
      for (let i = 0; i < this.numberIngredients; i++) {
        this.arrayIng[i] = i;
      }
    }
  }

  onDeleteStep(number: number) {
    if (confirm('Etes-vous sure de vouloir supprimer cette donnée?')) {
      // Remove steps of array
      this.recipe.steps.splice(number, 1);

      // Update Showing Array
      this.numberSteps = this.numberSteps - 1;
      this.arrayStep = new Array(this.numberSteps);
      for (let i = 0; i < this.numberSteps; i++) {
        this.arrayStep[i] = i;
      }
    }
  }

  addStep(number: number) {
    // Add Step to array
    this.recipe.steps.splice(number + 1, 0, '');

    // Update Showing array
    this.numberSteps = this.numberSteps + 1;
    this.arrayStep = new Array(this.numberSteps);
    for (let i = 0; i < this.numberSteps; i++) {
      this.arrayStep[i] = i;
    }
  }

  addIng() {
    // Add New Ingredient end of Array
    this.recipe.ingredients.push();
    this.recipe.quantities.push();
    this.numberIngredients = this.numberIngredients + 1;
    this.arrayIng = new Array(this.numberIngredients);
    for (let i = 0; i < this.numberIngredients; i++) {
      this.arrayIng[i] = i;
    }
  }

  onSubmit() {
    this.recipeService.editRecipe(this.id, this.recipe as Recipe[]);

    this.flashService.show('Changements sauvegardés!', {
      cssClass: 'alert-success',
      timeout: 2000
    });
    this.router.navigate(['/admin/recipe/edit/' + this.id]);
  }

  ngOnDestroy() {
    if (this.subscriptionRecipe !== undefined) {
      this.subscriptionRecipe.unsubscribe();
    }
  }
}
