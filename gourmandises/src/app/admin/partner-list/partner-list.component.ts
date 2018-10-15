import { Component, OnInit, OnDestroy } from '@angular/core';
import { RealService } from 'src/app/services/real.service';
import { Partner } from 'src/app/models/partner';
import { Real } from 'src/app/models/real';
import { Subscription } from 'rxjs';
import { PartnerService } from 'src/app/services/partner.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.css']
})
export class PartnerListComponent implements OnInit, OnDestroy {
  partners: Partner[];
  partner: Partner;
  real: Real;
  realId: string;

  // Paginations
  partnerPage: Number = 1;

  // Subscription
  subscriptionPartner: Subscription;
  subscriptionNewPartner: Subscription;

  constructor(
    private partnerService: PartnerService,
    private realService: RealService,
    private flashService: FlashMessagesService
  ) {
    this.subscriptionPartner = this.partnerService
      .getAllPartners()
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(partners => {
        this.partners = [];
        partners.forEach(element => {
          this.partners.push(element as Partner);
        });
        this.partners.reverse();
      });
  }

  ngOnInit() {}

  // Delete Partner in associated Realization
  deletePartnerReal(real: Real, realId: string, partnerKey: string) {
    if (real.partnersId !== undefined) {
      const partners: any = real.partnersId;
      if (partners.length > 0) {
        for (let i = 0; i < partners.length; i++) {
          if (partners[i] === partnerKey) {
            partners.splice(i, 1);
          }
        }
      }

      // Update realization galleryId
      real.partnersId = partners;
    }

    // Update Realization in DB
    this.realService.editReal(realId, real as Real[]);
  }

  onDeleteClick(type: string, id: string, index: number) {
    if (confirm('Etes-vous sure de vouloir supprimer cette donnée?')) {
      // Delete Partner
      if (type === 'partner') {
        this.partnerService.deletePartner(id);

        // Get Id of Realization using Img
        this.partner = this.partners[index];
        for (let i = 0; i < this.partner.realId.length; i++) {
          this.subscriptionNewPartner = this.realService
            .getNewsById(this.partner.realId[i])
            .valueChanges()
            .subscribe(realObject => {
              this.real = realObject;

              // Delete Partner from Realization
              this.deletePartnerReal(this.real, this.partner.realId[i], id);
            });
        }

        this.flashService.show('Sponsors/Produits Supprimé', {
          cssClass: 'valid-feedback',
          timeout: 4000
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.subscriptionPartner !== undefined) {
      this.subscriptionPartner.unsubscribe();
    }

    if (this.subscriptionNewPartner !== undefined) {
      this.subscriptionNewPartner.unsubscribe();
    }
  }
}
