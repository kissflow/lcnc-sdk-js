import { BaseSDK, LISTENER_CMDS } from "../core";

interface ProcessItem {
    _id: string;
    _activity_instance_id: string;
}

export class Process extends BaseSDK {
    private _id: string;

    constructor(flowId: string) {
        super();
        this._id = flowId;
    }

    openForm(item: ProcessItem) {
        if (!item._id || !item._activity_instance_id) {
            return Promise.reject({
							message: "Instance Id(_id) and Activity Instance Id(_activity_instance_id) are required"
					});
        }
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_OPEN_FORM, {
            flowId: this._id,
            instanceId: item._id,
            activityInstanceId: item._activity_instance_id,
        });
    }
}
