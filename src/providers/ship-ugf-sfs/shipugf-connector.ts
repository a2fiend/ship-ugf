import { SFSConnector } from "../core/smartfox/sfs-connector";
import { ParamsKey } from "../app-module/paramskey";

import md5 from "md5";
import moment from "moment";
import { SFSEvent } from "../core/smartfox/sfs-events";
import { DeviceInfo } from "../classes/device-info";
import { UserInfo } from "../classes/user-info";
import { ShipUgfSFSCmd } from "./shipugf-cmd";
import { UserBean } from "../classes/user-bean";
import { OrderBean } from "../classes/order-bean";

var SFS2X = window['SFS2X'];

export class SFSUser {
    public static ROLE_PLAYER: number = 1;
    public static ROLE_CLUB_MANAGER: number = 3;
    public static ROLE_STADIUM_MANAGER: number = 2;


    username: string = "";
    password: string = "";
    role: number = -1;
    user_id: number = -1;
    phone: string = "";
    nick_name: string = "";

    constructor() {

    }

    onSFSUserInfoResponse(sfsObject) {
        if (sfsObject) {
            this.role = sfsObject.getInt('role');
            this.user_id = sfsObject.getInt('user_id');
            this.phone = sfsObject.getUtfString('phone');
            this.nick_name = sfsObject.getUtfString('nick_name');
        }
    }

    public getRole(): number {
        return this.role;
    }
}

export class Listener {
    name: string = "";
    method: any = () => { };
}

export class ShipUgfSFSConnector extends SFSConnector {
    mSFSUser: SFSUser = new SFSUser();
    public mSFSUserRoom;
    public mListeners: Map<string, any> = new Map<string, any>();
    mPingIntervalID = -1;

    public mUgf: string = "ugf.";

    public addListener(key: string, func: any): void {
        this.mListeners.set(key, func);
    }

    public removeListener(key: string): void {
        this.mListeners.delete(key);
    }

    public removeAllListener(): void {
        this.mListeners.clear();
    }

    public dispatchEvent(event): void {
        this.mListeners.forEach((val, key) => {
            val(event);
        });
    }

    public getSessionToken() {
        return this.mSFSClient.sessionToken;
    }

    private static _instance: ShipUgfSFSConnector = null;
    private constructor() {
        super();
    }
    public static getInstance(): ShipUgfSFSConnector {
        if (this._instance == null) {
            this._instance = new ShipUgfSFSConnector();
        }
        return this._instance;
    }

    public getSFSUser(): SFSUser {
        return this.mSFSUser;
    }

    public setData(data): void {
        super.setData(data);
        this.onResponseDataConfig(data);
    }

    private onResponseDataConfig(data): void {
        if (!data) return;
        if ('smartfox_server' in data) {
            let serverConfig = data[data['smartfox_server']];
            if (serverConfig) {
                if ('host' in serverConfig) this.setSFSHost(serverConfig['host']);
                if ('port' in serverConfig) this.setSFSPort(serverConfig['port']);
                if ('zone' in serverConfig) this.setSFSZone(serverConfig['zone']);
                if ('debug' in serverConfig) this.setSFSDebug(serverConfig['debug']);
            }
        }
    }

    public addListenerForExtensionResponse() {

        this.mSFSClient.removeEventListener(SFSEvent.EXTENSION_RESPONSE, () => { });
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_LOST, () => { });
        this.mSFSClient.removeEventListener(SFSEvent.CONNECTION_RESUME, () => { });

        this.mSFSClient.addEventListener(SFSEvent.EXTENSION_RESPONSE, (eventParams) => {
            this.onExtensionResponse(eventParams);
        });

        this.mSFSClient.addEventListener(SFSEvent.CONNECTION_LOST, (eventParams) => {
            var eventsP = {
                cmd: SFSEvent.CONNECTION_LOST,
                params: new SFS2X.SFSObject()
            }
            this.onExtensionResponse(eventsP);
        });

