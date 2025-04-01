import {
	defaultLandingComponent,
	defaultErrorComponent
} from "./src/landing/index.js";

let kf;

window.onload = async function () {
	kf = await window.kf.initialise().catch((err) => {
		console.error("Error initializing kissflow", err);
		defaultErrorComponent();
	});
	window.kf = kf;

	// This is a default placeholder component, to remove it comment this method call.
	defaultLandingComponent();

	// Subscribe to watch params changes on load method.
	// NOTE: Make sure this there is only one onLoad method in the entire project.
	// kf.context.watchParams(function (data) {});
};

export { kf };
