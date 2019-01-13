import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { OrderBean } from '../../providers/classes/order-bean';

import moment from 'moment';

/**
 * Generated class for the OrderAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-add',
  templateUrl: 'order-add.html',
})
export class OrderAddPage {
  mDate: string = moment().format("YYYY-MM-DD");
  mTime: string = moment().format("HH:mm");

  saveType: number = 1;

  mOrder: OrderBean = new OrderBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.saveType = 2;
      this.mOrder = this.navParams.get("params");
    }
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.goToLoadingPage();
      return;
    }
  }

  onDateChange() {
    this.mOrder.setTimeSend(new Date(this.mDate + " " + this.mTime).getTime());
  }

  onTimeChange() {
    this.mOrder.setTimeSend(new Date(this.mDate + " " + this.mTime).getTime());
  }

  onClickCreateOrder() {
    console.log(this.mOrder);

  }

  onClickSaveOrder() {
    console.log(this.mOrder);

  }

}
