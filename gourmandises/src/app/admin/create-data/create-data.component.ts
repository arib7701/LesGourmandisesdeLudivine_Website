import { Component, OnInit } from '@angular/core';
import { Real } from 'src/app/models/real';

@Component({
  selector: 'app-create-data',
  templateUrl: './create-data.component.html',
  styleUrls: ['./create-data.component.css']
})
export class CreateDataComponent implements OnInit {
  newReal: Real;

  // Boolean to View Forms
  showReal: Boolean = false;
  showRecipe: Boolean = false;
  showGallery: Boolean = false;
  showPartner: Boolean = false;
  showActu: Boolean = true;

  constructor() {}

  ngOnInit() {}

  storeNewReal(real: Real) {
    this.newReal = real;
    this.showGallery = true;
    this.showReal = false;
  }

  changeView(view: string) {
    if (view === 'fromactu') {
      this.showActu = false;
      this.showReal = true;
    } else if (view === 'recipe') {
      this.showGallery = false;
      this.showRecipe = true;
    } else if (view === 'partner') {
      this.showRecipe = false;
      this.showPartner = true;
    } else if (view === 'real') {
      this.showPartner = false;
      this.showActu = true;
    }
  }
}
