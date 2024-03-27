import { Greet } from "./Greet";
import { useKFSdk } from "./sdk";

import styles from "./style.module.css";

function App() {
	const kfSdk = useKFSdk();

	// Mouting Component only if kissflow's sdk instance is available
	return (
		<div className={styles.rootDiv}>
			<h2>Kissflow custom component</h2>
			{kfSdk && <Greet />}
			<div className={styles.card}>
				<p className='read-the-docs'>
					Click <a href='https://developers.kissflow.com/sdk'>here</a>
					to read docs.
				</p>
			</div>
		</div>
	);
}

export default App;
