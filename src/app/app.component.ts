import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppModuleProvider } from '../providers/app-module/app-module';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = "LoadingPage";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public mAppModule: AppModuleProvider,
    public mMenuController: MenuController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onClickLogout() {
    this.mAppModule.showAlertLogout();
    this.mMenuController.close();
  }
}

