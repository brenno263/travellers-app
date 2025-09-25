import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
	plugins: [wasm(), react()],

	build: {
		target: "esnext",
	},

	server: {
		host: "127.0.0.1",
	},

	worker: {
		format: "es",
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		plugins: () => [wasm()],
	},
});
