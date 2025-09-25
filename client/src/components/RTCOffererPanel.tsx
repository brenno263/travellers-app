import { useState, type FC } from "react";
import { applyAnswer, createOfferer, type RTCOfferer } from "../rtc/offerer";
import { decodeSignalBundle, encodeSignalBundle } from "../rtc/common";

type OffererStatus = "uninitialized" | "waiting_for_answer" | "connected";

export const RTCOffererPanel: FC = () => {
	const [logs, setLogs] = useState<string[]>([]);
	const [output, setOutput] = useState<string>("");
	const [input, setInput] = useState<string>("");
	const [chatMsg, setChatMsg] = useState<string>("");

	const [offerer, setOfferer] = useState<RTCOfferer>();

	const [status, setStatus] = useState<OffererStatus>("uninitialized");

	const pushLog = (message: string) => {
		setLogs((prevLogs) => [...prevLogs, message]);
	};

	const handleInitialize = async () => {
		if (offerer) return;
		pushLog("Initializing offerer...");
		const newOfferer = await createOfferer("chat");
		newOfferer.dc.onmessage = (ev) => {
			pushLog(`Received message: ${ev.data}`);
		};

		pushLog("Offerer initialized");
		setOutput(encodeSignalBundle(newOfferer.localSignals));
		setOfferer(newOfferer);
		pushLog("Please send this data to the answerer");
		pushLog(
			"Once you receive their response, paste it into the input box and submit",
		);
		setStatus("waiting_for_answer");
	};

	const handleInputSubmit = async () => {
		if (!offerer) {
			pushLog("Offerer not initialized");
			return;
		}
		try {
			const remoteSignals = decodeSignalBundle(input);
			await applyAnswer(offerer, remoteSignals.sdp);
			pushLog("Answer applied");
			setStatus("connected");

			setOutput(encodeSignalBundle(offerer.localSignals));
		} catch (error) {
			pushLog(`Error handling input: ${(error as Error).message}`);
		}
	};

	const handleSendChatMessage = () => {
		if (!offerer || offerer.dc.readyState !== "open") {
			pushLog("Data channel not open");
			return;
		}
		offerer.send(chatMsg);
		pushLog(`Sent message: ${chatMsg}`);
		setChatMsg("");
	};

	return (
		<div className="card">
			<h1>Offerer Test</h1>
			<p>status: {status}</p>
			<button onClick={handleInitialize}>Initialize Offerer</button>
			<label htmlFor="offerer_logs">Offerer Logs</label>
			<textarea
				id="offerer_logs"
				rows={10}
				cols={60}
				readOnly
				value={logs.join("\n")}
			/>

			<label htmlFor="offerer_input">Offerer Input</label>
			<textarea
				id="offerer_input"
				rows={10}
				cols={60}
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<button onClick={handleInputSubmit}>Submit Input</button>

			<label htmlFor="offerer_output">Offerer Output</label>
			<textarea
				id="offerer_output"
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
