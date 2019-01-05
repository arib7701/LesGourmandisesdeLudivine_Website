import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Actu } from 'src/app/models/actu';
import { ActuService } from 'src/app/services/actu.service';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Ng2ImgToolsService } from 'ng2-img-tools';

@Component({
  selector: 'app-actu-create',
  templateUrl: './actu-create.component.html',
  styleUrls: ['./actu-create.component.css']
})
export class ActuCreateComponent implements OnInit, OnDestroy {
  @Output()
  change: EventEmitter<string> = new EventEmitter();

  newActu: Actu;
  load = false;

  imgFile;
  downloadURL: Observable<string>;
  subscriptionStorage: Subscription;
  subscriptionStorage2: Subscription;
  subscriptionURL: Subscription;

  constructor(
    private actuService: ActuService,
    private storageService: AngularFireStorage,
    private imgToolsService: Ng2ImgToolsService
  ) {
    this.newActu = new Actu();
  }

  ngOnInit() {}

  uploadImg(event) {
    this.imgFile = event.target.files[0];
  }

  onSubmitActu() {
    this.load = true;

    const id: string = Math.random()
      .toString(36)
      .substring(2);

    // Add to Fire Storage
    const filePath = id;
    const fileRef = this.storageService.ref(filePath);
    const task = this.storageService.upload(filePath, this.imgFile);

    // Get Url and Save to DB
    this.subscriptionStorage = task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.subscriptionURL = this.downloadURL.subscribe(
            url => {
              this.newActu.img = url;
              const key = this.actuService.createNewActu(this
                .newActu as Actu[]);

              // Store Resized Image Url to DB Gallery
              this.storeResizedImgToDB(id, key);

              this.load = false;
              this.change.emit('fromactu');
            },
            error => {
              console.log('Error saving actu image, please try again');
            }
          );
        })
      )
      .subscribe();
  }

  storeResizedImgToDB(idFile: string, idActu: string) {
    // Resize to 400x400 for Actu Home Page
    let file400: Blob;

    this.imgToolsService.resizeImage(this.imgFile, 400, 400).subscribe(
      result => {
        file400 = result;

        const filePath400 = `${idFile}_300`;
        const fileRef400 = this.storageService.ref(filePath400);
        const task400 = this.storageService.upload(filePath400, file400);

        this.getUrlResizedImg(fileRef400, task400, idActu, 400);
      },
      error => {
        console.log('Error resizing image');
      }
    );

    // Resize to 160x160 for Archive Actu Page
    let file160: Blob;

    this.imgToolsService.resizeExactCropImage(this.imgFile, 160, 160).subscribe(
      result => {
        file160 = result;

        const filePath160 = `${idFile}_160`;
        const fileRef160 = this.storageService.ref(filePath160);
        const task160 = this.storageService.upload(filePath160, file160);

        this.getUrlResizedImg(fileRef160, task160, idActu, 160);
      },
      error => {
        console.log('Error resizing image');
      }
    );
  }

  getUrlResizedImg(
    fileRef: AngularFireStorageReference,
    task: AngularFireUploadTask,
    idActu: string,
    size: number
  ) {
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
              this.updateGalleryWithResizedImg(idActu, urlStored, size);
            },
            error => {
              console.log('Error resizing image');
            }
          );
        })
      )
      .subscribe();
  }

  updateGalleryWithResizedImg(idActu: string, urlStored: string, size: number) {
    if (size === 400) {
      this.newActu.img400 = urlStored;
    }
    if (size === 160) {
      this.newActu.img160 = urlStored;
    }

    this.actuService.editActu(idActu, this.newActu as Actu[]);
  }

  ngOnDestroy() {
    if (this.subscriptionStorage !== undefined) {
      this.subscriptionStorage.unsubscribe();
    }
    if (this.subscriptionStorage2 !== undefined) {
      this.subscriptionStorage2.unsubscribe();
    }
    if (this.subscriptionURL !== undefined) {
      this.subscriptionURL.unsubscribe();
    }
  }

  noActu() {
    this.change.emit('fromactu');
  }
}
