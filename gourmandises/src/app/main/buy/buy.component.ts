import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PaymentService } from 'src/app/services/payment.service';

declare var StripeCheckout: any;

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit, AfterViewInit {
  @ViewChild('captchaRef2')
  captchaRef3: ElementRef;
  captcha: Boolean = false;
  grecaptcha: any;
  _reCaptchaId: number;
  CAPTCHA = environment.CAPTCHA_SITE_ID;

  infos: any[];
  buyInfoForm: FormGroup;
  calculatedPrice = 0.0;

  handler: any;
  amount: Number = 100;
  message: any;
  details: any;

  constructor(
    private firebase: AngularFireDatabase,
    private flashService: FlashMessagesService,
    private paymentService: PaymentService
  ) {
    this.createForm();
  }

  @HostListener('window: popstate')
  onPopstate() {
    this.handler.close();
    // Show message success
    this.flashService.show('Votre commande a bien été envoyé.', {
      cssClass: 'alert-success',
      timeout: 2000
    });
  }

  ngOnInit() {
    this.grecaptcha = (window as any).grecaptcha;

    this.handler = StripeCheckout.configure({
      key: environment.stripePublishedKey,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      panelLabel: 'Paiement',
      billingAddress: true,
      shippingAddress: true,
      allowRememberMe: false,
      token: token => {
        this.paymentService.processPayment(
          token,
          this.amount,
          this.details,
          this.message
        );
      }
    });
  }

  ngAfterViewInit() {
    if (this.grecaptcha) {
      this._reCaptchaId = this.grecaptcha.render(
        this.captchaRef3.nativeElement,
        {
          sitekey: this.CAPTCHA,
          callback: response => this.reCapchaSuccess(response),
          'expired-callback': () => this.reCapchaExpired()
        }
      );
    }
  }

  createForm() {
    this.buyInfoForm = new FormGroup({
      quantity: new FormControl('', [Validators.required]),
      event: new FormControl('', [Validators.required]),
      perfum: new FormControl('nature', [Validators.required]),
      form: new FormControl('rectangulaire', [Validators.required]),
      decoration: new FormControl(false),
      gluten: new FormControl(false),
      lactose: new FormControl(false),
      row1: new FormControl('', [
        Validators.required,
        Validators.maxLength(12)
      ]),
      row2: new FormControl('', [Validators.maxLength(12)]),
      row3: new FormControl('', [Validators.maxLength(12)])
    });

    this.buyInfoForm.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

  calculatePrice() {
    const pricePerBiscuit = 1.2;
    const numberBiscuits: number = +this.buyInfoForm.value.quantity;

    this.calculatedPrice = pricePerBiscuit * numberBiscuits;

    if (this.buyInfoForm.value.decoration) {
      this.calculatedPrice += 0.5 * numberBiscuits;
    }

    if (this.buyInfoForm.value.gluten) {
      this.calculatedPrice += 0.5 * numberBiscuits;
    }

    if (this.buyInfoForm.value.lactose) {
      this.calculatedPrice += 0.5 * numberBiscuits;
    }

    this.amount = this.calculatedPrice * 100;
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

  handlePayment() {
    this.handler.open({
      name: 'Les Gourmandises de Ludivine',
      description: 'Commande de Biscuits Personnalises',
      currency: 'eur',
      amount: this.amount
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
        quantity,
        event,
        perfum,
        form,
        decoration,
        gluten,
        lactose,
        row1,
        row2,
        row3
      } = this.buyInfoForm.value;
      this.message = { row1, row2, row3 };
      this.details = {
        quantity,
        event,
        perfum,
        form,
        decoration,
        gluten,
        lactose
      };
      this.handlePayment();
    }
  }

  get quantity() {
    return this.buyInfoForm.get('quantity');
  }
  get event() {
    return this.buyInfoForm.get('event');
  }
  get perfum() {
    return this.buyInfoForm.get('perfum');
  }
  get form() {
    return this.buyInfoForm.get('form');
  }
  get decoration() {
    return this.buyInfoForm.get('decoration');
  }
  get gluten() {
    return this.buyInfoForm.get('gluten');
  }
  get lactose() {
    return this.buyInfoForm.get('lactose');
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
