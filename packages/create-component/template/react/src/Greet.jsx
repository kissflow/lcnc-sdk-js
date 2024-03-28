import { kfSdk } from "./sdk/index.js";

export function Greet() {
	return <h3>Welcome {kfSdk.user.Name}</h3>;
}
