import { BaseSDK, LISTENER_CMDS } from "../core";

export class Process extends BaseSDK {
    private _id: string;

    constructor(flowId: string) {
        super();
        this._id = flowId;
    }

    openForm(instanceId: string, activityInstanceId: string) {
        if (!instanceId || !activityInstanceId) {
            return Promise.reject({
                message: "instanceId and activityInstanceId are required",
            });
        }
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_OPEN_FORM, {
            flowId: this._id,
            instanceId,
            activityInstanceId,
        });
    }
}
