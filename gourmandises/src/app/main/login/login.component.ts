import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {}

  onSubmit() {
    this.authService
      .login(this.email, this.password)
      .then(res => {
        this.router.navigate(['/admin']);
      })
      .catch(err => {
        this.router.navigate(['/home/login']);
      });
  }
}
