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
  buyInfoFormStep1: FormGroup;
  buyInfoFormStep2: FormGroup;
  buyInfoFormStep3: FormGroup;
  calculatedPrice = 0.0;

  handler: any;
  amount: Number = 100;
  message: any;
  details: any;

  showStep1 = true;
  showStep2 = false;
  showStep3 = false;

  constructor(
    private firebase: AngularFireDatabase,
    private flashService: FlashMessagesService,
    private paymentService: PaymentService
  ) {
    this.createForms();
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
    // this.grecaptcha = (window as any).grecaptcha;

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
    /*if (this.grecaptcha) {
      this._reCaptchaId = this.grecaptcha.render(
        this.captchaRef3.nativeElement,
        {
          sitekey: this.CAPTCHA,
          callback: response => this.reCapchaSuccess(response),
          'expired-callback': () => this.reCapchaExpired()
        }
      );
    }*/
  }

  createForms() {
    this.buyInfoFormStep1 = new FormGroup({
      quantity: new FormControl('', [Validators.required]),
      event: new FormControl('', [Validators.required]),
      perfum: new FormControl('nature', [Validators.required]),
      form: new FormControl('rectangulaire', [Validators.required]),
      decoration: new FormControl(false),
      gluten: new FormControl(false),
      lactose: new FormControl(false)
    });

    this.buyInfoFormStep2 = new FormGroup({
      row1: new FormControl('', [
        Validators.required,
        Validators.maxLength(12)
      ]),
      row2: new FormControl('', [Validators.maxLength(12)]),
      row3: new FormControl('', [Validators.maxLength(12)])
    });

    this.buyInfoFormStep3 = new FormGroup({});

    this.buyInfoFormStep1.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

  calculatePrice() {
    const pricePerBiscuit = 1.2;
    const numberBiscuits: number = +this.buyInfoFormStep1.value.quantity;

    this.calculatedPrice = pricePerBiscuit * numberBiscuits;

    if (this.buyInfoFormStep1.value.decoration) {
      this.calculatedPrice += 0.5 * numberBiscuits;
    }

    if (this.buyInfoFormStep1.value.gluten) {
      this.calculatedPrice += 0.5 * numberBiscuits;
    }

    if (this.buyInfoFormStep1.value.lactose) {
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
      description: 'Biscuits Personnalisés',
      currency: 'eur',
      amount: this.amount
    });
  }

  processFormStep1() {
    this.details = this.buyInfoFormStep1.value;
    this.showStep1 = false;
    this.showStep2 = true;
  }

  processFormStep2() {
    this.message = this.buyInfoFormStep2.value;
    this.showStep2 = false;
    this.showStep3 = true;
  }

  processFormStep3() {
    /* if (!this.captcha) {
      // Show message error - Fill form fully
      this.flashService.show('Veuillez faire le captcha.', {
        cssClass: 'alert-danger',
        timeout: 2000
      });
    } else {
      this.handlePayment();
    } */
    this.handlePayment();
  }

  returnStep1() {
    this.showStep2 = false;
    this.showStep1 = true;
  }

  returnStep2() {
    this.showStep3 = false;
    this.showStep2 = true;
  }

  get quantity() {
    return this.buyInfoFormStep1.get('quantity');
  }
  get event() {
    return this.buyInfoFormStep1.get('event');
  }
  get perfum() {
    return this.buyInfoFormStep1.get('perfum');
  }
  get form() {
    return this.buyInfoFormStep1.get('form');
  }
  get decoration() {
    return this.buyInfoFormStep1.get('decoration');
  }
  get gluten() {
    return this.buyInfoFormStep1.get('gluten');
  }
  get lactose() {
    return this.buyInfoFormStep1.get('lactose');
  }
  get row1() {
    return this.buyInfoFormStep2.get('row1');
  }
  get row2() {
    return this.buyInfoFormStep2.get('row2');
  }
  get row3() {
    return this.buyInfoFormStep2.get('row3');
  }
}
