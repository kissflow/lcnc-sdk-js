let kf = window.kf;

function showUserInfo() {
	kf.client.showInfo(`Hi ${kf.user.Name}!`);
}

export function defaultLandingComponent() {
	let userName = kf.user.Name;
	document.getElementById("root").innerHTML = `
		<div class='landingHero'>
			<div class='mainDiv'>
				<h1>Welcome, ${userName}</h1>
				<div>
					<p class='sampletext'>
						This is a sample custom component pre-loaded with the
						Kissflow SDK. <br> Edit <code>index.js</code> to make
						changes.
					</p>
					<p class='sampletext'>
						Click <a
							href='https://kissflow.github.io/lcnc-sdk-js/'
							target='_blank'>
							here
						</a> to read the SDK documentation.
					</p>
				</div>
				<button id="clickHere">Click me</button>
				<img src="kf.logo.png" width="120px" class='logo'></img>
			</div>
		</div>`;
	document
		.getElementById("clickHere")
		.addEventListener("click", () => showUserInfo());
}

export function defaultErrorComponent() {
	document.getElementById("root").innerHTML = `
		<div class='error'>
			<h1>Something went wrong</h1>
			<p>Please use this component within Kissflow platform.</p>
		</div>`;
}
