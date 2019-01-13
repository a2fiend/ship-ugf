import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';

import { HttpClient } from '@angular/common/http';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LOGIN_TYPE } from '../../providers/app-module/app-constants';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { UserInfo } from '../../providers/classes/user-info';
import { SFSConnector } from '../../providers/core/smartfox/sfs-connector';

/**
 * Generated class for the LoadingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  userInfo: UserInfo = new UserInfo();

  public mState = SFSConnector.STATE_DISCONNECTED;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mPlatform: Platform,
    public mSplashScreen: SplashScreen,
    public mCamera: Camera,
    public mHttpClient: HttpClient,
    public mFileTransfer: FileTransfer,

  ) {
    this.mPlatform.ready().then(() => {
      this.mSplashScreen.hide();
      this.onPlatformReady();
    });
    UploadFileModule.getInstance()._initiallize(mCamera, mFileTransfer, mHttpClient);
  }

  onPlatformReady() {
    DeviceManager.getInstance().setInMobileDevice(!(this.mPlatform.is('core') || this.mPlatform.is('mobileweb')));
    if (DeviceManager.getInstance().isInMobileDevice()) {
      DeviceManager.getInstance().setPlatform(this.mPlatform.is("android") ? 1 : 2);
    }
    this.doLoadAppConfig();
  }

  doLoadAppConfig() {
    this.mAppModule._LoadAppConfig().then(() => {
      this.doConnectToServer();
    }).catch(() => {
      this.mSplashScreen.hide();
      this.mAppModule.hideLoading();
      //load appconfig fail;
    })
  }

  doConnectToServer() {
    ShipUgfSFSConnector.getInstance().connect().then(() => {
      this.mState = SFSConnector.STATE_CONNECTED;
      this.mAppModule.doLoadUserInfoFromStorage().then(userinfo => {
        if (userinfo) {
          let userinfoObj = JSON.parse(userinfo);
          this.userInfo.fromObject(userinfoObj);
          this.mAppModule.doLogin(this.userInfo, LOGIN_TYPE.USERNAME_PASSWORD).then(data => {
            this.mAppModule.onLoginSuccess(data);
            this.navCtrl.push("MainPage");
          }, error => { });
        }
        else {
          this.doSwitchToLoginPage();
        }
      })
    }).catch((err) => {
      this.mSplashScreen.hide();
      //connect server fail;
    });
  }

  doSwitchToMainPage() {
    this.navCtrl.setRoot("MainPage", {}, {
      animate: false,
    });
  }

  doSwitchToLoginPage() {
    this.navCtrl.setRoot("LoginPage");
  }

}
