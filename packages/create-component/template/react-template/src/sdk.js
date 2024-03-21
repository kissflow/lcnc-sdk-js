import KFSDK from "@kissflow/lowcode-client-sdk";

let kf;

(async function initialize() {
	kf = await KFSDK.initialize().catch((e) => {
		console.error("Error initializing SDK", e);
	});
})();

export { kf };
