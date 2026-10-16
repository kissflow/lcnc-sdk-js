// Behaviour of kf.app.getAgent(...) against a fake host, over the built ES module.
// Run after `pnpm run build`: node --test test/
import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";

const HOST_ORIGIN = "https://host.example";
const bus = new EventTarget();
const posted = [];
// Anything the SDK's shared message listener throws, captured so a test can assert there was none.
const listenerErrors = [];

// The SDK reads these when the module loads: a parent window to post to, its own origin, and the
// global message listener it registers.
globalThis.location = { origin: "https://app.example" };
// Commands listed here fail to post, the way an uncloneable payload does.
const unsendable = new Set();
globalThis.parent = {
	postMessage: (message) => {
		if (unsendable.has(message.command)) throw new Error("DataCloneError");
		posted.push(message);
	}
};
globalThis.addEventListener = (type, listener) =>
	bus.addEventListener(type, (message) => {
		try {
			listener(message);
		} catch (error) {
			listenerErrors.push(error);
		}
	});

const { default: kf } = await import("../dist/kfsdk.es.js");

function send(data) {
	bus.dispatchEvent(new MessageEvent("message", { data, origin: HOST_ORIGIN }));
}
function reply(message, resp) {
	send({ _req: { ...message }, resp });
}
function event(target, eventName, eventParams) {
	send({ isEvent: true, target, eventName, eventParams, eventConfig: { once: true } });
}
function lastPosted(command) {
	const found = posted.filter((m) => m.command === command);
	return found[found.length - 1];
}
const flush = () => new Promise((resolve) => setImmediate(resolve));
// Real timers still pending in this process — how a test proves a cancelled wait left nothing behind.
const pendingTimers = () => process.getActiveResourcesInfo().filter((kind) => kind === "Timeout").length;

const initializing = kf.initialize();
reply(posted.find((m) => m.command === "CC_INITIALIZE"), {
	appId: "App_A00", componentId: "CC1", user: { _id: "Us1" }, account: { _id: "Ac1" }, envDetails: {}
});
await initializing;

beforeEach(() => {
	posted.length = 0;
	listenerErrors.length = 0;
	unsendable.clear();
});
afterEach(() => {
	mock.timers.reset();
	assert.deepEqual(listenerErrors, [], "the shared message listener must never throw");
});

test("getContract posts the Agent id and resolves with the host's contract", async () => {
	const pending = kf.app.getAgent("AgOne").getContract();
	const sent = lastPosted("CUSTOM_AGENT_GET_CONTRACT");
	assert.equal(sent.agentId, "AgOne");
	reply(sent, { AgentId: "AgOne", Definition: { Name: "A" }, Readiness: { Ready: true, Issues: [] } });
	assert.deepEqual(await pending, { AgentId: "AgOne", Definition: { Name: "A" }, Readiness: { Ready: true, Issues: [] } });
});

test("execute sends inputData once and resolves on acceptance", async () => {
	const pending = kf.app.getAgent("AgOne").execute({ inputData: { request: "Two desks", amount: 54000 } });
	const sent = posted.filter((m) => m.command === "CUSTOM_AGENT_EXECUTE");
	assert.equal(sent.length, 1);
	assert.deepEqual(sent[0].inputData, { request: "Two desks", amount: 54000 });
	reply(sent[0], { ExecutionId: "Ac1::Ae1", Status: "NotStarted" });
	assert.deepEqual(await pending, { ExecutionId: "Ac1::Ae1", Status: "NotStarted" });
});

test("a refused call rejects with the host's error and code", async () => {
	const pending = kf.app.getAgent("AgOne").execute({ inputData: {} });
	reply(lastPosted("CUSTOM_AGENT_EXECUTE"), { isError: true, error: "Not ready", errorCode: "KISSFLOW_ERROR_20603" });
	await assert.rejects(pending, { isError: true, errorCode: "KISSFLOW_ERROR_20603" });
});

test("a host that never answers fails with a bounded error, and its late reply is ignored", async () => {
	mock.timers.enable({ apis: ["setTimeout"] });
	const agent = kf.app.getAgent("AgOne");
	const contract = agent.getContract();
	const run = agent.execute({ inputData: {} });
	mock.timers.tick(60_000);
	await assert.rejects(run, { errorCode: "AGENT_EXECUTE_OUTCOME_UNKNOWN" });
	mock.timers.tick(15_000);
	await assert.rejects(contract, { errorCode: "AGENT_HOST_TIMEOUT" });
	// Neither late reply may reach a listener or throw inside the shared message listener.
	reply(lastPosted("CUSTOM_AGENT_GET_CONTRACT"), { AgentId: "AgOne", Definition: {}, Readiness: {} });
	reply(lastPosted("CUSTOM_AGENT_EXECUTE"), { ExecutionId: "late", Status: "Queued" });
	assert.equal(posted.filter((m) => m.command === "CUSTOM_AGENT_EXECUTE").length, 1, "never resent");
});

