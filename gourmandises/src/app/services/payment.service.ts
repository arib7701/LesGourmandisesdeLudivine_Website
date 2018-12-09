import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private firebase: AngularFireDatabase) {}

  processPayment(
    token: any,
    amount: Number,
    details: any,
    message: any,
    date: number
  ) {
    const order = { token, amount, details, message, date };
    return this.firebase.list(`/orders`).push(order);
  }
}
