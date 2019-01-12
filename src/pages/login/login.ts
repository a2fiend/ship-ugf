import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LOGIN_TYPE, CONNECT_STATE } from '../../providers/app-module/app-constants';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { UserInfo } from '../../providers/classes/user-info';

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
  ) {
  }


  onClickLogin() {
    this.loginType = LOGIN_TYPE.USERNAME_PASSWORD;
    if (ShipUgfSFSConnector.getInstance().getSFSState() == CONNECT_STATE.STATE_CONNECTING) {
      this.doLogin();
    } else {
      this.doConnectToServer();
    }
  }

  doLogin() {
    let userInfo = new UserInfo();
    userInfo.setUsername(this.username);
    userInfo.setPassword(this.password);

    this.mAppModule.doLogin(userInfo).then(data => {
      this.mAppModule.onLoginSuccess(data);
      this.mAppModule.doSaveUserInfoIntoStorage(userInfo);
      this.navCtrl.push("MainPage");
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
