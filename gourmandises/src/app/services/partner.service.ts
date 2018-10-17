import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from 'angularfire2/database';
import { Partner } from '../models/partner';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  manyPartners: AngularFireList<Partner[]>;
  onePartner: AngularFireObject<Partner>;

  constructor(private firebase: AngularFireDatabase) {}

  // Get ALL Partners
  getAllPartners(): AngularFireList<Partner[]> {
    return (this.manyPartners = this.firebase.list(
      '/partner'
    ) as AngularFireList<Partner[]>);
  }

  // Get last 10 Partners
  getLastTenPartners(): AngularFireList<Partner[]> {
    return (this.manyPartners = this.firebase.list('/partner', ref =>
      ref.limitToLast(10)
    ) as AngularFireList<Partner[]>);
  }

  // Get ONE Partner By Id
  getOnePartnerById(id: string): AngularFireObject<Partner> {
    return (this.onePartner = this.firebase.object(
      '/partner/' + id
    ) as AngularFireObject<Partner>);
  }

  // Get ONE Partner By Name
  getOnePartnerByName(name: string): AngularFireList<Partner[]> {
    return (this.manyPartners = this.firebase.list('/partner', ref =>
      ref.orderByChild('name').equalTo(name)
    ) as AngularFireList<Partner[]>);
  }

  // New Partner - return ID
  createNewPartner(newPartner: Partner[]): string {
    this.getAllPartners();
    const newRef = this.manyPartners.push(newPartner);
    const key = newRef.key;
    return key;
  }

  // Edit Partner By ID
  editPartner(id: string, newPartner: Partner[]): Promise<void> {
    this.getAllPartners();
    return this.manyPartners.update(id, newPartner);
  }

  // Delete Partner by ID
  deletePartner(id: string): Promise<void> {
    this.getAllPartners();
    return this.manyPartners.remove(id);
  }
}
