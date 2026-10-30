// Behaviour of kf.app.getReport(...) against a fake host, over the built ES module.
// Run after `pnpm run build`: node --test test/
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

const HOST_ORIGIN = "https://host.example";
const bus = new EventTarget();
const posted = [];

globalThis.location = { origin: "https://app.example" };
globalThis.parent = { postMessage: (message) => posted.push(message) };
globalThis.addEventListener = (type, listener) => bus.addEventListener(type, listener);

const { default: kf } = await import("../dist/kfsdk.es.js");

const reply = (message, resp) =>
	bus.dispatchEvent(new MessageEvent("message", { data: { _req: { ...message }, resp }, origin: HOST_ORIGIN }));
// The host wraps every report answer in one key (report.handler.ts); the SDK unwraps a one-key reply.
const replyWrapped = (message, value) => reply(message, { data: value });
const lastPosted = (command) => posted.filter((m) => m.command === command).at(-1);

const initializing = kf.initialize();
reply(posted.find((m) => m.command === "CC_INITIALIZE"), {
	appId: "App_A00", componentId: "CC1", user: { _id: "Us1" }, account: { _id: "Ac1" }, envDetails: {}
});
await initializing;

beforeEach(() => { posted.length = 0; });

test("getReport sends nothing until a method is called", () => {
	kf.app.getReport("Process", "Leave_A00", "Rpt1");
	assert.equal(posted.length, 0);
});

test("getData sends the report's ids with paging and an empty payload, and resolves with the host's answer", async () => {
	const pending = kf.app.getReport("Process", "Leave_A00", "Rpt1").getData({ pageSize: 10 });
	const sent = lastPosted("REPORT_GET_DATA");
	assert.deepEqual(
		{ flowType: sent.flowType, flowId: sent.flowId, reportId: sent.reportId, pageNumber: sent.pageNumber, pageSize: sent.pageSize, payload: sent.payload },
		{ flowType: "Process", flowId: "Leave_A00", reportId: "Rpt1", pageNumber: 1, pageSize: 10, payload: {} }
	);
	replyWrapped(sent, { Data: [{ label: "Approved", value: 4 }] });
	assert.deepEqual(await pending, { Data: [{ label: "Approved", value: 4 }] });
});

test("getCount and getFields send their own commands", async () => {
	const report = kf.app.getReport("Case", "Tasks_A00", "Rpt2");
	const count = report.getCount();
	const countSent = lastPosted("REPORT_GET_COUNT");
	assert.deepEqual([countSent.flowType, countSent.reportId, countSent.payload], ["Case", "Rpt2", {}]);
	replyWrapped(countSent, 12);
	assert.equal(await count, 12);

	const fields = report.getFields();
	const fieldsSent = lastPosted("REPORT_GET_FIELDS");
	replyWrapped(fieldsSent, [{ Id: "Status" }]);
	assert.deepEqual(await fields, [{ Id: "Status" }]);
});

test("missing ids and flows without reports are refused before anything is sent", async () => {
	await assert.rejects(kf.app.getReport("Process", "", "Rpt1").getData(), { message: "flowId is required" });
	await assert.rejects(kf.app.getReport("Process", "Leave_A00", "").getCount(), { message: "reportId is required" });
	await assert.rejects(kf.app.getReport("Dataset", "Holidays_A00", "Rpt1").getData(), { message: "flowType must be one of Form, Process, Case" });
	await assert.rejects(kf.app.getReport("Board", "Tasks_A00", "Rpt1").getData(), { message: "flowType must be one of Form, Process, Case" });
	assert.equal(posted.length, 0);
});
