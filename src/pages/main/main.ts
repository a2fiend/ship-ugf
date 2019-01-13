import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { ShipUgfBaseExtension } from '../../providers/ship-ugf-sfs/shipugf-base-extension';
import { ShipUgfSFSCmd } from '../../providers/ship-ugf-sfs/shipugf-cmd';
import { OrderBean } from '../../providers/classes/order-bean';
import { ORDER_TYPE } from '../../providers/app-module/app-constants';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  listOrder: Array<OrderBean> = [];

  filterSelected: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    this.onFakeListOrder();
    if (!this.mAppModule.isLogin) {
      this.mAppModule.goToLoadingPage();
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      ShipUgfSFSConnector.getInstance().addListener("MainPage", response => {
        this.onExtensionResponse(response);
      });

    })
  }

  ionViewWillUnload() {
    ShipUgfSFSConnector.getInstance().removeListener("MainPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (ShipUgfBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = ShipUgfBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == ShipUgfSFSCmd.USER_GET_INFO) {
        this.onExtensionUSER_GET_INFO(data);
      }
    }
  }

  onExtensionUSER_GET_INFO(data) {
    console.log(data);

  }

  onClickLogout() {
    this.mAppModule.doLogout();
    this.navCtrl.push("LoadingPage")
  }

  onTestRequest() {
    ShipUgfSFSConnector.getInstance().rendRequestUSER_GET_INFO();
  }

  onClickMore(order: OrderBean) {
    if (order.getState() == ORDER_TYPE.CONFIRMING) {
      let listAction = [
        { id: 1, name: "Xem đơn hàng" },
        { id: 2, name: "Sửa đơn hàng" },
        { id: 3, name: "Xóa đơn hàng" }
      ];
      this.mAppModule.showActionSheet(order.getCode(), listAction, res => {
        if (res == 1) {
          this.navCtrl.push("OrderDetailPage", { params: order });
        } else if (res == 2) {
          this.navCtrl.push("OrderAddPage", { params: order });
        } else if (res == 3) {

        }
      });
    }
    else if (order.getState() == ORDER_TYPE.COMPLETE || order.getState() == ORDER_TYPE.CONFIRMED) {
      this.navCtrl.push("OrderDetailPage", { params: order });
    }
  }

  onClickItem(order: OrderBean) {
    this.navCtrl.push("OrderDetailPage", { params: order });

  }

  onClickAddOrder() {
    this.navCtrl.push("OrderAddPage");
  }

  onFakeListOrder() {
    for (let i = 0; i < 10; i++) {
      let newOrder = new OrderBean();
      newOrder.setCode("UGF_ship_0000" + i);
      newOrder.setSenderName("Nguyễn Văn A" + i);
      newOrder.setTargetName("Nguyễn Văn B" + i);
      newOrder.setSenderPhone("0123456789");
      newOrder.setTargetPhone("0123456789");
      newOrder.setAddress("Số 1 Đại Cồ Việt");
      newOrder.setState(Math.floor(Math.random() * 3) + 1);

      this.listOrder.push(newOrder);
    }

    console.log(this.listOrder);

  }

  onClickFilter() {
    let listRadio = [
      { id: 1, name: "Tất cả" },
      { id: 2, name: "Đang chờ xét duyệt" },
      { id: 3, name: "Đã xét duyệt" },
      { id: 4, name: "Đã hoàn thành" }
    ];
    this.mAppModule.showRadio("Loại đơn hàng", listRadio, this.filterSelected, res => {
      this.filterSelected = res;

    })
  }

}
