import { useKFSdk } from "./sdk";

export function Greet() {
	const kf = useKFSdk();
	return <h3>Welcome {kf.user.Name}</h3>;
}
