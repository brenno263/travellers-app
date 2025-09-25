import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _adapter from "webrtc-adapter";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Suspense fallback={<div>Loading...</div>}>
			<App />
		</Suspense>
	</StrictMode>,
);
