import "./App.css";
import { RTCOffererPanel } from "./components/RTCOffererPanel";
import { RTCAnswererPanel } from "./components/RTCAnswererPanel";
import { test } from "./rtc/test";
import type { FC } from "react";

export const App: FC = () => {
	return (
		<>
			<h1>Automerge Test</h1>
			<h1>WebRTC Test</h1>
			<button onClick={test}>
				test gathering ICE candidates {"(check console)"}
			</button>
			<div style={{ display: "flex", gap: "2em" }}>
				<RTCOffererPanel />
				<RTCAnswererPanel />
			</div>
		</>
	);
};

export default App;
