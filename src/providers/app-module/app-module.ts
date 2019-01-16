import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserBean } from '../classes/user-bean';
import { Http } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Platform, LoadingController, ToastController, AlertController, ModalController, Loading, App, ActionSheetController } from 'ionic-angular';
import { NetworkInterface } from '@ionic-native/network-interface';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { StorageController } from '../core/storage';
import { Storage } from '@ionic/storage';
import { WiadsHttpClient } from './wiads-http-client';
import { Config } from '../core/app/config';
import { NetworkConnectController } from '../core/network-connect/network-connect';
import { ParamsKey } from './paramskey';
import { UserInfo } from '../classes/user-info';
import { ShipUgfSFSConnector } from '../ship-ugf-sfs/shipugf-connector';
import { NetworkManager } from '../core/plugin/network-manager';
import { DeviceManager } from '../core/plugin/device-manager';
import { OneSignalManager } from '../core/plugin/onesignal-manager';
import { APPKEYS } from './app-constants';
import { DeviceInfo } from '../classes/device-info';
import { ShipUgfBaseExtension } from '../ship-ugf-sfs/shipugf-base-extension';
import { ShipUgfSFSCmd } from '../ship-ugf-sfs/shipugf-cmd';

@Injectable()
export class AppModuleProvider {

  private mUser: UserBean = new UserBean;
  newDeviceInfo = new DeviceInfo();

  isLogin = false;
  private mLoading: Loading = null;

  private mHttpClient: WiadsHttpClient;
  private mAppConfig: Config;
  private mNetworkController: NetworkConnectController = new NetworkConnectController();
  mStorageController: StorageController = null;

  constructor(
    public mApp: App,
    public http: HttpClient,
    public mAngularHttp: Http,
    public mNativeHttp: HTTP,
    private mPlatform: Platform,
    private mNetworkInterface: NetworkInterface,
    private mDevice: Device,
    private mOneSignal: OneSignal,
    private mNetwork: Network,
    public mStorage: Storage,
    private mLoadingController: LoadingController,
    private mToastController: ToastController,
    public mAlertController: AlertController,
    public mModalController: ModalController,
    private mActionSheetController: ActionSheetController,
  ) {
    this.mNetworkController._setNetwork(this.mNetwork);
    this.mHttpClient = new WiadsHttpClient();
    this.mAppConfig = new Config();
    this.mStorageController = new StorageController();
    this.mStorageController.setStorage(mStorage);
  }

  getHttpClient() {
    return this.mHttpClient;
  }

  getAppConfig() {
    return this.mAppConfig;
  }

  getStoreController() {
    return this.mStorageController;
  }

  public getUser(): UserBean {
    return this.mUser;
  }
  public setUser(user: UserBean) {
    this.mUser = user;
  }

  public goToLoadingPage() {
    this.mApp.getRootNav().setRoot("LoadingPage");
  }

  public _LoadAppConfig() {
    this.getHttpClient().createClient(this.mAngularHttp, this.mNativeHttp);
    return new Promise((resolve, reject) => {
      if (this.getAppConfig().hasData()) {
        return resolve();
      } else {
        this.getHttpClient().getAngularHttp().request("/assets/data/app.json").subscribe(response => {
          let dataObject = response.json();
          if (dataObject.config) {
            if (dataObject.config.get_config) {
              this.mPlatform.ready().then(() => {
                if (this.mPlatform.platforms().indexOf("android") && dataObject.config.android) {
                  this.getHttpClient().getAngularHttp().request(dataObject.config.android).subscribe(androidRes => {
                    this.onResponseConfig(androidRes.json());
                    return resolve();
                  }, error => {
                    this.onResponseConfig(dataObject);
                    return resolve();
                  });
                }
                if (this.mPlatform.platforms().indexOf("ios" && dataObject.config.ios)) {
                  this.getHttpClient().getAngularHttp().request(dataObject.config.ios).subscribe(iosRes => {
                    this.onResponseConfig(iosRes.json());
                    return resolve();
                  }, error => {
                    this.onResponseConfig(dataObject);
                    return resolve();
                  });
                }
              });
            }
            else {
              this.onResponseConfig(dataObject);
              return resolve();
            }
          }
        }, error => {
          return reject();
        });
      }
    })
  }

