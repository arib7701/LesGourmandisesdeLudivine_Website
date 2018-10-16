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
  showReal: Boolean = true;
  showRecipe: Boolean = false;
  showGallery: Boolean = false;
  showPartners: Boolean = false;

  constructor() {}

  ngOnInit() {}

  storeNewReal(real: Real) {
    this.newReal = real;
    this.showRecipe = true;
    this.showReal = false;
  }
}