        this.mSFSClient.addEventListener(SFSEvent.CONNECTION_RESUME, (eventParams) => {
            var eventsP = {
                cmd: SFSEvent.CONNECTION_RESUME,
                params: new SFS2X.SFSObject()
            }
            this.onExtensionResponse(eventsP);
        });
    }

    public onExtensionResponse(eventParams) {
        if (this.mDebug) {
            console.log("EXTENSION_RESPONSE : " + eventParams.cmd, eventParams.params.getDump());
        }
        this.dispatchEvent(eventParams);
    }

    public login(loginType: number, deviceInfo: DeviceInfo, userInfo: UserInfo) {
        if (SFS2X == null || SFS2X == undefined) {
            SFS2X = window['SFS2X'];
        }

        return new Promise((resolve, reject) => {
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN, () => { });
            this.mSFSClient.removeEventListener(SFSEvent.LOGIN_ERROR, () => { });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN, (eventParams) => {
                return resolve(eventParams);
            });
            this.mSFSClient.addEventListener(SFSEvent.LOGIN_ERROR, (eventParams) => {
                return reject(eventParams);
            });

            let params = new SFS2X.SFSObject();

            let today = moment(new Date()).format('YYYY-MM-DD');
            let sign = md5(today + deviceInfo.getOnesignalID());
            params.putUtfString(ParamsKey.SIGN, sign);

            params.putInt(ParamsKey.LOGIN_TYPE, loginType);

            let userInfoSFSObject = new SFS2X.SFSObject();
            let deviceInfoSFSObject = new SFS2X.SFSObject();

            params.putSFSObject(ParamsKey.DEVICE_INFO, deviceInfo.toSFSObject(deviceInfoSFSObject));

            params.putSFSObject(ParamsKey.USER_INFO, userInfo.toSFSObject(userInfoSFSObject));

            this.mSFSClient.send(new SFS2X.LoginRequest("", "", params, this.getSFSZone()));
        });
    }

    public sendInformationDeviceToServer(oneSignalID: string, deviceName: string, deviecPlatform: number): void {
        if (SFS2X == null || SFS2X == undefined) {
            SFS2X = window['SFS2X'];
        }
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.DEVICE_PLATFORM, deviecPlatform);
        params.putUtfString(ParamsKey.DEVICE_NAME, deviceName);
        params.putUtfString(ParamsKey.ONESIGNAL_ID, oneSignalID);

        this.send("ugf. " + ShipUgfSFSCmd.UPDATE_LOGIN_DEVICE, params);
    }

    public rendRequestUSER_GET_INFO() {
        let params = new SFS2X.SFSObject();

        this.send(this.mUgf + ShipUgfSFSCmd.USER_GET_INFO, params);
    }

    public rendRequestUSER_REGISTER(user: UserBean) {
        let params = new SFS2X.SFSObject();
        params = user.toSFSObject(params);

        this.send(this.mUgf + ShipUgfSFSCmd.USER_REGISTER, params);
    }

    public rendRequestUSER_UPDATE_INFO(user: UserBean) {
        let params = new SFS2X.SFSObject();
        params = user.toSFSObject(params);

        this.send(this.mUgf + ShipUgfSFSCmd.USER_UPDATE_INFO, params);
    }

    public rendRequestUSER_GET_LIST_ORDER(page: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.PAGE, page);

        this.send(this.mUgf + ShipUgfSFSCmd.USER_GET_LIST_ORDER, params);
    }

    public rendRequestUSER_UPDATE_ORDER(order: OrderBean) {
        let params = new SFS2X.SFSObject();
        params = order.toSFSObject(params);

        this.send(this.mUgf + ShipUgfSFSCmd.USER_UPDATE_ORDER, params);
    }

    public rendRequestUSER_DELETE_ORDER(orderID: number) {
        let params = new SFS2X.SFSObject();
        params.putInt(ParamsKey.ORDER_ID, orderID);

        this.send(this.mUgf + ShipUgfSFSCmd.USER_DELETE_ORDER, params);
    }


}