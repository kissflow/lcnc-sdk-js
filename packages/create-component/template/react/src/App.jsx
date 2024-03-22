import { useEffect, useState } from "react";
import KFSDK from "@kissflow/lowcode-client-sdk";

import { Greet } from "./Greet";

import styles from "./style.module.css";

function App() {
	const [kf, setKf] = useState(null);

	useEffect(function onload() {
		KFSDK.initialize()
			.then((kf) => {
				setKf(kf);
				// Expose the SDK to the global scope for other components
				window.kf = kf;
			})
			.catch((err) => console.error(err));
	}, []);

	// Mouting Component only if kissflow's sdk instance is available
	return kf ? (
		<div className={styles.rootDiv}>
			<h2>Kissflow custom component</h2>
			<Greet />
			<div className={styles.card}>
				<p className='read-the-docs'>
					Click <a href=''>here</a> to read docs.
				</p>
			</div>
		</div>
	) : null;
}

export default App;
