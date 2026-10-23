// Behaviour of kf.app.runFunction / getFunctionRun / onFunctionRunComplete against a fake host,
// over the built ES module. Run after `pnpm run build`: node --test test/
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

const HOST_ORIGIN = "https://host.example";
const bus = new EventTarget();
const posted = [];
// Anything the SDK's shared message listener throws, captured so a test can assert there was none.
const listenerErrors = [];

globalThis.location = { origin: "https://app.example" };
globalThis.parent = { postMessage: (message) => posted.push(message) };
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

const initializing = kf.initialize();
reply(posted.find((m) => m.command === "CC_INITIALIZE"), {
	appId: "App_A00", componentId: "CC1", user: { _id: "Us1" }, account: { _id: "Ac1" }, envDetails: {}
});
await initializing;

const RUN = { RunId: "Run1", Status: "Success", Result: { total: 3 } };

beforeEach(() => {
	posted.length = 0;
	listenerErrors.length = 0;
});
afterEach(() => {
	assert.deepEqual(listenerErrors, [], "the shared message listener must never throw");
});

test("runFunction posts the name and parameters and resolves with the run envelope", async () => {
	const pending = kf.app.runFunction("sum_lines", { a: 1 });
	const sent = lastPosted("CUSTOM_FUNCTION_RUN");
	assert.equal(sent.name, "sum_lines");
	assert.deepEqual(sent.parameters, { a: 1 });
	reply(sent, RUN);
	assert.deepEqual(await pending, RUN);
});

test("runFunction defaults parameters to {} and keeps a one-key envelope whole", async () => {
	const pending = kf.app.runFunction("fn");
	const sent = lastPosted("CUSTOM_FUNCTION_RUN");
	assert.deepEqual(sent.parameters, {});
	// A Background run may answer with the id alone; that is still the envelope, not a bare id.
	reply(sent, { RunId: "Run1" });
	assert.deepEqual(await pending, { RunId: "Run1" });
});

test("getFunctionRun posts the run id and resolves with the run, even when it has one key", async () => {
	const pending = kf.app.getFunctionRun("Run1");
	const sent = lastPosted("CUSTOM_FUNCTION_GET_RUN");
	assert.equal(sent.runId, "Run1");
	reply(sent, { Status: "Running" });
	assert.deepEqual(await pending, { Status: "Running" });
});

test("a refused run rejects with the host's error and code", async () => {
	const pending = kf.app.runFunction("fn");
	reply(lastPosted("CUSTOM_FUNCTION_RUN"), {
		isError: true, error: "Function fn is not published", errorCode: "KISSFLOW_ERROR_04901"
	});
	await assert.rejects(pending, { isError: true, errorCode: "KISSFLOW_ERROR_04901" });
});

test("onFunctionRunComplete asks the host to watch under its own id, delivers the terminal run once, then ignores more", () => {
	const done = [];
	const errors = [];
	kf.app.onFunctionRunComplete("Run1", (run) => done.push(run), (error) => errors.push(error));
	const watch = lastPosted("CUSTOM_FUNCTION_ON_RUN_COMPLETE");
	assert.equal(watch.runId, "Run1");
	assert.match(watch.watchId, /^functionwatch-/);
	assert.equal(watch.eventName, `onCustomFunctionRunComplete:${watch.watchId}`);
	event(watch.id, watch.eventName, RUN);
	event(watch.id, watch.eventName, { ...RUN, Status: "Failed" });
	assert.deepEqual(done, [RUN]);
	assert.deepEqual(errors, []);
});

test("a watch the host could not set up reaches onError, never the callback", () => {
	const done = [];
	const errors = [];
	kf.app.onFunctionRunComplete("Run2", (run) => done.push(run), (error) => errors.push(error));
	const watch = lastPosted("CUSTOM_FUNCTION_ON_RUN_COMPLETE");
	event(watch.id, watch.eventName, { isError: true, error: "No signed-in user", errorCode: "KISSFLOW_ERROR_04903" });
	assert.deepEqual(done, []);
	assert.deepEqual(errors, [{ isError: true, error: "No signed-in user", errorCode: "KISSFLOW_ERROR_04903" }]);
});

test("the returned unsubscribe tells the host to stop and drops a later event", () => {
	const done = [];
	const stop = kf.app.onFunctionRunComplete("Run3", (run) => done.push(run));
	const watch = lastPosted("CUSTOM_FUNCTION_ON_RUN_COMPLETE");
	stop();
	const stopped = lastPosted("CUSTOM_FUNCTION_STOP_WATCH");
	assert.deepEqual(
		{ id: stopped.id, runId: stopped.runId, watchId: stopped.watchId, eventName: stopped.eventName },
		{ id: watch.id, runId: "Run3", watchId: watch.watchId, eventName: watch.eventName }
	);
	event(watch.id, watch.eventName, RUN);
	assert.deepEqual(done, []);
});

test("two watches on one run are told apart: stopping one leaves the other listening", () => {
	const done = [];
	const stopFirst = kf.app.onFunctionRunComplete("Run4", (run) => done.push(["first", run]));
	const first = lastPosted("CUSTOM_FUNCTION_ON_RUN_COMPLETE");
	kf.app.onFunctionRunComplete("Run4", (run) => done.push(["second", run]));
	const second = lastPosted("CUSTOM_FUNCTION_ON_RUN_COMPLETE");
	assert.notEqual(first.watchId, second.watchId);
	stopFirst();
	event(first.id, first.eventName, RUN);
	event(second.id, second.eventName, RUN);
	assert.deepEqual(done, [["second", RUN]]);
});

test("the app stops being an event target once its last watch ends", () => {
	const done = [];
	const stop = kf.app.onFunctionRunComplete("Run5", (run) => done.push(run));
	const watch = lastPosted("CUSTOM_FUNCTION_ON_RUN_COMPLETE");
	stop();
	event(watch.id, "onCustomFunctionRunComplete:anything", RUN);
	assert.deepEqual(done, []);
	assert.deepEqual(listenerErrors, []);
});

test("an event for a target that never registered is ignored, not thrown", () => {
	event("lcncsdk-never-registered", "onCustomFunctionRunComplete:RunX", RUN);
	assert.deepEqual(listenerErrors, []);
});
