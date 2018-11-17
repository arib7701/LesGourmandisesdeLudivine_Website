import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from 'angularfire2/database';
import { Real } from '../models/real';

@Injectable({
  providedIn: 'root'
})
export class RealService {
  manyReals: AngularFireList<Real[]>;
  oneReal: AngularFireObject<Real>;

  constructor(private firebase: AngularFireDatabase) {}

  // Get last 4 most recents Realizations
  getNews(): AngularFireList<Real[]> {
    return (this.manyReals = this.firebase.list<Real>('/news', ref =>
      ref.limitToLast(4)
    ) as AngularFireList<Real[]>);
  }

  // Get ALL Realizations
  getAllNews(): AngularFireList<Real[]> {
    return (this.manyReals = this.firebase.list<Real>(
      '/news'
    ) as AngularFireList<Real[]>);
  }

  // Get One Realization By Id
  getNewsById(id: string): AngularFireObject<Real> {
    return (this.oneReal = this.firebase.object<Real>(
      `/news/${id}`
    ) as AngularFireObject<Real>);
  }

  // Get Next Realization By Id
  getNextNewsById(id: string): AngularFireList<Real[]> {
    return (this.manyReals = this.firebase.list<Real>('/news', ref =>
      ref.orderByKey().startAt(id)
    ) as AngularFireList<Real[]>);
  }

  // Get Previous Realization By Id
  getPreviousNewsById(id: string): AngularFireList<Real[]> {
    return (this.manyReals = this.firebase.list<Real>('/news', ref =>
      ref
        .limitToLast(2)
        .orderByKey()
        .endAt(id)
    ) as AngularFireList<Real[]>);
  }

  // New Realization - return ID
  createNewRealization(newReal: Real[]): string {
    this.getNews();
    const newRef = this.manyReals.push(newReal);
    const key = newRef.key;
    return key;
  }

  // Edit Realization By ID
  editReal(id: string, newReal: Real[]): Promise<void> {
    this.getAllNews();
    return this.manyReals.update(id, newReal);
  }

  // Delete Realization by Id
  deleteReal(id: string): Promise<void> {
    this.getAllNews();
    return this.manyReals.remove(id);
  }
}
