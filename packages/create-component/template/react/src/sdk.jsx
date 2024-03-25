import { useEffect, useState } from "react";
import KFSDK from "@kissflow/lowcode-client-sdk";

/**
 * Custom hook to initialize and retrieve the KF SDK as singleton.
 * @returns {Object} The KF SDK instance.
 */
export const useKFSdk = () => {
	// While mount state will check for instance in window object
	//  thus making sure it is initialized only once
	const [kfSdk, setKfSdk] = useState(() => window.kf ?? null);

	useEffect(function initSDK() {
		// If the SDK is not initialized, initialize it and store it in window object
		if (!window.kf) {
			KFSDK.initialize()
				.then((kf) => {
					setKfSdk(kf);
					window.kf = kf;
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, []);

	return kfSdk;
};
