import { SfsClientBaseExtension } from "../core/smartfox/sfs-client-extension";
import { ParamsKey } from "../app-module/paramskey";
import { ShipUgfSFSCmd } from "./shipugf-cmd";
import { UserBean } from "../classes/user-bean";
import { OrderBean } from "../classes/order-bean";
import { ShipUgfSFSConnector } from "./shipugf-connector";

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
        else if (cmd == ShipUgfSFSCmd.USER_REGISTER) {
            return this.onExtensionUSER_REGISTER(params);
        }
        else if (cmd == ShipUgfSFSCmd.USER_UPDATE_INFO) {
            return this.onExtensionUSER_UPDATE_INFO(params);
        }

        else if (cmd == ShipUgfSFSCmd.USER_ADD_ORDER) {
            return this.onExtensionUSER_ADD_ORDER(params);
        }
        else if (cmd == ShipUgfSFSCmd.USER_GET_LIST_ORDER) {
            return this.onExtensionUSER_GET_LIST_ORDER(params);
        }
        else if (cmd == ShipUgfSFSCmd.USER_UPDATE_ORDER) {
            return this.onExtensionUSER_UPDATE_ORDER(params);
        }
        else if (cmd == ShipUgfSFSCmd.USER_DELETE_ORDER) {
            return this.onExtensionUSER_DELETE_ORDER(params);
        }

        else if (cmd == ShipUgfSFSCmd.UPLOAD_IMAGE) {
            return this.onExtensionUPLOAD_IMAGE(params);
        }
    }

    public onExtensionUSER_GET_INFO(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new UserBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_REGISTER(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new UserBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_UPDATE_INFO(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new UserBean();
        object.fromSFSObject(info);
        return object;
    }


    public onExtensionUSER_ADD_ORDER(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new OrderBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_GET_LIST_ORDER(params) {
        let data = this.doParseArrayExtensions(params);
        let array = data.array;
        let arrayObject: Array<OrderBean> = [];
        for (let i = 0; i < array.size(); i++) {
            let sfsobject = array.getSFSObject(i);
            let object = new OrderBean();
            object.fromSFSObject(sfsobject);
            arrayObject.push(object);
        }
        return { array: arrayObject, page: data.page, nextPage: data.nextPage }
    }

    public onExtensionUSER_UPDATE_ORDER(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new OrderBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUSER_DELETE_ORDER(params) {
        let data = this.doParseInfo(params);
        let info = data.info;
        let object = new OrderBean();
        object.fromSFSObject(info);
        return object;
    }

    public onExtensionUPLOAD_IMAGE(params) {
        let data = this.doParseArrayExtensions(params);
        let array = data.array;
        let type;

        if (data.content.containsKey("__type")) {
            type = data.content.getUtfString("__type");
        }

        let url: any;
        if (array && type != 4) {
            url = "http://" + ShipUgfSFSConnector.getInstance().getSFSHost() + ":" + ShipUgfSFSConnector.getInstance().getSFSPort() + "/" + array.getSFSObject(0).getUtfString(ParamsKey.URL);
        }

        if (type == 4) {
            url = [];
            for (let i = 0; i < array.size(); i++) {
                let source = "http://" + ShipUgfSFSConnector.getInstance().getSFSHost() + ":" + ShipUgfSFSConnector.getInstance().getSFSPort() + "/" + array.getSFSObject(i).getUtfString(ParamsKey.URL);
                url.push(source);
            }
        }
        return { url: url, type: type };
    }
}