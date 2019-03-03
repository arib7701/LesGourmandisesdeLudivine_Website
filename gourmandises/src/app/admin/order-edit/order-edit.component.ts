import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit, OnDestroy {
  id: string;
  order: Order;
  subscriptionOrder: Subscription;
  withMessage = true;

  constructor(
    private orderService: OrdersService,
    private flashService: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.order = new Order();

    this.subscriptionOrder = this.orderService
      .getOneOrder(this.id)
      .valueChanges()
      .subscribe(order => {
        this.order = order;

        if (this.order.details.paint) {
          this.withMessage = false;
        } else {
          this.withMessage = true;
        }
      });
  }

  ngOnInit() {}

  onSubmit() {
    if (!this.order.details.paint && this.order.message.row1 === '') {
      this.flashService.show('Vérifier tous vos champs.', {
        cssClass: 'alert-danger',
        timeout: 2000
      });
    } else {
      this.order.message.row2 = '';
      this.order.message.row3 = '';

      this.orderService.editOrder(this.id, this.order as Order[]);

      this.flashService.show('Changements sauvegardés!', {
        cssClass: 'alert-success',
        timeout: 2000
      });
      this.router.navigate(['/admin/orders/edit/' + this.id]);
    }
  }

  ngOnDestroy() {
    if (this.subscriptionOrder) {
      this.subscriptionOrder.unsubscribe();
    }
  }
}
