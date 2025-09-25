import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
	IndexedDBStorageAdapter,
	isValidAutomergeUrl,
	Repo,
	RepoContext,
	WebSocketClientAdapter,
} from "@automerge/react";

import { createRootDocument, getStoredRootDocUrl } from "./rootDoc.ts";

const repo = new Repo({
	network: [new WebSocketClientAdapter("ws://localhost:3000")],
	storage: new IndexedDBStorageAdapter("travellers-app"),
});

// pull the root doc ID from the URL hash. ie. http://localhost:5173/#docId
const rootDocUrlHash = `${document.location.hash.substring(1)}`;
let handle;
if (isValidAutomergeUrl(rootDocUrlHash)) {
	handle = await repo.find(rootDocUrlHash);
} else {
	const storedUrl = getStoredRootDocUrl();
	if (storedUrl && isValidAutomergeUrl(storedUrl)) {
		handle = await repo.find(storedUrl);
	} else {
		handle = createRootDocument(repo);
	}
}
document.location.hash = handle.url;
const rootDocUrl = handle.url;

createRoot(document.getElementById("root")!).render(
	<RepoContext.Provider value={repo}>
		<StrictMode>
			<Suspense fallback={<div>Loading...</div>}>
				<App rootDocUrl={rootDocUrl} />
			</Suspense>
		</StrictMode>
	</RepoContext.Provider>,
);
