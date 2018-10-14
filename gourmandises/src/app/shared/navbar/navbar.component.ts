import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// TO DO
// remove /home of every route
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isHome: Boolean = true;
  isNotHome: Boolean = false;

  setClasses() {
    const classes = {
      homeNav: this.isHome,
      notHomeNav: this.isNotHome
    };
    return classes;
  }

  constructor(public router: Router) {
    this.router.events.subscribe(res => {
      if (this.router.url !== '/' && this.router.url !== '/home') {
        this.isNotHome = true;
        this.isHome = false;
      } else {
        this.isNotHome = false;
        this.isHome = true;
      }
    });
  }

  ngOnInit() {}
}
