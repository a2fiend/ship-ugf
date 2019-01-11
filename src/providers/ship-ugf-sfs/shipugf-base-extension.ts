import { SfsClientBaseExtension } from "../core/smartfox/sfs-client-extension";
import { ParamsKey } from "../app-module/paramskey";
import { ShipUgfSFSCmd } from "./shipugf-cmd";
import { UserBean } from "../classes/user-bean";

export class ShipUgfBaseExtension extends SfsClientBaseExtension {
    public static _instance: ShipUgfBaseExtension = null;
    private mDebug: boolean = true;
    constructor() {
        super();
    }

    public static getInstance(): ShipUgfBaseExtension {
        if (this._instance == null) {
            this._instance = new ShipUgfBaseExtension();
        }
        return this._instance;
    }

    public doBaseExtension(cmd, params) {
        if (this.doCheckStatusParams(params)) {
            return this.resolveParamsWithCMD(cmd, params);
        } else {
            return params.getUtfString(ParamsKey.MESSAGE);
        }
    }

    public resolveParamsWithCMD(cmd, params) {
        if (cmd == ShipUgfSFSCmd.USER_GET_INFO) {
            return this.onExtensionUSER_GET_INFO(params);
        }
    }

    public onExtensionUSER_GET_INFO(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new UserBean();
        object.fromSFSObject(info);
        return object;
    }
}