import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  isLoggedIn: Boolean = false;
  isPage: Boolean = true;
  path: string;
  pathParts: string[];
  component: string;
  id: string;
  subscriptionRoute: Subscription;
  subscriptionStatus: Subscription;

  constructor(public router: Router, public authService: AuthService) {}

  ngOnInit() {
    this.subscriptionRoute = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.path = event.url;
        this.pathParts = this.path.split('/');

        // Only Show Edit link if page editable
        if (this.pathParts[3] === undefined || this.pathParts[3] === 'edit') {
          this.isPage = false;
        } else {
          this.isPage = true;
        }

        this.component = `/admin/${this.pathParts[2]}/edit/`;
        this.id = this.pathParts[3];
      }
    });

    this.subscriptionStatus = this.authService.getStatus().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscriptionRoute.unsubscribe();
    this.subscriptionStatus.unsubscribe();
  }
}
