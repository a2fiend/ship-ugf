import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserBean } from '../../providers/classes/user-bean';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { DeviceManager } from '../../providers/core/plugin/device-manager';
import { ConstanManager } from '../../providers/app-module/app-constants';
import { UploadFileModule } from '../../providers/core/upload-image/upload-file';
import { UploadType } from '../../providers/core/upload-image/upload-type';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { ShipUgfBaseExtension } from '../../providers/ship-ugf-sfs/shipugf-base-extension';
import { ShipUgfSFSCmd } from '../../providers/ship-ugf-sfs/shipugf-cmd';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  mUser: UserBean = new UserBean();

  isUpload: boolean = false;

  isEdit: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider,
    public mEvent: Events,
  ) {
    this.onLoadParams();
  }

  onLoadParams() {
    if (this.navParams.data["params"]) {
      this.mUser = this.navParams.get("params");
    }
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
      if (cmd == ShipUgfSFSCmd.UPLOAD_IMAGE) {
        this.onExtensionUPLOAD_IMAGE(data);
      }
      else if (cmd == ShipUgfSFSCmd.USER_UPDATE_INFO) {
        this.onExtensionUSER_UPDATE_INFO(data);
      }
    }
  }

  onExtensionUPLOAD_IMAGE(data) {
    let url = data.url;
    let type = parseInt(data.type);

    this.mUser.setAvatar(url);

    if (this.isUpload) {
      this.mEvent.publish("done-loading");
      this.mEvent.subscribe("hide-progress", () => {
        this.mEvent.unsubscribe("hide-progress");
        this.isUpload = false;
        this.isEdit = true;
      });
    } else {

    }
  }

  onExtensionUSER_UPDATE_INFO(data) {
    if (data) {
      this.mAppModule.showToast("Cập nhật thông tin thành công");
      this.navCtrl.pop();
    }
  }

  onClickImg() {
    if (DeviceManager.getInstance().isInMobileDevice()) {
      this.mAppModule.showActionSheet("Chọn ảnh", ConstanManager.getInstance().getActionPictureClicked(), select => {
        if (select == 0 || select == 1) {
          UploadFileModule.getInstance()._onTakeAPhotoWithType(select, UploadType.LOGO).then(res => {
            if (res) {
              this.mUser.setAvatar(res.imageURI);
              UploadFileModule.getInstance()._onUploadFileInDevice(res.imageURI, res.imageFileName.trim(), UploadType.LOGO, "true");
            }
          }).catch(err => { })
        }
      })
    } else {
      UploadFileModule.getInstance()._openFileInBrowser(res => {
        if (res) {
          this.mUser.setAvatar(res.avatar);
          UploadFileModule.getInstance()._onUploadFileInBrowser(res.selectedFile, UploadType.LOGO, "true");

          this.isUpload = true;
          this.mEvent.publish("run_loading");
        }
      })
    }
  }

  onClickEdit() {
    ShipUgfSFSConnector.getInstance().sendRequestUSER_UPDATE_INFO(this.mUser);
  }

  onInfoChange() {
    this.isEdit = true;
  }

}
