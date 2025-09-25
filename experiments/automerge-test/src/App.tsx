import "./App.css";
import type { FC } from "react";
import { AutomergeTest } from "./components/AutomergeTest";
import { useRepo, type AutomergeUrl } from "@automerge/react";

export interface AppProps {
	rootDocUrl: AutomergeUrl;
}
export const App: FC<AppProps> = ({ rootDocUrl }) => {
	const repo = useRepo();

	console.log(JSON.stringify(repo.metrics()));

	return (
		<>
			<h1>Automerge Test</h1>
			<p>
				Check the hash on the url! It's the handle for the automerge document
				you're editing.
			</p>
			<p>
				Sharing that url will let others alter the same document,{" "}
				<strong>live</strong>!
			</p>
			<p>
				Check the network tab to see websocket traffic with the sync server.
			</p>

			<AutomergeTest rootDocUrl={rootDocUrl} />
		</>
	);
};

export default App;
