import { Greet } from "./Greet";
import { kfSdk } from "./sdk/index.js";

import styles from "./style.module.css";

function App() {
	return (
		<div className={styles.rootDiv}>
			<h2>Kissflow custom component</h2>
			<Greet />
			<div className={styles.card}>
				<p className='read-the-docs'>
					Click{" "}
					<a
						target='_blank'
						href='https://kissflow.github.io/lcnc-sdk-js/'>
						here
					</a>{" "}
					to read docs.
				</p>
			</div>
		</div>
	);
}

export default App;
