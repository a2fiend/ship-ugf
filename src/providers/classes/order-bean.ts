import { ParamsKey } from "../app-module/paramskey";

export class OrderBean {
    private 					orderID			:number = 0;
	private 					targetID		:number = 0;
	private 					senderID		:number = 0;
	private 					type			:number = 0;
	private 					state			:number = 0;
	private 				    timeCreated		:number = 0;
	private 				    timeSend		:number = 0;
	private				code			= "";
	private				targetName		= "";
	private				senderName		= "";
	private				description		= "";
	private				address			= "";
	private				targetPhone		= "";
	private				senderPhone		= "";


	public toSFSObject(obj): any {
		
		obj.putInt(ParamsKey.ORDER_ID, this.getOrderID());
		obj.putInt(ParamsKey.STATE, this.getState());
		obj.putInt(ParamsKey.TYPE, this.getType());
		obj.putInt(ParamsKey.TARGET_ID, this.getTargetID());
		obj.putInt(ParamsKey.SENDER_ID, this.getSenderID());
		obj.putLong(ParamsKey.TIME_CREATED, this.getTimeCreated());
		obj.putLong(ParamsKey.TIME_SEND, this.getTimeSend());
		obj.putUtfString(ParamsKey.TARGET_NAME, this.getTargetName());
		obj.putUtfString(ParamsKey.SENDER_NAME, this.getSenderName());
		obj.putUtfString(ParamsKey.TARGET_PHONE, this.getTargetPhone());
		obj.putUtfString(ParamsKey.SENDER_PHONE, this.getSenderPhone());
		obj.putUtfString(ParamsKey.CODE, this.getCode());
		obj.putUtfString(ParamsKey.DESCRIPTION, this.getDescription());
		obj.putUtfString(ParamsKey.ADDRESS, this.getAddress());
		
		return obj;
	}


	public fromSFSObject(object: any) {
		if (object == null) return;
		if (object.containsKey(ParamsKey.ORDER_ID)) this.setOrderID(object.getInt(ParamsKey.ORDER_ID));
		if (object.containsKey(ParamsKey.STATE)) this.setState(object.getInt(ParamsKey.STATE));
		if (object.containsKey(ParamsKey.TYPE)) this.setType(object.getInt(ParamsKey.TYPE));
		if (object.containsKey(ParamsKey.TARGET_ID)) this.setTargetID(object.getInt(ParamsKey.TARGET_ID));
		if (object.containsKey(ParamsKey.SENDER_ID)) this.setSenderID(object.getInt(ParamsKey.SENDER_ID));
		if (object.containsKey(ParamsKey.TIME_CREATED)) this.setTimeCreated(object.getLong(ParamsKey.TIME_CREATED));
		if (object.containsKey(ParamsKey.TIME_SEND)) this.setTimeSend(object.getLong(ParamsKey.TIME_SEND));
		if (object.containsKey(ParamsKey.TARGET_NAME)) this.setTargetName(object.getUtfString(ParamsKey.TARGET_NAME));
		if (object.containsKey(ParamsKey.SENDER_NAME)) this.setSenderName(object.getUtfString(ParamsKey.SENDER_NAME));
		if (object.containsKey(ParamsKey.TARGET_PHONE)) this.setTargetPhone(object.getUtfString(ParamsKey.TARGET_PHONE));
		if (object.containsKey(ParamsKey.SENDER_PHONE)) this.setSenderPhone(object.getUtfString(ParamsKey.SENDER_PHONE));
		if (object.containsKey(ParamsKey.CODE)) this.setCode(object.getUtfString(ParamsKey.CODE));
		if (object.containsKey(ParamsKey.DESCRIPTION)) this.setDescription(object.getUtfString(ParamsKey.DESCRIPTION));
		if (object.containsKey(ParamsKey.ADDRESS)) this.setAddress(object.getUtfString(ParamsKey.ADDRESS));

	}

    public getOrderID() {
		return this.orderID;
	}

	public setOrderID( orderID: number ) {
		this.orderID = orderID;
	}

	public getTargetID() {
		return this.targetID;
	}

	public setTargetID( targetID: number ) {
		this.targetID = targetID;
	}

	public getSenderID() {
		return this.senderID;
	}

	public setSenderID( senderID: number ) {
		this.senderID = senderID;
	}

	public getType() {
		return this.type;
	}

	public setType( type: number ) {
		this.type = type;
	}

	public getState() {
		return this.state;
	}

	public setState( state: number ) {
		this.state = state;
	}

	public getTimeCreated() {
		return this.timeCreated;
	}

	public setTimeCreated(timeCreated: number ) {
		this.timeCreated = timeCreated;
	}

	public getTimeSend() {
		return this.timeSend;
	}

	public setTimeSend(timeSend: number ) {
		this.timeSend = timeSend;
	}

	public getCode() {
		return this.code;
	}

	public setCode( code: string) {
		this.code = code;
	}

	public getTargetName() {
		return this.targetName;
	}

	public setTargetName( targetName: string) {
		this.targetName = targetName;
	}

	public getSenderName() {
		return this.senderName;
	}

	public setSenderName( senderName: string) {
		this.senderName = senderName;
	}

	public getDescription() {
		return this.description;
	}

	public setDescription( description: string) {
		this.description = description;
	}

	public getAddress() {
		return this.address;
	}

	public setAddress( address: string) {
		this.address = address;
	}

	public getTargetPhone() {
		return this.targetPhone;
	}

	public setTargetPhone( targetPhone: string) {
		this.targetPhone = targetPhone;
	}

	public getSenderPhone() {
		return this.senderPhone;
	}

	public setSenderPhone( senderPhone: string) {
		this.senderPhone = senderPhone;
	}
}