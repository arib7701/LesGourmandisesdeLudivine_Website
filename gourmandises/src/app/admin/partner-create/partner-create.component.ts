import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Partner } from 'src/app/models/partner';
import { Real } from 'src/app/models/real';
import { Subscription } from 'rxjs';
import { PartnerService } from 'src/app/services/partner.service';
import { map } from 'rxjs/operators';
import { RealService } from 'src/app/services/real.service';

@Component({
  selector: 'app-partner-create',
  templateUrl: './partner-create.component.html',
  styleUrls: ['./partner-create.component.css']
})
export class PartnerCreateComponent implements OnInit, OnDestroy {
  options = { year: 'numeric', month: 'long', day: 'numeric' };

  @Input()
  real: Real;

  @Output()
  change: EventEmitter<string> = new EventEmitter();

  newPartner: Partner;
  load = false;

  // Upload Files variables
  arrayPartners = new Array<any>();
  oldPartner: any;
  updatedReal: any;

  // Subscription
  subscriptionPartner: Subscription;

  constructor(
    private partnerService: PartnerService,
    private realService: RealService
  ) {
    this.newPartner = new Partner();
  }

  ngOnInit() {
    this.arrayPartners.push({
      name: '',
      website: '',
      logo: '',
      location: '',
      isPartner: false,
      realDate: [],
      realTitle: [],
      realId: [],
      alreadyUsed: false
    });
  }

  getOldPartner(event, i: number) {
    this.subscriptionPartner = this.partnerService
      .getOnePartnerByName(this.arrayPartners[i].name)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(old => {
        this.oldPartner = old;
        console.log(this.oldPartner);
      });
  }

  addPartner() {
    // Add empty Object to Partner Array - will be filled by Form
    this.arrayPartners.push({
      name: '',
      website: '',
      logo: '',
      location: '',
      isPartner: false,
      realDate: [],
      realTitle: [],
      realId: [],
      alreadyUsed: false
    });
  }

  deletePartner(number: number) {
    // Remove Partners from Form
    this.arrayPartners.splice(number, 1);
  }

  updateOldPartner(oldPartner) {
    if (oldPartner.realId !== undefined) {
      oldPartner.realId.push(this.real.key);
      oldPartner.realTitle.push(this.real.title);
      oldPartner.realDate.push(this.real.date);

      // Update Partner with added new Real Info
      this.partnerService.editPartner(oldPartner.key, oldPartner);

      // Add ID of Partner to Realization
      this.real.partnersId.push(oldPartner.key);
      this.updatedReal = this.realService.editReal(this.real.key, this
        .real as Real[]);
    }
  }

  // ------  SAVE PARTNER TO DATABASE --------
  onSubmitPartners() {
    if (this.arrayPartners.length > 0) {

      this.load = true;

      for (let i = 0; i < this.arrayPartners.length; i++) {
        this.newPartner = this.arrayPartners[i];

        // Check Inputs requirements in Form
        if (this.newPartner.name !== '') {
          if (this.newPartner.alreadyUsed !== true) {
            // Set up NON form inputs
            this.newPartner.realTitle[0] = this.real.title;
            this.newPartner.realDate[0] = this.real.date;
            this.newPartner.realId[0] = this.real.key;

            // Save Partner to DB
            const key = this.partnerService.createNewPartner(this
              .newPartner as Partner[]);

            // Add ID of Partner to Realization
            if (this.real.partnersId === undefined) {
              this.real.partnersId = new Array<string>();
            }
            this.real.partnersId.push(key);
            this.updatedReal = this.realService.editReal(this.real.key, this
              .real as Real[]);
          } else {
            // If already used update Partner
            this.updateOldPartner(this.oldPartner[0]);
          }
        }

        if (i === this.arrayPartners.length - 1) {
          this.load = false;
          this.change.emit('real');
        }
      }
      // Show success message
      /*this.flashMess.show('Partenaires/Produits sauvegardés!', {
        cssClass: 'alert-success',
        timeout: 2000
      });*/
    }
  }

  ngOnDestroy() {
    if (this.subscriptionPartner !== undefined) {
      this.subscriptionPartner.unsubscribe();
    }
  }

  noPartner() {
    this.change.emit('real');
  }
}
