import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LOGIN_TYPE } from '../../providers/app-module/app-constants';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { UserInfo } from '../../providers/classes/user-info';
import { SFSConnector } from '../../providers/core/smartfox/sfs-connector';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string = "";
  password: string = "";

  loginType: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
  ) { }


  onClickLogin() {
    this.loginType = LOGIN_TYPE.USERNAME_PASSWORD;
    if (ShipUgfSFSConnector.getInstance().getSFSState() == SFSConnector.STATE_CONNECTING) {
      this.doLogin();
    } else {
      this.doConnectToServer();
    }
  }

  onClickRegister() {
    this.loginType = LOGIN_TYPE.DEVICE;
    if (ShipUgfSFSConnector.getInstance().getSFSState() == SFSConnector.STATE_CONNECTED) {
      if (!this.mAppModule.isLogin) {
        this.doLogin();
      } else {
        this.goToRegisterPage();
      }
    }
  }

  doLogin() {
    let userInfo = new UserInfo();
    userInfo.setUsername(this.username);
    userInfo.setPassword(this.password);

    if (!this.mAppModule.isLogin) {
      this.mAppModule.doLogin(userInfo, this.loginType).then(data => {
        this.onLoginSucess(userInfo, data);
      });
    }
  }

  onLoginSucess(userInfo: UserInfo, data) {
    this.mAppModule.onLoginSuccess(data);

    if (this.loginType == LOGIN_TYPE.USERNAME_PASSWORD) {
      this.mAppModule.showToast("Đăng nhập thành công");
      this.mAppModule.doSaveUserInfoIntoStorage(userInfo);
      this.navCtrl.push("MainPage");
    } else if (this.loginType == LOGIN_TYPE.DEVICE) {
      this.goToRegisterPage();
    }
  }

  goToRegisterPage() {
    this.mAppModule.showModal("RegisterPage", null, data => {
      if (data) {
        this.loginType = LOGIN_TYPE.USERNAME_PASSWORD;
        this.username = data.getUsername();
        this.password = data.getPassword();

        ShipUgfSFSConnector.getInstance().disconnect().then(() => {
          this.mAppModule.isLogin = false;
          this.doConnectToServer();
        });
      }
    });
  }

  doConnectToServer() {
    ShipUgfSFSConnector.getInstance().connect().then(() => {
      this.doLogin();
    }).catch(err => {
      // cant connect to server
    })
  }

}
