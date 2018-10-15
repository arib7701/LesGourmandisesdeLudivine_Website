import { Component, OnInit, OnDestroy } from '@angular/core';
import { Partner } from 'src/app/models/partner';
import { Subscription } from 'rxjs';
import { PartnerService } from 'src/app/services/partner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-partner-edit',
  templateUrl: './partner-edit.component.html',
  styleUrls: ['./partner-edit.component.css']
})
export class PartnerEditComponent implements OnInit, OnDestroy {
  id: string;
  partner: Partner;
  subscriptionPartner: Subscription;

  constructor(
    private partnerService: PartnerService,
    private route: ActivatedRoute,
    private router: Router,
    private flashService: FlashMessagesService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.partner = new Partner();

    this.subscriptionPartner = this.partnerService
      .getOnePartnerById(this.id)
      .valueChanges()
      .subscribe(partner => {
        this.partner = partner;
      });
  }

  ngOnInit() {}

  onSubmit() {
    this.partnerService.editPartner(this.id, this.partner as Partner[]);

    this.flashService.show('Changements sauvegardés!', {
      cssClass: 'alert-success',
      timeout: 2000
    });
    this.router.navigate(['/admin/partners/edit/' + this.id]);
  }

  ngOnDestroy() {
    if (this.subscriptionPartner !== undefined) {
      this.subscriptionPartner.unsubscribe();
    }
  }
}
