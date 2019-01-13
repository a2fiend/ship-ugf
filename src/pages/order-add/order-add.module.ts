import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderAddPage } from './order-add';

@NgModule({
  declarations: [
    OrderAddPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderAddPage),
  ],
})
export class OrderAddPageModule {}