  private onResponseConfig(dataObject) {

    this.getAppConfig().setData(dataObject);
    this.mHttpClient.onResponseConfig(dataObject);
    ShipUgfSFSConnector.getInstance().setData(dataObject["smartfox"]);

    NetworkManager.getInstance().setData(dataObject["network"]);
    NetworkManager.getInstance().setNetworkInterface(this.mNetworkInterface);

    DeviceManager.getInstance().setData(dataObject["device"]);
    DeviceManager.getInstance().setDevice(this.mDevice);

    OneSignalManager.getInstance().setData(dataObject["onesignal"]);
    OneSignalManager.getInstance().setOneSignal(this.mOneSignal);
  }

  doLogin(userInfo: UserInfo, loginType: number) {
    return new Promise((resolve, reject) => {
      this.newDeviceInfo.setOnesignalID(OneSignalManager.getInstance().getOneSignalID())
      this.newDeviceInfo.setName(DeviceManager.getInstance().getDeviceName());
      this.newDeviceInfo.setPlatform(DeviceManager.getInstance().getPlatform());

      ShipUgfSFSConnector.getInstance().login(loginType, this.newDeviceInfo, userInfo).then((params) => {
        ShipUgfSFSConnector.getInstance().addListenerForExtensionResponse();
        return resolve(params);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  doLogout() {
    ShipUgfSFSConnector.getInstance()._Disconnect();
    return this.mStorageController.removeKeyDataFromStorage(APPKEYS.USER_INFO);
  }

  async showLoading(content?: string, cssClass?: string, duration?: number) {
    if (this.mLoading) {
      try {
        await this.mLoading.dismiss()
      } catch (error) { }
    }
    this.mLoading = this.mLoadingController.create({
      duration: duration ? duration : 3000,
      dismissOnPageChange: true,
      content: content ? content : "Waiting...!",
      cssClass: cssClass ? cssClass : ""
    });
    this.mLoading.present();
  }
  async showLoadingNoduration(content?: string, cssClass?: string) {
    if (this.mLoading) {
      try {
        await this.mLoading.dismiss()
      } catch (error) { }
    }
    this.mLoading = this.mLoadingController.create({
      dismissOnPageChange: true,
      content: content ? content : "Waiting...!",
      cssClass: cssClass ? cssClass : ""
    });
    this.mLoading.present();
  }
  public hideLoading(): void {
    if (this.mLoading) {
      this.mLoading.dismiss();
      this.mLoading = null;
    }
  }

  showToast(message: string, duration?: number, position?: string) {
    this.mToastController
      .create({
        message: message,
        duration: duration ? duration : 2000,
        position: position ? position : "bottom"
      })
      .present();
  }

  public showModal(page, params?: any, callback?: any): void {
    let modal = this.mModalController.create(page, params ? params : null);
    modal.present();
    modal.onDidDismiss(data => {
      if (callback) {
        callback(data);
      }
    });
  }

  public showParamsMessage(params) {
    this.showToast(params.getUtfString(ParamsKey.MESSAGE));
  }

  public showAlertDisConnect() {
    let alert = this.mAlertController.create();
    alert.setTitle("Network error!");
    alert.setMessage(
      "Make sure that Wi-Fi or mobile data is turned on, then try again"
    );
    alert.addButton({
      text: "Retry",
      handler: () => {

      }
    });
    alert.present();
  }

  public showAlertLogout() {
    let alert = this.mAlertController.create();
    alert.setTitle("Thông báo");
    alert.setMessage("Bạn muốn đăng xuất khỏi ứng dụng ?");
    alert.addButton("Không");
    alert.addButton({
      text: "Có",
      handler: () => {
        this.doLogout().then(() => {
          this.isLogin = false;
          this.goToLoadingPage();
        });
      }
    })
    alert.present();
  }

  public doLoadUserInfoFromStorage() {
    return this.mStorageController.getDataFromStorage(APPKEYS.USER_INFO);
  }

  public doSaveUserInfoIntoStorage(userInfo: UserInfo) {
    return this.mStorageController.saveDataToStorage(
      APPKEYS.USER_INFO,
      JSON.stringify(userInfo)
    );
  }


  onLoginSuccess(params) {
    this.isLogin = true;
    this.addSFSResponeListener();
    if (params) {
      let userdata = params["data"];
      let sfsUserData = userdata.getSFSObject(ParamsKey.CONTENT);
      this.mUser.fromSFSObject(sfsUserData);
    }
    OneSignalManager.getInstance().getOneSignalClientID().then(() => {
      ShipUgfSFSConnector.getInstance().sendInformationDeviceToServer(OneSignalManager.getInstance().getOneSignalID(), DeviceManager.getInstance().getDeviceName(), DeviceManager.getInstance().getPlatform());
    }).catch(err => { });
  }

  addSFSResponeListener() {
    ShipUgfSFSConnector.getInstance().addListener("AppModuleProvider", response => {
      this.onExtensionResponse(response);
    });
  }

  onExtensionResponse(response) {
    let cmd = response.cmd;
    let params = response.params;

    if (ShipUgfBaseExtension.getInstance().doCheckStatusParams(params)) {
      let data = ShipUgfBaseExtension.getInstance().doBaseExtension(cmd, params);
      if (cmd == ShipUgfSFSCmd.ON_NEW_NOTIFICATION) {
        this.onExtensionON_NEW_NOTIFICATION(data);
      }
    } else {
      this.showParamsMessage(params);
    }
  }

  onExtensionON_NEW_NOTIFICATION(data) {
    if (data) {
      // let newnotification: NotificationBean = data
      // let message = String(newnotification.getSenderName()) + " " + String(newnotification.getMessage()).replace("<strong>", "").replace("</strong>", "");
      // this.showToast(message, 3000, "top");
    }
  }

  public showAlert(title: string, callback: any, message?: string) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    if (message) alert.setSubTitle(message);
    alert.addButton({
      text: "Cancel",
      role: "cancel",
      handler: () => {
        callback();
      }
    });

    alert.addButton({
      text: "OK",
      handler: () => {
        callback(1);
      }
    });
    alert.present();
  }

  public showPromptChangeProfile(title: string, message: string, callback: any) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    alert.setMessage(message);
    alert.addButton({
      text: "Cancel",
      role: "cancel",
      handler: () => {
        callback();
      }
    });

    alert.addButton({
      text: "OK",
      handler: data => {
        callback(data);
      }
    });

    alert.addInput({
      placeholder: "Nhập thông tin mới",
      type: "text"
    });

    alert.present();
  }

  public showPromptChangePassword(
    title: string,
    message: string,
    callback: any
  ) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    alert.setMessage(message);
    alert.addButton({
      text: "Cancel",
      role: "cancel",
      handler: () => {
        callback();
      }
    });

    alert.addButton({
      text: "OK",
      handler: data => {
        callback(data);
      }
    });

    alert.addInput({
      placeholder: "Mật khẩu cũ",
      type: "password"
    });
    alert.addInput({
      placeholder: "Mật khẩu mới",
      type: "password"
    });

    alert.present();
  }

  public showActionSheet(
    title: string,
    mArray: Array<{ id: any; name: string; role?: string }>,
    callback: any
  ) {
    let actionSheet = this.mActionSheetController.create();
    actionSheet.setTitle(title);
    mArray.forEach((element, index) => {
      actionSheet.addButton({
        text: element.name,
        role: element.role ? element.role : "",
        handler: () => {
          callback(element.id);
        }
      });
    });
    actionSheet.addButton({
      text: "Thoát",
      role: "cancel",
      handler: () => {
        callback();
      }
    });
    actionSheet.present();
  }

  public showRadio(
    title: string,
    arrayInput: Array<{ id: any; name: string }>,
    idselected: any,
    callback: any
  ) {
    let alert = this.mAlertController.create();
    alert.setTitle(title);
    arrayInput.forEach(element => {
      alert.addInput({
        type: "radio",
        label: element.name,
        value: element.id + "",
        checked: element.id == idselected ? true : false
      });
    });
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        callback(data);
      }
    });
    alert.present();
  }


}
