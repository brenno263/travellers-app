import "./App.css";
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
		</>
	);
};

export default App;
