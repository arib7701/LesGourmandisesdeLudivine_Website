import { Component, OnInit } from '@angular/core';
import * as Typed from 'typed.js';

@Component({
  selector: 'app-buy-home',
  templateUrl: './buy-home.component.html',
  styleUrls: ['./buy-home.component.css', './buy-home.component.scss']
})
export class BuyHomeComponent implements OnInit {
  typed1: any;
  typed2: any;
  typed3: any;
  topRow1: any;
  topRow2: any;
  topRow3: any;

  constructor() {}

  ngOnInit() {
    this.printMessage();
  }

  printMessage() {
    const _Typed: any = Typed;
    let options = null;
    let row_text;

    row_text = [
      'CHOISISSEZ <br> VOTRE  <br>  MESSAGE',
      'BISCUITS  <br>  PERSONNALISES  <br>  A CROQUER',
      'A PARTAGER  <br>  SANS  <br>  MODERATION',
      // tslint:disable-next-line:quotemark
      "POUR ACHETER <br> CLIQUEZ SUR <br> L'ICONE ROSE"
    ];
    options = {
      strings: row_text,
      typeSpeed: 100,
      loop: true,
      showCursor: false
    };

    this.typed1 = new _Typed(`.typed${1}`, options);
  }
}
