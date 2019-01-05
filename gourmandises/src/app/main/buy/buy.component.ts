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
  date = Date.now();

  debounce = 2000;
  typed1: any;
  typed2: any;
  typed3: any;
  topRow1: any;
  topRow2: any;
  topRow3: any;
  smallTopRow1: any;
  smallTopRow2: any;
  smallTopRow3: any;

  showStep1 = true;
  showStep2 = false;
  showStep3 = false;

  constructor(
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
      locale: 'fr',
      panelLabel: 'Paiement',
      billingAddress: true,
      shippingAddress: true,
      allowRememberMe: false,
      token: token => {
        this.paymentService.processPayment(
          token,
          this.amount,
          this.details,
          this.message,
          this.date
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

  handlePayment() {
    this.handler.open({
      name: 'Les Gourmandises de Ludivine',
      description: 'Biscuits Personnalisés',
      currency: 'eur',
      amount: this.amount
    });
  }

  createForms() {
    this.buyInfoFormStep1 = new FormGroup({
      quantity: new FormControl('', [Validators.required]),
      event: new FormControl('', [Validators.required]),
      perfum: new FormControl('nature', [Validators.required]),
      decoration: new FormControl(false)
      // form: new FormControl('rectangulaire', [Validators.required]),
      // gluten: new FormControl(false),
      // lactose: new FormControl(false)
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

    for (let i = 1; i < 4; i++) {
      this.buyInfoFormStep2
        .get(`row${i}`)
        .valueChanges.pipe(
          debounceTime(this.debounce),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.printMessage(i);
        });
    }
  }

  calculatePrice() {
    let pricePerBiscuit;
    const numberBiscuits: number = +this.buyInfoFormStep1.value.quantity;

    if (numberBiscuits >= 50) {
      pricePerBiscuit = 1.0;
    } else if (numberBiscuits >= 20) {
      pricePerBiscuit = 1.25;
    } else {
      pricePerBiscuit = 1.5;
    }

    this.calculatedPrice = pricePerBiscuit * numberBiscuits;

    if (this.buyInfoFormStep1.value.decoration) {
      this.calculatedPrice += 0.2 * numberBiscuits;
    }

    /*
    if (this.buyInfoFormStep1.value.gluten) {
      this.calculatedPrice += 0.2 * numberBiscuits;
    }

    if (this.buyInfoFormStep1.value.lactose) {
      this.calculatedPrice += 0.2 * numberBiscuits;
    }
    */

    this.amount = this.calculatedPrice * 100;
  }

  printMessage(index) {
    const _Typed: any = Typed;
    let options = null;

    let typedVar;
    let row_text;
    let htmlVar;

    switch (index) {
      case 1:
        typedVar = this.typed1;
        row_text = this.buyInfoFormStep2.value.row1;
        htmlVar = `.typed${1}`;
        options = this.setUpOptionsTyped(typedVar, row_text, options);
        this.setUpPosition();

        if (options !== null) {
          this.typed1 = new _Typed(htmlVar, options);
        } else {
          this.typed1.destroy();
        }
        break;

      case 2:
        typedVar = this.typed2;
        row_text = this.buyInfoFormStep2.value.row2;
        htmlVar = `.typed${2}`;
        options = this.setUpOptionsTyped(typedVar, row_text, options);
        this.setUpPosition();

        if (options !== null) {
          this.typed2 = new _Typed(htmlVar, options);
        } else {
          this.typed2.destroy();
        }

        break;

      case 3:
        typedVar = this.typed3;
        row_text = this.buyInfoFormStep2.value.row3;
        htmlVar = `.typed${3}`;
        options = this.setUpOptionsTyped(typedVar, row_text, options);
        this.setUpPosition();

        if (options !== null) {
          this.typed3 = new _Typed(htmlVar, options);
        } else {
          this.typed3.destroy();
        }

        break;

      default:
        break;
    }
  }

  setUpOptionsTyped(typedVar, row_text, options): any {
    if (typedVar !== undefined) {
      typedVar.destroy();
    }

    if (row_text !== '') {
      options = {
        strings: [row_text.toUpperCase()],
        typeSpeed: 100,
        loop: false,
        showCursor: false
      };
    } else if (this.message !== null) {
      options = {
        strings: [this.message.row1, this.message.row2],
        typeSpeed: 100,
        loop: false,
        showCursor: false
      };
    }
    return options;
  }

  setUpPosition() {
    const rowValue1 = this.buyInfoFormStep2.value.row1;
    const rowValue2 = this.buyInfoFormStep2.value.row2;
    const rowValue3 = this.buyInfoFormStep2.value.row3;

    if (
      (rowValue1 !== '' && rowValue2 === '' && rowValue3 === '') ||
      (rowValue1 === '' && rowValue2 !== '' && rowValue3 === '') ||
      (rowValue1 === '' && rowValue2 === '' && rowValue3 !== '')
    ) {
      this.topRow1 = null;
      this.topRow2 = null;
      this.topRow3 = null;
      this.smallTopRow1 = null;
      this.smallTopRow2 = null;
      this.smallTopRow3 = null;
    } else if (rowValue1 !== '' && rowValue2 !== '' && rowValue3 === '') {
      this.topRow1 = '80';
      this.topRow2 = '160';
      this.topRow3 = null;
      this.smallTopRow1 = '50';
      this.smallTopRow2 = '90';
      this.smallTopRow3 = null;
    } else if (rowValue1 !== '' && rowValue2 === '' && rowValue3 !== '') {
      this.topRow1 = '80';
      this.topRow2 = null;
      this.topRow3 = '160';
      this.smallTopRow1 = '50';
      this.smallTopRow2 = null;
      this.smallTopRow3 = '90';
    } else if (rowValue1 === '' && rowValue2 !== '' && rowValue3 !== '') {
      this.topRow1 = null;
      this.topRow2 = '80';
      this.topRow3 = '160';
      this.smallTopRow1 = null;
      this.smallTopRow2 = '50';
      this.smallTopRow3 = '90';
    } else if (rowValue1 !== '' && rowValue2 !== '' && rowValue3 !== '') {
      this.topRow1 = '60';
      this.topRow2 = '120';
      this.topRow3 = '180';
      this.smallTopRow1 = '50';
      this.smallTopRow2 = '80';
      this.smallTopRow3 = '110';
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

    setTimeout(() => {
      this.printMessage(1);
    }, 2000);
    setTimeout(() => {
      this.printMessage(2);
    }, 3000);
    setTimeout(() => {
      this.printMessage(3);
    }, 4000);
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
  get decoration() {
    return this.buyInfoFormStep1.get('decoration');
  }
  /*
  get form() {
    return this.buyInfoFormStep1.get('form');
  }
  get gluten() {
    return this.buyInfoFormStep1.get('gluten');
  }
  get lactose() {
    return this.buyInfoFormStep1.get('lactose');
  }*/
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
