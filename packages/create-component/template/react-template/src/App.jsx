import { kf } from "./sdk.js";

console.info("kf check", kf);

function App() {
	return (
		<>
			<h1>Kissflow custom component</h1>
			{kf && <h4>Welcome {kf.user.Name}</h4>}
			<div className='card'>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>Click here to learn more</p>
		</>
	);
}

export default App;