test("onExecutionComplete delivers the terminal run once, then ignores further events", async () => {
	const agent = kf.app.getAgent("AgOne");
	const done = [];
	const errors = [];
	agent.onExecutionComplete("Ac1::Ae1", (run) => done.push(run), (error) => errors.push(error));
	const watch = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
	assert.equal(watch.executionId, "Ac1::Ae1");
	reply(watch, { Watching: true });
	await flush();
	event(watch.id, watch.eventName, { ExecutionId: "Ac1::Ae1", Status: "Failed", Error: { Code: "KISSFLOW_ERROR_20608", Retryable: false } });
	event(watch.id, watch.eventName, { ExecutionId: "Ac1::Ae1", Status: "Completed" });
	assert.equal(done.length, 1);
	assert.equal(done[0].Status, "Failed", "a failed run is a result, not a watch error");
	assert.equal(errors.length, 0);
	assert.equal(lastPosted("CUSTOM_AGENT_STOP_WATCH"), undefined, "the host already stopped; no stop is sent");
});

test("a host-reported watch error goes to onWatchError, not onComplete", async () => {
	const agent = kf.app.getAgent("AgOne");
	const done = [];
	const errors = [];
	agent.onExecutionComplete("Ac1::Ae2", (run) => done.push(run), (error) => errors.push(error));
	const watch = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
	reply(watch, { Watching: true });
	await flush();
	event(watch.id, watch.eventName, { isError: true, error: "Forbidden", errorCode: "KISSFLOW_ERROR_20403" });
	assert.equal(done.length, 0);
	assert.deepEqual(errors.map((e) => e.errorCode), ["KISSFLOW_ERROR_20403"]);
});

test("an old host that never acknowledges the watch reports unsupported and is told to stop", async () => {
	mock.timers.enable({ apis: ["setTimeout"] });
	const errors = [];
	kf.app.getAgent("AgOne").onExecutionComplete("Ac1::Ae3", () => assert.fail("must not complete"), (error) => errors.push(error));
	const watch = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
	mock.timers.tick(60_000);
	await flush();
	assert.deepEqual(errors.map((e) => e.errorCode), ["AGENT_HOST_UNSUPPORTED"]);
	assert.equal(lastPosted("CUSTOM_AGENT_STOP_WATCH").watchId, watch.watchId);
	// A completion arriving after that is ignored.
	event(watch.id, watch.eventName, { ExecutionId: "Ac1::Ae3", Status: "Completed" });
	assert.equal(errors.length, 1);
});

test("observation stops after the client deadline when the host goes quiet", async () => {
	mock.timers.enable({ apis: ["setTimeout"] });
	const errors = [];
	kf.app.getAgent("AgOne").onExecutionComplete("Ac1::Ae4", () => assert.fail("must not complete"), (error) => errors.push(error));
	const watch = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
	reply(watch, { Watching: true });
	await flush();
	mock.timers.tick(419_999);
	assert.equal(errors.length, 0);
	mock.timers.tick(1);
	assert.deepEqual(errors.map((e) => e.errorCode), ["AGENT_OBSERVATION_STOPPED"]);
	assert.equal(lastPosted("CUSTOM_AGENT_STOP_WATCH").watchId, watch.watchId);
});

test("stop() tells the host once, is idempotent, and later events are ignored", async () => {
	const done = [];
	const stop = kf.app.getAgent("AgOne").onExecutionComplete("Ac1::Ae5", (run) => done.push(run));
	const watch = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
	reply(watch, { Watching: true });
	await flush();
	stop();
	stop();
	assert.equal(posted.filter((m) => m.command === "CUSTOM_AGENT_STOP_WATCH").length, 1);
	event(watch.id, watch.eventName, { ExecutionId: "Ac1::Ae5", Status: "Completed" });
	assert.equal(done.length, 0);
});

test("two watches on one handle are independent", async () => {
	const agent = kf.app.getAgent("AgOne");
	const done = [];
	const stopFirst = agent.onExecutionComplete("Ac1::A", (run) => done.push(run.ExecutionId));
	const first = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
	agent.onExecutionComplete("Ac1::B", (run) => done.push(run.ExecutionId));
	const second = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
	assert.notEqual(first.eventName, second.eventName);
	reply(first, { Watching: true });
	reply(second, { Watching: true });
	await flush();
	stopFirst();
	event(second.id, second.eventName, { ExecutionId: "Ac1::B", Status: "Completed" });
	assert.deepEqual(done, ["Ac1::B"]);
});

