import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { ShipUgfBaseExtension } from '../../providers/ship-ugf-sfs/shipugf-base-extension';
import { ShipUgfSFSCmd } from '../../providers/ship-ugf-sfs/shipugf-cmd';
import { OrderBean } from '../../providers/classes/order-bean';
import { ORDER_TYPE } from '../../providers/app-module/app-constants';
import { Utils } from '../../providers/core/app/utils';

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
  @ViewChild(Content) myContent: Content;

  listOrder: Array<OrderBean> = [];
  listOrderFilter: Array<OrderBean> = [];

  filterSelected: number = -1;

  page: number = 0;
  nextPage: number = -1;

  searchQuery: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) {
  }

  onLoadData() {
    ShipUgfSFSConnector.getInstance().sendRequestUSER_GET_LIST_ORDER(this.page, this.filterSelected);
  }

  ionViewDidLoad() {
    if (!this.mAppModule.isLogin) {
      this.mAppModule.goToLoadingPage();
      return;
    }
    this.mAppModule._LoadAppConfig().then(() => {
      ShipUgfSFSConnector.getInstance().addListener("MainPage", response => {
        this.onExtensionResponse(response);
      });
      this.onLoadData();
    });
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
      else if (cmd == ShipUgfSFSCmd.USER_GET_LIST_ORDER) {
        this.onExtensionUSER_GET_LIST_ORDER(data);
      }
      else if (cmd == ShipUgfSFSCmd.USER_ADD_ORDER) {
        this.onExtensionUSER_ADD_ORDER(data);
      }
      else if (cmd == ShipUgfSFSCmd.USER_DELETE_ORDER) {
        this.onExtensionUSER_DELETE_ORDER(data);
      }
    }
  }

  onExtensionUSER_GET_INFO(data) {
    console.log(data);

  }

  onExtensionUSER_GET_LIST_ORDER(data) {
    this.mAppModule.hideLoading();
    if (data.array.length > 0) {
      this.page = data.page;
      if (data.nextPage) {
        this.nextPage = data.nextPage;
      } else {
        this.nextPage = -1;
      }
      if (data.page < 1) {
        this.listOrder = data.array;
        this.listOrderFilter = data.array;
      } else {
        this.listOrder = this.listOrder.concat(data.array);
        this.listOrderFilter = this.listOrder.concat(data.array);
      }
    } else {
      this.listOrder = [];
      this.listOrderFilter = [];
    }
  }

  onExtensionUSER_ADD_ORDER(data) {
    if (data) {
      this.listOrder.unshift(data);
    }
  }

  onExtensionUSER_DELETE_ORDER(data) {
    if (data) {
      let index = this.listOrder.findIndex(item => {
        return data.getOrderID() == item.getOrderID();
      });
      if (index > -1) {
        this.listOrder.splice(index, 1);
      }
    }
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
          this.mAppModule.showAlert(order.getCode(), res => {
            if (res == 1) {
              ShipUgfSFSConnector.getInstance().sendRequestUSER_DELETE_ORDER(order.getOrderID());
            }
          }, "Bạn có chắc muốn xóa đơn hàng này?")
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

  onClickFilter() {
    this.myContent.scrollToTop();
    let listRadio = [
      { id: -1, name: "Tất cả" },
      { id: 0, name: "Đang chờ xét duyệt" },
      { id: 1, name: "Đã xét duyệt" },
      { id: 2, name: "Đã hoàn thành" }
    ];
    this.mAppModule.showRadio("Loại đơn hàng", listRadio, this.filterSelected, res => {
      this.filterSelected = res;
      this.page = 0;
      this.mAppModule.showLoading();
      ShipUgfSFSConnector.getInstance().sendRequestUSER_GET_LIST_ORDER(this.page, this.filterSelected);
    });
  }

  onClickSearch() {
    if (this.searchQuery.trim() != "") {
      this.listOrder = this.listOrderFilter.filter(order => {
        return Utils.bodauTiengViet(order.getSenderName().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery)) ||
          Utils.bodauTiengViet(order.getSenderPhone().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery)) ||
          Utils.bodauTiengViet(order.getTargetName().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery)) ||
          Utils.bodauTiengViet(order.getTargetPhone().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery)) ||
          Utils.bodauTiengViet(order.getAddress().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery)) ||
          Utils.bodauTiengViet(order.getCode().toLowerCase()).includes(Utils.bodauTiengViet(this.searchQuery))
      });
    } else {
      this.listOrder = this.listOrderFilter;
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.nextPage > -1) {
        this.page = this.page + 1;
      }
      this.onLoadData();
      infiniteScroll.complete();
    }, 500);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.page = 0;
      this.onLoadData();
      refresher.complete();
    }, 1500);
  }

}
