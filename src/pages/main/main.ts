import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppModuleProvider } from '../../providers/app-module/app-module';
import { ShipUgfSFSConnector } from '../../providers/ship-ugf-sfs/shipugf-connector';
import { ShipUgfBaseExtension } from '../../providers/ship-ugf-sfs/shipugf-base-extension';
import { ShipUgfSFSCmd } from '../../providers/ship-ugf-sfs/shipugf-cmd';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mAppModule: AppModuleProvider
    ) {
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
      if(cmd == ShipUgfSFSCmd.USER_GET_INFO){
        this.onExtensionUSER_GET_INFO(data);
      }
    }
  }

  onExtensionUSER_GET_INFO(data){
    console.log(data);
    
  }

  onClickLogout(){
    this.mAppModule.doLogout();
    this.navCtrl.push("LoadingPage")
  }

  onTestRequest(){
    ShipUgfSFSConnector.getInstance().rendRequestUSER_GET_INFO();
  }

}
