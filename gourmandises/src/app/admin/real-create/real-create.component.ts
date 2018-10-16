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
import { AngularFireStorage } from 'angularfire2/storage';
import { FlashMessagesService } from 'angular2-flash-messages';
import { finalize } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';
import { GalleryService } from 'src/app/services/gallery.service';
import { Gallery } from 'src/app/models/gallery';

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

  // Subscription
  subscriptionCat: Subscription;
  subscriptionStorage: Subscription;
  subscriptionStorageUrl: Subscription;

  constructor(
    private realService: RealService,
    private categoryService: CategoryService,
    private galleryService: GalleryService,
    private storage: AngularFireStorage,
    private flashMess: FlashMessagesService,
    private _cdRef: ChangeDetectorRef
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
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.primaryFile);

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

              // Send back Real to Parent Component
              this.newReal.$key = this.newRealId;
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

  ngOnDestroy() {
    if (this.subscriptionCat !== undefined) {
      this.subscriptionCat.unsubscribe();
    }

    if (this.subscriptionStorage !== undefined) {
      this.subscriptionStorage.unsubscribe();
    }

    if (this.subscriptionStorageUrl !== undefined) {
      this.subscriptionStorageUrl.unsubscribe();
    }
  }
}
