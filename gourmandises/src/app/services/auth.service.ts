import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public firebaseAuth: AngularFireAuth) {}

  // Log User
  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(userData => resolve(userData), err => reject(err));
    });
  }

  // Check user status
  getStatus() {
    return this.firebaseAuth.authState.pipe(map(auth => auth));
  }

  // Logout user
  logout() {
    this.firebaseAuth.auth.signOut();
  }
}
