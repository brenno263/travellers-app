import { updateText, useDocument, type AutomergeUrl } from "@automerge/react";
import type { FC } from "react";
import type { RootDocument } from "../rootDoc";

export interface AutomergeTestProps {
	rootDocUrl: AutomergeUrl;
}
export const AutomergeTest: FC<AutomergeTestProps> = ({ rootDocUrl }) => {
	const [doc, changeDoc] = useDocument<RootDocument>(rootDocUrl);

	return (
		<div className="card">
			<h1>Automerge Test Component</h1>
			<input
				type="text"
				value={doc?.sharedText || ""}
				onChange={(e) =>
					changeDoc((d) => {
						updateText(d, ["sharedText"], e.target.value);
					})
				}
			/>
		</div>
	);
};
