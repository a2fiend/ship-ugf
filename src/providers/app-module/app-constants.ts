export class CONNECT_STATE {
    public static STATE_NONE: number = 1;
    public static STATE_INTERNET_NONE: number = 2;
    public static STATE_CONNECTING: number = 3;
    public static STATE_CONNECTED: number = 4;
    public static STATE_FAIL: number = 5;
    public static STATE_LOGGED_IN: number = 6;
}

export class APPKEYS {
    public static LOGIN_STATUS: string =  "login_status";
    public static USER_INFO: string =  "user_info";
    public static DISCONNECTID: string =  "disconnectID";
    public static PADDINGDISCONNECT: string =  "paddingDisConnect";
    public static RECONECTID: string =  "btn-rc";
    public static LOCATION: string =  "location";
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