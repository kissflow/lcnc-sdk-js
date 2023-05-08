import KF_LC_SDK from "./kf.lowcodeworkersdk.es.js";
import KF_NC_SDK from "./kf.nocodeworkersdk.es.js";

const SDK_KIND = {
	LOWCODE: "lowcode",
	NOCODE: "nocode"
};

onmessage = async function (e) {
	if (!self.kf) {
		let { kind = SDK_KIND.LOWCODE } = e.data?.executionContext;
		let lib = KF_LC_SDK;
		if (kind === SDK_KIND.NOCODE) {
			lib = KF_NC_SDK;
		}
		self.kf = lib(e?.data.executionContext);
	}

	if (e.data?.eventParameters) {
		let { eventParameters } = e.data;
		if (eventParameters) {
			self.kf.eventParameters = { ...eventParameters };
		}
	}

	if (e.data.command !== "EXECUTE") return;
	const func = new Function(`
    return (async () => { 
      ${e.data.code}
    })()`);

	(async function () {
		await func();
		postMessage({
			_id: Math.floor(Date.now() + 999).toString(36),
			command: "RETURN",
			data: {}
		});
	})();
};
