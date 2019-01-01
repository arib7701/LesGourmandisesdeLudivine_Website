import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input
} from '@angular/core';
import { Real } from 'src/app/models/real';
import { Gallery } from 'src/app/models/gallery';
import { Observable, Subscription } from 'rxjs';
import { GalleryService } from 'src/app/services/gallery.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { RealService } from 'src/app/services/real.service';
import { Ng2ImgToolsService } from 'ng2-img-tools';

@Component({
  selector: 'app-gallery-create',
  templateUrl: './gallery-create.component.html',
  styleUrls: ['./gallery-create.component.css']
})
export class GalleryCreateComponent implements OnInit, OnDestroy {
  @Input()
  real: Real;

  @Output()
  change: EventEmitter<string> = new EventEmitter();

  options = { year: 'numeric', month: 'long', day: 'numeric' };

  newGal: Gallery;

  // Upload Files variables
  galleryFiles;
  galleryFilesLength;
  downloadURL: Observable<string>;

  // Subscription
  subscriptionStorage: Subscription;
  subscriptionStorage2: Subscription;
  subscriptionStorageGal: Subscription;
  subscriptionURL: Subscription;

  constructor(
    private galleryService: GalleryService,
    private realService: RealService,
    private storageService: AngularFireStorage,
    private imgToolsService: Ng2ImgToolsService
  ) {
    this.newGal = new Gallery();
  }

  ngOnInit() {}

  uploadGal(event) {
    this.galleryFiles = new Array<File>();
    this.galleryFilesLength = 0;
    this.galleryFiles = event.target.files;
    this.galleryFilesLength = this.galleryFiles.length;
  }

  // ------  SAVE GALLERY IMGS TO DATABASE --------
  onSubmitGallery() {
    if (this.galleryFiles.length > 0) {
      // Loop through each File
      for (let i = 0; i < this.galleryFilesLength; i++) {
        const currentFile = this.galleryFiles[i];
        const id: string = Math.random()
          .toString(36)
          .substring(2);

        // Add to Fire Storage
        const filePath = id;
        const fileRef = this.storageService.ref(filePath);
        const task = this.storageService.upload(filePath, currentFile);

        // Get Url and Save to DB
        this.subscriptionStorageGal = task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.subscriptionURL = this.downloadURL.subscribe(url => {
                this.newGal.date = this.real.date;
                this.newGal.principale = false;
                this.newGal.newsLink = this.real.key;
                const key = this.galleryService.addToGallery(
                  this.newGal as Gallery[],
                  this.real.category
                );

                // Add ID of Img to Realization
                if (this.real.galleryId === undefined) {
                  this.real.galleryId = new Array<string>();
                }
                this.real.galleryId.push(key);
                this.realService.editReal(this.real.key, this.real as Real[]);

                // Store Resized Image Url to DB Gallery
                this.storeResizedImgToDB(id, key, currentFile, url);

                if (i === this.galleryFilesLength - 1) {
                  this.change.emit('recipe');
                }
              });
            })
          )
          .subscribe();
      }
      // Show success message
      /*this.flashMess.show('Images sauvegardées!', {
        cssClass: 'alert-success',
        timeout: 2000
      });*/
    }
  }

  storeResizedImgToDB(idFile: string, idGallery: string, currentFile: File, currentUrl: string) {

    // Resize to 300x300 for Random Gallery on Home Page
    let file300: Blob;

    this.imgToolsService
    .resizeExactCropImage(currentFile, 300, 300)
    .subscribe( result => {

      file300 = result;

      const filePath300 = `${idFile}_300`;
      const fileRef300 = this.storageService.ref(filePath300);
      const task300 = this.storageService.upload(filePath300, file300);

      this.getUrlResizedImg(fileRef300, task300, idGallery, currentUrl);
    },
    error => {
      console.log('Error resizing image');
    });
  }

  getUrlResizedImg(fileRef: AngularFireStorageReference, task: AngularFireUploadTask, idGallery: string, currentUrl: string) {

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
              this.updateGalleryWithResizedImg(idGallery, urlStored, currentUrl);
            },
            error => {
              console.log('Error resizing image');
            });
          })
        )
        .subscribe();
  }

  updateGalleryWithResizedImg(idGallery: string, urlStored: string, currentUrl: string) {

    this.newGal.img300 = urlStored;
    this.newGal.img = currentUrl;
    this.galleryService.editGallery(
      idGallery,
      this.newGal as Gallery[],
      this.real.category
    );
  }

  ngOnDestroy() {
    if (this.subscriptionStorage !== undefined) {
      this.subscriptionStorage.unsubscribe();
    }
    if (this.subscriptionStorage2 !== undefined) {
      this.subscriptionStorage2.unsubscribe();
    }
    if (this.subscriptionStorageGal !== undefined) {
      this.subscriptionStorageGal.unsubscribe();
    }
    if (this.subscriptionURL !== undefined) {
      this.subscriptionURL.unsubscribe();
    }
  }

  noGallery() {
    this.change.emit('recipe');
  }
}
