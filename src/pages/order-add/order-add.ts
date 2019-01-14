import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { OrderBean } from '../../providers/classes/order-bean';

import moment from 'moment';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { ShipUgfBaseExtension } from '../../providers/ship-ugf-sfs/shipugf-base-extension';
import { ShipUgfSFSCmd } from '../../providers/ship-ugf-sfs/shipugf-cmd';

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
    this.mAppModule._LoadAppConfig().then(() => {
      ShipUgfSFSConnector.getInstance().addListener("OrderAddPage", response => {
        this.onExtensionResponse(response);
      });

    });
  }

  ionViewWillUnload() {
    ShipUgfSFSConnector.getInstance().removeListener("OrderAddPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (ShipUgfBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = ShipUgfBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == ShipUgfSFSCmd.USER_ADD_ORDER) {
        this.onExtensionUSER_ADD_ORDER(data);
      }
    }
  }

  onExtensionUSER_ADD_ORDER(data) {
    if(data) {
      this.mAppModule.showToast("Tạo đơn hàng thành công");
      
    }

  }

  onDateChange() {
    this.mOrder.setTimeSend(new Date(this.mDate + " " + this.mTime).getTime());
  }

  onTimeChange() {
    this.mOrder.setTimeSend(new Date(this.mDate + " " + this.mTime).getTime());
  }

  onClickCreateOrder() {
    ShipUgfSFSConnector.getInstance().rendRequestUSER_ADD_ORDER(this.mOrder);
  }

  onClickSaveOrder() {
    console.log(this.mOrder);

  }

}
