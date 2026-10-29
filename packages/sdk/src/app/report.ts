import { BaseSDK, LISTENER_CMDS } from "../core";
import { requireFieldsAsync } from "../utils/validation";
import {
	ReportFlowType,
	ReportQueryOptions,
	ReportCountOptions,
	ReportDataResponse
} from "../types/external";

// Reports belong to a Form (DataForm), Process or Case flow; a Board is a Case flow.
const REPORT_FLOW_TYPES: ReportFlowType[] = ["Form", "Process", "Case", "Board"];

/**
 * A flow report of the current app. The handle sends no request until you call one of its methods.
 *
 * @example
 * const report = kf.app.getReport("Process", "Leave_Request_A00", "Requests_by_status_x1Yz");
 * const { Data } = await report.getData();
 */
export class Report extends BaseSDK {
	private _flowType: ReportFlowType;
	private _flowId: string;
	private _id: string;

	constructor(flowType: ReportFlowType, flowId: string, reportId: string) {
		super();
		this._flowType = flowType;
		this._flowId = flowId;
		this._id = reportId;
	}

	/**
	 * The report's calculated rows: groups and their values for a chart, the aggregate for a card.
	 * @param options - pageNumber (default 1), pageSize (default 50), payload (sent as the request body; filter at read time with the report's parameters, { FilterParam: { "$name": "text" } }; a falsy value is skipped, so send 0 as "0")
	 */
	getData(options?: ReportQueryOptions): Promise<ReportDataResponse> {
		return this._send(LISTENER_CMDS.REPORT_GET_DATA, {
			pageNumber: options?.pageNumber || 1,
			pageSize: options?.pageSize || 50,
			payload: options?.payload || {}
		});
	}

	/** The number of rows a tabular report would return. Chart and card reports have no row count; use getData(). */
	getCount(options?: ReportCountOptions): Promise<number> {
		return this._send(LISTENER_CMDS.REPORT_GET_COUNT, { payload: options?.payload || {} });
	}

	/** The fields of a tabular report. Empty for chart and card reports; use getData(). */
	getFields(): Promise<any> {
		return this._send(LISTENER_CMDS.REPORT_GET_FIELDS, {});
	}

	private _send(command: string, args: object): Promise<any> {
		const missing = requireFieldsAsync([
			{ value: this._flowId, name: "flowId" },
			{ value: this._id, name: "reportId" }
		]);
		if (missing) return missing;
		if (REPORT_FLOW_TYPES.indexOf(this._flowType) === -1) {
			return Promise.reject({
				message: `flowType must be one of ${REPORT_FLOW_TYPES.join(", ")}`
			});
		}
		return this._postMessageAsync(command, {
			flowType: this._flowType,
			flowId: this._flowId,
			reportId: this._id,
			...args
		});
	}
}