test("an event for an unknown target is ignored instead of throwing", () => {
	event("nobody", "onCustomAgentExecutionComplete:x", { Status: "Completed" });
});

test("a run that cannot be posted reports not sent, and nothing is left waiting", async () => {
	const before = pendingTimers();
	unsendable.add("CUSTOM_AGENT_EXECUTE");
	await assert.rejects(kf.app.getAgent("AgOne").execute({ inputData: {} }), { errorCode: "AGENT_EXECUTE_NOT_SENT" });
	assert.equal(pendingTimers(), before, "the 60 s wait was released with the failure");
});

test("stopping before the host acknowledges cancels the registration too", async () => {
	const before = pendingTimers();
	const errors = [];
	const stop = kf.app.getAgent("AgOne").onExecutionComplete("Ac1::Ae6", () => assert.fail("must not complete"), (error) => errors.push(error));
	const watch = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
	assert.equal(pendingTimers(), before + 1, "waiting for the acknowledgement");
	stop();
	assert.equal(pendingTimers(), before, "stop released the acknowledgement wait");
	reply(watch, { Watching: true });
	await flush();
	assert.deepEqual(errors, []);
	assert.equal(pendingTimers(), before, "a late acknowledgement starts no observation deadline");
	assert.equal(posted.filter((m) => m.command === "CUSTOM_AGENT_STOP_WATCH").length, 1);
});

test("an acknowledgement that is not true is treated as an unsupported host", async () => {
	const errors = [];
	kf.app.getAgent("AgOne").onExecutionComplete("Ac1::Ae7", () => assert.fail("must not complete"), (error) => errors.push(error));
	reply(lastPosted("CUSTOM_AGENT_WATCH_EXECUTION"), { Watching: false });
	await flush();
	assert.deepEqual(errors.map((e) => e.errorCode), ["AGENT_HOST_UNSUPPORTED"]);
});

test("a non-terminal or mismatched event fails the watch instead of completing it", async () => {
	for (const params of [{ ExecutionId: "Ac1::Ae8", Status: "Running" }, { ExecutionId: "Ac1::Other", Status: "Completed" }]) {
		const errors = [];
		kf.app.getAgent("AgOne").onExecutionComplete("Ac1::Ae8", () => assert.fail("must not complete"), (error) => errors.push(error));
		const watch = lastPosted("CUSTOM_AGENT_WATCH_EXECUTION");
		reply(watch, { Watching: true });
		await flush();
		event(watch.id, watch.eventName, params);
		assert.deepEqual(errors.map((e) => e.errorCode), ["AGENT_WATCH_INVALID_EVENT"]);
	}
});

test("a stop the host cannot receive still ends the watch and reports the error", async () => {
	mock.timers.enable({ apis: ["setTimeout"] });
	const errors = [];
	kf.app.getAgent("AgOne").onExecutionComplete("Ac1::Ae9", () => assert.fail("must not complete"), (error) => errors.push(error));
	unsendable.add("CUSTOM_AGENT_STOP_WATCH");
	mock.timers.tick(60_000);
	await flush();
	assert.deepEqual(errors.map((e) => e.errorCode), ["AGENT_HOST_UNSUPPORTED"]);
});

// The reply cleanup lives in the message listener every SDK consumer shares, so it is checked on ordinary
// requests and on long-lived registrations too, not only on Agent calls.

test("an ordinary request settles once; a repeated or unknown reply is ignored", async () => {
	const settled = [];
	kf.api("/flow/2/Ac1/items").then((value) => settled.push(value));
	const sent = lastPosted("API");
	reply(sent, { Data: [1] });
	reply(sent, { Data: [2] });
	send({ _req: { _id: "api-unknown", command: "API" }, resp: { Data: [3] } });
	await flush();
	assert.deepEqual(settled, [{ Data: [1] }]);
});

test("a long-lived registration keeps its events after requests settle, even a reply carrying its id", async () => {
	const changes = [];
	kf.context.watchParams((params) => changes.push(params));
	const paramsChanged = (eventParams) =>
		send({ isEvent: true, target: "CC1", eventName: "onCustomComponentParamsChange", eventParams });
	paramsChanged({ step: 1 });
	const request = kf.api("/flow/2/Ac1/items");
	reply(lastPosted("API"), { Data: [] });
	await request;
	// A reply addressed to the registration's own id, as NDEFReader's commands are.
	send({ _req: { _id: "CC1", command: "WINDOW_NDEF_READER_SCAN" }, resp: {} });
	paramsChanged({ step: 2 });
	await flush();
	assert.deepEqual(changes, [{ step: 1 }, { step: 2 }]);
});
