import type { AutomergeUrl, DocHandle, Repo } from "@automerge/react";

const ROOT_DOC_URL_KEY = "root-doc-url";

export interface RootDocument {
	sharedText: string;
}

export const createRootDocument = (repo: Repo): DocHandle<RootDocument> => {
	return repo.create<RootDocument>({ sharedText: "" });
};

export const storeRootDocUrl = (url: AutomergeUrl) => {
	localStorage.setItem(ROOT_DOC_URL_KEY, url);
};

export const getStoredRootDocUrl = (): AutomergeUrl | null => {
	const url = localStorage.getItem(ROOT_DOC_URL_KEY);
	return url ? (url as AutomergeUrl) : null;
};
