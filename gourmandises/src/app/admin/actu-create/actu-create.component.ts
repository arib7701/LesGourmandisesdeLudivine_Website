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
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { FlashMessagesService } from 'angular2-flash-messages';

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
  subscriptionURL: Subscription;

  constructor(
    private actuService: ActuService,
    private storage: AngularFireStorage,
    private flashMess: FlashMessagesService
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
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.imgFile);

    // Get Url and Save to DB
    this.subscriptionStorage = task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.subscriptionURL = this.downloadURL.subscribe(url => {
            this.newActu.img = url;
            this.actuService.createNewActu(this.newActu as Actu[]);
            this.load = false;
            this.change.emit('fromactu');
          }, error => {
            console.log('Error saving actu image, please try again');
          });
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.subscriptionStorage !== undefined) {
      this.subscriptionStorage.unsubscribe();
    }
    if (this.subscriptionURL !== undefined) {
      this.subscriptionURL.unsubscribe();
    }
  }

  noActu() {
    this.change.emit('fromactu');
  }
}
