import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  manyCategories: AngularFireList<string[]>;

  constructor(private firebase: AngularFireDatabase) {}

  // Get ALL Categories
  getCategories(): AngularFireList<string[]> {
    return (this.manyCategories = this.firebase.list(
      '/categories'
    ) as AngularFireList<string[]>);
  }
}
