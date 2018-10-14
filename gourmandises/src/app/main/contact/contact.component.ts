import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { FlashMessagesService } from 'angular2-flash-messages';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {
  @ViewChild('captchaRef2')
  captchaRef2: ElementRef;
  contacts: any[];
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  form: FormGroup;
  captcha: Boolean = false;

  _reCaptchaId: number;
  CAPTCHA = environment.CAPTCHA_SITE_ID;

  constructor(
    private formBuilder: FormBuilder,
    private firebase: AngularFireDatabase,
    private flashService: FlashMessagesService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    const grecaptcha = (window as any).grecaptcha;
    if (grecaptcha) {
      this._reCaptchaId = grecaptcha.render(this.captchaRef2.nativeElement, {
        sitekey: this.CAPTCHA,
        callback: resonse => this.reCapchaSuccess(resonse),
        'expired-callback': () => this.reCapchaExpired()
      });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      subject: ['', Validators.required],
      message: ['', Validators.required]
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
      const { firstName, lastName, email, subject, message } = this.form.value;
      console.log(
        firstName + ' ' + lastName + ' ' + email + ' ' + subject + ' ' + message
      );

      if (
        firstName !== '' &&
        lastName !== '' &&
        email !== '' &&
        message !== ''
      ) {
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
      } else {
        // Show message error - Fill form fully
        this.flashService.show(
          'Erreur dans le formulaire, veuillez remplir les champs nécéssaires.',
          { cssClass: 'alert-danger', timeout: 2000 }
        );
      }
    }
  }
}
