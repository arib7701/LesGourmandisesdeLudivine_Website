import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.css']
})
export class FormErrorsComponent implements OnInit {
  @Input()
  inputParam: FormControl;

  constructor() {}

  ngOnInit() {}
}
