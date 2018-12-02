import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from 'angularfire2/database';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  manyOrders: AngularFireList<Order[]>;
  oneOrder: AngularFireObject<Order>;

  constructor(private firebase: AngularFireDatabase) {}

  // Get ALL Orders
  getAllOrders(): AngularFireList<Order[]> {
    return (this.manyOrders = this.firebase.list('/orders') as AngularFireList<
      Order[]
    >);
  }

  // Get ONE Order By Id
  getOneOrder(id: string): AngularFireObject<Order> {
    return (this.oneOrder = this.firebase.object(
      `/orders/${id}`
    ) as AngularFireObject<Order>);
  }

  // New Order - return ID
  createNewOrder(newOrder: Order[]): string {
    this.getAllOrders();
    const newRef = this.manyOrders.push(newOrder);
    const key = newRef.key;
    return key;
  }

  // Edit Order By ID
  editOrder(id: string, newOrder: Order[]): Promise<void> {
    this.getAllOrders();
    return this.manyOrders.update(id, newOrder);
  }

  // Delete Order by ID
  deleteOrder(id: string): Promise<void> {
    this.getAllOrders();
    return this.manyOrders.remove(id);
  }
}
