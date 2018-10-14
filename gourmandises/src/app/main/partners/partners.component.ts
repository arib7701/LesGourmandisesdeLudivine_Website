import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Partner } from 'src/app/models/partner';
import { Subscription } from 'rxjs';
import { PartnerService } from 'src/app/services/partner.service';
declare const Photostack: any;

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit, OnDestroy, AfterViewChecked {
  partnersAll: Partner[];
  partners: Partner[];
  domReady = false;
  subscriptionPartner: Subscription;
  partnerPage = 1;

  constructor(private partnerService: PartnerService) {
    this.subscriptionPartner = this.partnerService
      .getAllPartners()
      .valueChanges()
      .subscribe(partners => {
        this.partners = [];
        partners.forEach(element => {
          this.partners.push(element as Partner);
        });
        this.partners.reverse();
      });
  }

  ngOnInit() {}

  ngAfterViewChecked() {
    if (
      document.getElementById('divPhoto').children.length > 0 &&
      !this.domReady
    ) {
      this.domReady = true;
      // tslint:disable-next-line:no-unused-expression
      new Photostack(document.getElementById('photostack-1'), {
        callback: function(item) {
          // console.log(item);
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscriptionPartner.unsubscribe();
  }
}
