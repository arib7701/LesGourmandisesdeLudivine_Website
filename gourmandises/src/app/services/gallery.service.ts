import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from 'angularfire2/database';
import { Gallery } from '../models/gallery';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  manyGalleries: AngularFireList<Gallery[]>;
  oneGallery: AngularFireObject<Gallery>;

  constructor(private firebase: AngularFireDatabase) {}

  // Get ALL Galleries
  getAllGallery(): AngularFireList<Gallery[]> {
    return (this.manyGalleries = this.firebase.list(
      '/gallery'
    ) as AngularFireList<Gallery[]>);
  }

  /*getTwentyRandomImg(): AngularFireList<Gallery[]> {
    for (let i = 0; i < 20; i++) {
      const random = Math.floor(Math.random() * 300);
      const tempGalleries: AngularFireList<Gallery[]> = this.firebase.list(
        '/gallery',
        ref =>
          ref
            .limitToLast(1)
            .orderByKey()
            .startAt(random)
      ) as AngularFireList<Gallery[]>;
      this.manyGalleries.push(tempGalleries[0]);
    }

    return this.manyGalleries;
  }*/

  // Get ONE Gallery By Category
  getOneGallery(category: string): AngularFireList<Gallery[]> {
    return (this.manyGalleries = this.firebase.list(
      `/gallery/${category}`
    ) as AngularFireList<Gallery[]>);
  }

  // Get One Img in One Gallery By Cateogory and By Id
  getPhotoInGallery(category: string, id: string): AngularFireObject<Gallery> {
    return (this.oneGallery = this.firebase.object(
      `/gallery/${category}/${id}`
    ) as AngularFireObject<Gallery>);
  }

  // New Img in Gallery depending on Category - return ID
  addToGallery(newGal: Gallery[], category: string): string {
    this.getOneGallery(category);
    const newRef = this.manyGalleries.push(newGal);
    const key = newRef.key;
    return key;
  }

  // Edit Gallery By ID and Gallery
  editGallery(id: string, newGal: Gallery[]): Promise<void> {
    this.getAllGallery();
    return this.manyGalleries.update(id, newGal);
  }

  // Delete All Img in Category Gallery
  deleteGallery(id: string): Promise<void> {
    this.getAllGallery();
    return this.manyGalleries.remove(id);
  }

  // Delete One Img in Gallery By Id
  deletePhotoInGallery(category: string, id: string): Promise<void> {
    this.getAllGallery();
    return this.manyGalleries.remove(`${category}/${id}`);
  }
}
