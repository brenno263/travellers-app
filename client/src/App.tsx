import "./App.css";
import { RTCOffererPanel } from "./components/RTCOffererPanel";
import { RTCAnswererPanel } from "./components/RTCAnswererPanel";
import { test } from "./rtc/test";
import type { FC } from "react";
import { AutomergeTest } from "./components/AutomergeTest";
import type { AutomergeUrl } from "@automerge/react";

export interface AppProps {
	rootDocUrl: AutomergeUrl;
}
export const App: FC<AppProps> = ({ rootDocUrl }) => {
	return (
		<>
			<h1>Automerge Test</h1>
			<AutomergeTest rootDocUrl={rootDocUrl} />
			<h1>WebRTC Test</h1>
			<button onClick={test}>test</button>
			<div style={{ display: "flex", gap: "2em" }}>
				<RTCOffererPanel />
				<RTCAnswererPanel />
			</div>
		</>
	);
};

export default App;
