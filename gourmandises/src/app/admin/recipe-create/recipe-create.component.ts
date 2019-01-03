import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';
import { RecipeService } from 'src/app/services/recipe.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RealService } from 'src/app/services/real.service';
import { Real } from 'src/app/models/real';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  @Input()
  real: Real;

  @Output()
  change: EventEmitter<string> = new EventEmitter();

  optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
  newRecipe: Recipe;
  load = false;

  numberIngredients: 0;
  arrayIng = new Array<Number>();
  numberSteps: 0;
  arrayStep = new Array<Number>();

  constructor(
    private recipeService: RecipeService,
    private realService: RealService
  ) {
    this.newRecipe = new Recipe();
    this.newRecipe.ingredients = new Array<string>();
    this.newRecipe.quantities = new Array<string>();
    this.newRecipe.steps = new Array<string>();
  }

  ngOnInit() {}

  arrayIngredients(event) {
    this.arrayIng = new Array(this.numberIngredients);
    for (let i = 0; i < this.numberIngredients; i++) {
      this.arrayIng[i] = i;
    }
  }

  arraySteps(event) {
    this.arrayStep = new Array(this.numberSteps);
    for (let i = 0; i < this.numberSteps; i++) {
      this.arrayStep[i] = i;
    }
  }

  // ------  SAVE RECIPE TO DATABASE --------
  onSubmitRecipe() {

    this.load = true;

    // Set up NON form inputs
    this.newRecipe.title = this.real.title;
    this.newRecipe.date = this.real.date;
    this.newRecipe.newsLink = this.real.key;

    // Save Recipe to DB
    const key = this.recipeService.createNewRecipe(this.newRecipe as Recipe[]);

    // Add ID of Recipe to Realization
    this.real.haveRecipe.exist = true;
    this.real.haveRecipe.recipeLink = key;
    this.realService.editReal(this.real.key, this.real as Real[]);
    this.load = false;
    this.change.emit('partner');

    // Show success message
    /*this.flashMess.show('Recette sauvegardée!', {
      cssClass: 'alert-success',
      timeout: 2000
    });*/
  }

  noRecipe() {
    this.change.emit('partner');
  }
}
