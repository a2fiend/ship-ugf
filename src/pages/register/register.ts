import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserBean } from '../../providers/classes/user-bean';
import { AppModuleProvider } from '../../providers/app-module/app-module';

import md5 from 'md5';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { ShipUgfBaseExtension } from '../../providers/ship-ugf-sfs/shipugf-base-extension';
import { ShipUgfSFSCmd } from '../../providers/ship-ugf-sfs/shipugf-cmd';
import { UserInfo } from '../../providers/classes/user-info';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  username: string = "";
  password: string = "";
  rePassword: string = "";

  mUser: UserBean = new UserBean();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mViewController: ViewController,
    public mAppModule: AppModuleProvider
  ) {
  }

  ionViewDidLoad() {
    this.mAppModule._LoadAppConfig().then(() => {
      ShipUgfSFSConnector.getInstance().addListener("RegisterPage", response => {
        this.onExtensionResponse(response);
      });

    });
  }

  ionViewWillUnload() {
    ShipUgfSFSConnector.getInstance().removeListener("RegisterPage");
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;
    if (ShipUgfBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = ShipUgfBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == ShipUgfSFSCmd.USER_REGISTER) {
        this.onExtensionUSER_REGISTER(data);
      }
    }
  }

  onExtensionUSER_REGISTER(data) {
    this.mAppModule.hideLoading();
    if (data) {
      this.mAppModule.showToast("Đăng ký thành công!");
      let userInfo = new UserInfo();
      userInfo.setUsername(this.username);
      userInfo.setPassword(this.rePassword);

      this.mViewController.dismiss(userInfo);
    }

  }

  onClickClose() {
    this.mViewController.dismiss();
  }

  onClickRegister() {
    if (this.password.trim() != "" && this.username.trim() != "" && (this.password.trim() == this.rePassword.trim())) {
      this.mUser.setPassword(md5(this.rePassword));
      this.mUser.setName(this.username);
      this.mUser.setUsername(this.username);

      this.mAppModule.showLoading().then(() => {
        ShipUgfSFSConnector.getInstance().sendRequestUSER_REGISTER(this.mUser)
      })
    }
    else if (this.password.trim() != this.rePassword.trim()) {
      this.mAppModule.showToast("Xác nhận mật khẩu chưa đúng");
    }
    else {
      this.mAppModule.showToast("Bạn chưa điền đủ thông tin đăng ký");
    }
  }

}
