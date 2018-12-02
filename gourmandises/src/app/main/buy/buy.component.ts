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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as Typed from 'typed.js';

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

  debounce = 2000;
  typed1: any;
  typed2: any;
  typed3: any;

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

    this.buyInfoFormStep2
      .get('row1')
      .valueChanges.pipe(
        debounceTime(this.debounce),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.printMessage(1);
      });
    this.buyInfoFormStep2
      .get('row2')
      .valueChanges.pipe(
        debounceTime(this.debounce),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.printMessage(2);
      });
    this.buyInfoFormStep2
      .get('row3')
      .valueChanges.pipe(
        debounceTime(this.debounce),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.printMessage(3);
      });
  }

  calculatePrice() {
    const pricePerBiscuit = 0.8;
    const numberBiscuits: number = +this.buyInfoFormStep1.value.quantity;

    this.calculatedPrice = pricePerBiscuit * numberBiscuits;

    if (this.buyInfoFormStep1.value.decoration) {
      this.calculatedPrice += 0.2 * numberBiscuits;
    }

    if (this.buyInfoFormStep1.value.gluten) {
      this.calculatedPrice += 0.2 * numberBiscuits;
    }

    if (this.buyInfoFormStep1.value.lactose) {
      this.calculatedPrice += 0.2 * numberBiscuits;
    }

    this.amount = this.calculatedPrice * 100;
  }

  printMessage(index) {
    const _Typed: any = Typed;
    let row_text: string;
    let options = null;

    if (index === 1) {
      if (this.typed1 !== undefined) {
        this.typed1.reset();
      }

      row_text = this.buyInfoFormStep2.value.row1;
      if (row_text !== null) {
        options = {
          strings: [row_text.toUpperCase()],
          typeSpeed: 100,
          loop: false,
          showCursor: false
        };
      }
      this.typed1 = new _Typed('.typed1', options);
    } else if (index === 2) {
      if (this.typed2 !== undefined) {
        this.typed2.reset();
      }

      row_text = this.buyInfoFormStep2.value.row2;
      if (row_text !== null) {
        options = {
          strings: [row_text.toUpperCase()],
          typeSpeed: 100,
          loop: false,
          showCursor: false
        };
      }
      this.typed2 = new _Typed('.typed2', options);
    } else {
      if (this.typed3 !== undefined) {
        this.typed3.reset();
      }
      row_text = this.buyInfoFormStep2.value.row3;
      if (row_text !== null) {
        options = {
          strings: [row_text.toUpperCase()],
          typeSpeed: 100,
          loop: false,
          showCursor: false
        };
      }
      this.typed3 = new _Typed('.typed3', options);
    }
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
