import { Injectable } from '@angular/core';
import {
  AngularFireList,
  AngularFireObject,
  AngularFireDatabase
} from 'angularfire2/database';
import { Actu } from '../models/actu';

@Injectable({
  providedIn: 'root'
})
export class ActuService {
  manyActus: AngularFireList<Actu[]>;
  oneActu: AngularFireObject<Actu>;

  constructor(private firebase: AngularFireDatabase) {}

  // Get Most Recent Actu (1)
  getLastActu(): AngularFireList<Actu[]> {
    return (this.manyActus = this.firebase.list('/actu', ref =>
      ref.limitToLast(1)
    ) as AngularFireList<Actu[]>);
  }

  // Get All Actu
  getAllActu(): AngularFireList<Actu[]> {
    return (this.manyActus = this.firebase.list('/actu') as AngularFireList<
      Actu[]
    >);
  }

  // Get ONE Actu By Id
  getOneActuById(id: string): AngularFireObject<Actu> {
    return (this.oneActu = this.firebase.object(
      '/actu/' + id
    ) as AngularFireObject<Actu>);
  }

  // New Actualite - return ID
  createNewActu(newActu: Actu[]): string {
    this.getAllActu();
    const newRef = this.manyActus.push(newActu);
    const key = newRef.key;
    return key;
  }

  // Edit Actu By ID
  editActu(id: string, newActu: Actu[]): Promise<void> {
    this.getAllActu();
    return this.manyActus.update(id, newActu);
  }

  // Delete Actu by ID
  deleteActu(id: string): Promise<void> {
    this.getAllActu();
    return this.manyActus.remove(id);
  }
}
