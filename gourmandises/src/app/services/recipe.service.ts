import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from 'angularfire2/database';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  manyRecipes: AngularFireList<Recipe[]>;
  oneRecipe: AngularFireObject<Recipe>;

  constructor(private firebase: AngularFireDatabase) {}

  // Get Most Recent Recipe (1)
  getNewRecipe(): AngularFireList<Recipe[]> {
    return (this.manyRecipes = this.firebase.list('/recipes', ref =>
      ref.limitToLast(1)
    ) as AngularFireList<Recipe[]>);
  }

  // Get ALL Recipes
  getAllRecipes(): AngularFireList<Recipe[]> {
    return (this.manyRecipes = this.firebase.list(
      '/recipes'
    ) as AngularFireList<Recipe[]>);
  }

  // Get One Recipe By Id
  getRecipeById(id: string): AngularFireObject<Recipe> {
    return (this.oneRecipe = this.firebase.object(
      '/recipes/' + id
    ) as AngularFireObject<Recipe>);
  }

  // New Recipe - return ID
  createNewRecipe(newRec: Recipe[]): string {
    this.getNewRecipe();
    const recipeRef = this.manyRecipes.push(newRec);
    const key = recipeRef.key;
    return key;
  }

  // Edit Recipe By ID
  editRecipe(id: string, newRecipe: Recipe[]): Promise<void> {
    this.getAllRecipes();
    return this.manyRecipes.update(id, newRecipe);
  }

  // Delete Recipe By Id
  deleteRecipe(id: string): Promise<void> {
    this.getAllRecipes();
    return this.manyRecipes.remove(id);
  }
}
