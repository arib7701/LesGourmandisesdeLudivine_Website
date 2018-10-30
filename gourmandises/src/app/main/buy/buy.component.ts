import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit, AfterViewInit {

  @ViewChild('captchaRef2')
  captchaRef2: ElementRef;
  captcha: Boolean = false;
  grecaptcha: any;
  _reCaptchaId: number;
  CAPTCHA = environment.CAPTCHA_SITE_ID;

  infos: any[];
  buyInfoForm: FormGroup;

  constructor(
    private firebase: AngularFireDatabase,
    private flashService: FlashMessagesService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.grecaptcha = (window as any).grecaptcha;
  }

  ngAfterViewInit() {
    if (this.grecaptcha) {
      this._reCaptchaId = this.grecaptcha.render(
        this.captchaRef2.nativeElement,
        {
          sitekey: this.CAPTCHA,
          callback: resonse => this.reCapchaSuccess(resonse),
          'expired-callback': () => this.reCapchaExpired()
        }
      );
    }
  }

  createForm() {
    this.buyInfoForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      row1: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      row2: new FormControl('', [Validators.maxLength(12)]),
      row3: new FormControl('', [Validators.maxLength(12)])
    });
  }

  reCapchaSuccess(data: any) {
    if (data) {
      this.captcha = true;
    }
  }

  reCapchaExpired() {
    this.flashService.show('Veuillez refaire le captcha.', {
      cssClass: 'alert-danger',
      timeout: 2000
    });
  }

  processForm() {
    if (!this.captcha) {
      // Show message error - Fill form fully
      this.flashService.show('Veuillez faire le captcha.', {
        cssClass: 'alert-danger',
        timeout: 2000
      });
    } else {
      const {
        firstName,
        lastName,
        email,
        address,
        city,
        zipcode,
        row1,
        row2,
        row3
      } = this.buyInfoForm.value;

      const date = Date();
      const html = `
          <div>From: ${firstName} ${lastName}</div>
          <div>Email: <a href="mailto:${email}">${email}</a></div>
          <div>Date: ${date}</div>
          <div>Addresse: ${address}</div>
          <div>Ville: ${city}</div>
          <div>Code Postal: ${zipcode}</div>
          <div>Ligne 1: ${row1} </div>
          <div>Ligne 2: ${row2} </div>
          <div>Ligne 3: ${row3} </div>
        `;
      const formRequest = {
        firstName,
        lastName,
        email,
        address,
        city,
        zipcode,
        row1,
        row2,
        row3,
        date,
        html
      };

      // Push new message to DB table in firebase - Cloud Fct will listen to any change on table and send email
      this.firebase.list('/orders').push(formRequest);

      // Show message success
      this.flashService.show('Votre commande a bien été envoyé.', {
        cssClass: 'alert-success',
        timeout: 2000
      });
    }
  }

  get firstName() {
    return this.buyInfoForm.get('firstName');
  }
  get lastName() {
    return this.buyInfoForm.get('lastName');
  }
  get email() {
    return this.buyInfoForm.get('email');
  }
  get address() {
    return this.buyInfoForm.get('address');
  }
  get city() {
    return this.buyInfoForm.get('city');
  }
  get zipcode() {
    return this.buyInfoForm.get('zipcode');
  }
  get row1() {
    return this.buyInfoForm.get('row1');
  }
  get row2() {
    return this.buyInfoForm.get('row2');
  }
  get row3() {
    return this.buyInfoForm.get('row3');
  }
}
