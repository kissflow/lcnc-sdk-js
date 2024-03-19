import {
	BaseSDK,
	generateId,
	globalInstances,
	LISTENER_CMDS as CMDS
} from "../core";

export class NDEFReader extends BaseSDK {
	id: string;
	constructor() {
		super();
		this.id = generateId(CMDS.WINDOW_NDEF_READER_NEW);
		globalInstances[this.id] = this;
		this._postMessage(
			CMDS.WINDOW_NDEF_READER_NEW,
			{
				id: this.id,
				operation: "new"
			},
			(data: any) => {}
		);
	}
	scan() {
		return new Promise((resolve, reject) => {
			this._postMessage(
				CMDS.WINDOW_NDEF_READER_SCAN,
				{ id: this.id, operation: "scan" },
				({ data, err }) => {
					console.log("scan data from main window ", data);
					resolve(data);
				}
			);
		});
	}
	write(data) {
		return new Promise((resolve, reject) => {
			this._postMessage(
				CMDS.WINDOW_NDEF_READER_WRITE,
				{ id: this.id, operation: "write", data },
				({ data, err }) => {}
			);
		});
	}

	addEventListener(eventName: string, cb: Function): void {
		this._postMessage(
			CMDS.WINDOW_NDEF_READER_ADD_EVENT_LISTENER,
			{
				id: this.id,
				operation: "addEventListener",
				eventName
			},
			() => {}
		);
	}

	makeReadOnly() {
		return new Promise((resolve, reject) => {
			this._postMessage(
				CMDS.WINDOW_NDEF_READER_MAKE_READONLY,
				{ id: this.id, operation: "makeReadOnly" },
				({ data, err }) => {}
			);
		});
	}

	abortScan() {
		return new Promise((resolve, reject) => {
			this._postMessage(
				CMDS.WINDOW_NDEF_READER_ABORT_SCAN,
				{ id: this.id, operation: "abortScan" },
				({ data, err }) => {}
			);
		});
	}
}
