import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { Real } from 'src/app/models/real';
import { Observable, Subscription } from 'rxjs';
import { RealService } from 'src/app/services/real.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { finalize } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';
import { GalleryService } from 'src/app/services/gallery.service';
import { Gallery } from 'src/app/models/gallery';
import { storage } from 'firebase';

@Component({
  selector: 'app-real-create',
  templateUrl: './real-create.component.html',
  styleUrls: ['./real-create.component.css']
})
export class RealCreateComponent implements OnInit, OnDestroy {
  @Output()
  action: EventEmitter<Real> = new EventEmitter();

  options = { year: 'numeric', month: 'long', day: 'numeric' };

  newRealId: string;
  newReal: Real;

  categories: string[];

  // Upload Files variables
  primaryFile;
  downloadURL: Observable<string>;
  gallery: Gallery;

  urlStored300: string;
  urlStored120: string;

  // Subscription
  subscriptionCat: Subscription;
  subscriptionStorage: Subscription;
  subscriptionStorage2: Subscription;
  subscriptionStorageUrl: Subscription;

  constructor(
    private realService: RealService,
    private categoryService: CategoryService,
    private galleryService: GalleryService,
    private storageService: AngularFireStorage,
    private flashMess: FlashMessagesService,
    private _cdRef: ChangeDetectorRef,
    private imgToolsService: Ng2ImgToolsService
  ) {
    // Set up Real
    this.newReal = new Real();
    this.newReal.likes = 0;
    this.newReal.date = new Date().toLocaleDateString('fr-FR', this.options);
    this.newReal.img = {};
    this.newReal.haveRecipe = {};

    // Set Up Gallery
    this.gallery = new Gallery();
    this.gallery.principale = true;
    this.gallery.date = new Date().toLocaleDateString('fr-FR', this.options);
  }

  ngOnInit() {
    this.subscriptionCat = this.categoryService
      .getCategories()
      .valueChanges()
      .subscribe(categories => {
        this.categories = [];
        categories.forEach(element => {
          const el: string = element as any;
          this.categories.push(el);
        });
      });
  }

  uploadPrim(event) {
    this.primaryFile = event.target.files[0];
  }

  onSubmitReal() {
    const id: string = Math.random()
      .toString(36)
      .substring(2);

    // Add to Fire Storage
    const filePath = id;
    const fileRef = this.storageService.ref(filePath);
    const task = this.storageService.upload(filePath, this.primaryFile);

    // Get Url and Save to DB
    this.subscriptionStorage = task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.subscriptionStorageUrl = this.downloadURL.subscribe(
            urlStorage => {
              // Set up value of New Realization
              this.newReal.img.url = urlStorage;
              this.newReal.haveRecipe.exist = false;

              // Create New Realization
              this.newRealId = this.realService.createNewRealization(this
                .newReal as Real[]);

              // Save Img Principale to Gallery - Get back its ID
              this.gallery.img = urlStorage;
              this.gallery.newsLink = this.newRealId;
              const key = this.galleryService.addToGallery(
                this.gallery as Gallery[],
                this.newReal.category
              );

              // Edit Realization to DB - after adding Id of Img
              this.newReal.img.id = key;
              this.realService.editReal(this.newRealId, this.newReal as Real[]);

              // Store Resized Image Url to DB Gallery
              this.storeResizedImgToDB(id, key);

              // Send back Real to Parent Component
              this.newReal.key = this.newRealId;
              this.action.emit(this.newReal);
            }
          );
        })
      )
      .subscribe();

    // Show success message
    /*this.flashMess.show('Réalisation sauvegardée!', {
      cssClass: 'alert-success',
      timeout: 2000
    });*/
  }

  storeResizedImgToDB(idFile: string, idGallery: string) {

    // Resize to 300x300 for Random Gallery on Home Page
    let file300: Blob;

    this.imgToolsService
    .resizeExactCropImage(this.primaryFile, 300, 300)
    .subscribe( result => {

      file300 = result;

      const filePath300 = `${idFile}_300`;
      const fileRef300 = this.storageService.ref(filePath300);
      const task300 = this.storageService.upload(filePath300, file300);

      this.getUrlResizedImg(fileRef300, task300, idGallery, 300);
    },
    error => {
      console.log('Error resizing image');
    });

    // Resize to 120x120 for Recent Real on Home Page
    let file120: Blob;

    this.imgToolsService
    .resizeExactCropImage(this.primaryFile, 120, 120)
    .subscribe( result => {

      file120 = result;

      const filePath120 = `${idFile}_120`;
      const fileRef120 = this.storageService.ref(filePath120);
      const task120 = this.storageService.upload(filePath120, file120);

      this.getUrlResizedImg(fileRef120, task120, idGallery, 120);
    },
    error => {
      console.log('Error resizing image');
    });
  }

  getUrlResizedImg(fileRef: AngularFireStorageReference, task: AngularFireUploadTask, idGallery: string, size: number) {

    let downloadedURL: Observable<string>;
    let urlStored: string;

    this.subscriptionStorage2 = task
    .snapshotChanges()
    .pipe(
      finalize(() => {
          downloadedURL = fileRef.getDownloadURL();
          downloadedURL.subscribe(
            urlStorage => {
              // Set up value of New Realization
              urlStored = urlStorage;
              this.updateGalleryWithResizedImg(idGallery, urlStored, size);
            },
            error => {
              console.log('Error resizing image');
            });
          })
        )
        .subscribe();
  }

  updateGalleryWithResizedImg(idGallery: string, urlStored: string, size: number) {

    if (size === 300) {
      this.gallery.img300 = urlStored;
    }
    if (size === 120) {
      this.gallery.img120 = urlStored;
    }
    this.galleryService.editGallery(
      idGallery,
      this.gallery as Gallery[],
      this.newReal.category
    );
  }

  ngOnDestroy() {
    if (this.subscriptionCat !== undefined) {
      this.subscriptionCat.unsubscribe();
    }

    if (this.subscriptionStorage !== undefined) {
      this.subscriptionStorage.unsubscribe();
    }

    if (this.subscriptionStorage2 !== undefined) {
      this.subscriptionStorage2.unsubscribe();
    }

    if (this.subscriptionStorageUrl !== undefined) {
      this.subscriptionStorageUrl.unsubscribe();
    }
  }
}
