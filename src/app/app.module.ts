import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AppModuleProvider } from '../providers/app-module/app-module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { NetworkInterface } from '@ionic-native/network-interface';
import { OneSignal } from '@ionic-native/onesignal';
import { Device } from '@ionic-native/device';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppModuleProvider,
    NetworkInterface,
    OneSignal,
    Device,
    HTTP,
    Network,
    FileTransfer,
    Camera
  ]
})
export class AppModule {}
