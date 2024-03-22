let kf;

function showInfo() {
	// Similarly we can also get user and account details
	// via kf.user and kf.account respectively

	kf.client.showInfo("Welcome" + kf.user.Name);
	// kf.client.showInfo(kf.account);
	document.getElementById("greet").innerHTML = "<h3>Welcome " + kf.user.Name + "</h3>";
}

window.onload = async function () {
	kf = await window.kf.initialise().catch((err) => {
		console.error("Error initializing kissflow", err);
	});

	// let platform = kf.env?.isMobile ? "Mobile" : "Desktop";
	showInfo();

	// Subscribe to watch params changes on load method.
	// kf.context.watchParams(function (data) {});
};
