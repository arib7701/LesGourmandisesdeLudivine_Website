import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { FlashMessagesService } from 'angular2-flash-messages';
import { environment } from 'src/environments/environment';

// TO DO
// add form validator handler - use material design

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {
  @ViewChild('captchaRef2')
  captchaRef2: ElementRef;
  captcha: Boolean = false;
  grecaptcha: any;
  _reCaptchaId: number;
  CAPTCHA = environment.CAPTCHA_SITE_ID;

  contacts: any[];
  contactForm: FormGroup;

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
    this.contactForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      subject: new FormControl(''),
      message: new FormControl('', [Validators.required])
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
        subject,
        message
      } = this.contactForm.value;

      const date = Date();
      const html = `
          <div>From: ${firstName} ${lastName}</div>
          <div>Email: <a href="mailto:${email}">${email}</a></div>
          <div>Date: ${date}</div>
          <div>Subject: ${subject}</div>
          <div>Message: ${message}</div>
        `;
      const formRequest = {
        firstName,
        lastName,
        email,
        subject,
        message,
        date,
        html
      };

      // Push new message to DB table in firebase - Cloud Fct will listen to any change on table and send email
      this.firebase.list('/messages').push(formRequest);

      // Show message success
      this.flashService.show('Votre message a bien été envoyé.', {
        cssClass: 'alert-success',
        timeout: 2000
      });
    }
  }

  get firstName() {
    return this.contactForm.get('firstName');
  }
  get lastName() {
    return this.contactForm.get('lastName');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get subject() {
    return this.contactForm.get('subject');
  }
  get message() {
    return this.contactForm.get('message');
  }
}
