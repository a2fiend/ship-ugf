import { PictureSourceType } from "@ionic-native/camera";

export class APPKEYS {
    public static LOGIN_STATUS: string = "login_status";
    public static USER_INFO: string = "user_info";
    public static DISCONNECTID: string = "disconnectID";
    public static PADDINGDISCONNECT: string = "paddingDisConnect";
    public static RECONECTID: string = "btn-rc";
    public static LOCATION: string = "location";
}

export const PLATFORM = {
    WEB: 0,
    ANDROID: 1,
    IOS: 2
}

export const LOGIN_TYPE = {
    PHONE: 0,
    FACEBOOK: 1,
    USERNAME_PASSWORD: 3,
    DEVICE: 4,
}

export const ORDER_TYPE = {
    CONFIRMING: 0,
    CONFIRMED: 1,
    COMPLETE: 2
}

export class ConstanManager {
    public static _instance: ConstanManager = null;
    constructor() { }

    public static getInstance(): ConstanManager {
        if (this._instance == null) {
            this._instance = new ConstanManager();
        }
        return this._instance;
    }
    public getActionPictureClicked(): Array<{ id: number, name: string }> {
        return [
            { id: PictureSourceType.PHOTOLIBRARY, name: "Chọn ảnh từ thư viện" },
            { id: PictureSourceType.CAMERA, name: "Máy ảnh" }
        ]
    }
}