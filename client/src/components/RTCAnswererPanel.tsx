import { useState, type FC } from "react";
import { decodeSignalBundle, encodeSignalBundle } from "../rtc/common";
import { createAnswerer, type RTCAnswerer } from "../rtc/answerer";

export const RTCAnswererPanel: FC = () => {
	const [logs, setLogs] = useState<string[]>([]);
	const [output, setOutput] = useState<string>("");
	const [input, setInput] = useState<string>("");
	const [chatMsg, setChatMsg] = useState<string>("");

	const [answerer, setAnswerer] = useState<RTCAnswerer>();
	const [answererStatus, setAnswererStatus] = useState<string>("uninitialized");

	const pushLog = (message: string) => {
		setLogs((prevLogs) => [...prevLogs, message]);
	};

	const handleInitialize = async () => {
		if (answerer) return;
		if (!input) {
			pushLog("Please provide offerer data in the input box");
			return;
		}
		pushLog("Initializing answerer...");
		const signalBundle = decodeSignalBundle(input);
		console.log("Decoded signal bundle:", signalBundle);
		const newAnswerer = await createAnswerer(signalBundle, (dc) => {
			console.log("Data channel received:", dc);
			newAnswerer.dc = dc;
			newAnswerer.dc.onmessage = (event) => {
				pushLog(`Received message: ${event.data}`);
			};
			pushLog("Data channel connected");
			setAnswererStatus("connected");
		});

		setOutput(encodeSignalBundle(newAnswerer.localSignals));
		setAnswerer(newAnswerer);
		pushLog("Please return this data to the offerer");
	};

	const handleSendChatMessage = () => {
		if (!answerer || !answerer.dc || answerer.dc.readyState !== "open") {
			pushLog("Data channel not open");
			return;
		}
		answerer.dc.send(chatMsg);
		pushLog(`Sent message: ${chatMsg}`);
		setChatMsg("");
	};

	return (
		<div className="card">
			<h1>Answerer Test</h1>
			<button onClick={handleInitialize}>Initialize Answerer</button>
			<label htmlFor="answerer_logs">Answerer Logs</label>
			<textarea
				id="answerer_logs"
				rows={10}
				cols={60}
				readOnly
				value={logs.join("\n")}
			/>

			<label htmlFor="answerer_input">Answerer Input</label>
			<textarea
				id="answerer_input"
				rows={10}
				cols={60}
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>

			<label htmlFor="answerer_output">Answerer Output</label>
			<textarea
				id="answerer_output"
				rows={10}
				cols={60}
				readOnly
				value={output}
			/>

			<label htmlFor="chat_message">Chat Message</label>
			<input
				id="chat_message"
				type="text"
				value={chatMsg}
				onChange={(e) => setChatMsg(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSendChatMessage();
					}
				}}
			/>
			<button onClick={handleSendChatMessage}>Send Chat Message</button>
		</div>
	);
};
