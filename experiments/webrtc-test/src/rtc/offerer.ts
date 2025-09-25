import { rtcConfig, type SignalBundle, waitForIceGathering } from "./common";

export interface RTCOfferer {
	pc: RTCPeerConnection;
	dc: RTCDataChannel;
	localSignals: SignalBundle;
	send: (t: string) => void;
}

export async function createOfferer(
	dataChannelName: string,
): Promise<RTCOfferer> {
	const pc = new RTCPeerConnection(rtcConfig);
	const dc = pc.createDataChannel(dataChannelName);
	dc.onopen = () => console.log("DC Open");
	dc.onclose = () => console.log("DC Close");

	const candidates: RTCIceCandidateInit[] = [];

	pc.onicecandidate = (ev) => {
		console.log("ICE candidate event:", ev);
		if (ev.candidate) {
			candidates.push(ev.candidate.toJSON());
		}
	};
	const offer = await pc.createOffer({
		offerToReceiveAudio: false,
		offerToReceiveVideo: false,
	});
	await pc.setLocalDescription(offer);
	await waitForIceGathering(pc);
	const sdp = pc.localDescription!.sdp;
	return {
		pc: pc,
		dc: dc,
		localSignals: {
			sdp: sdp,
			candidates: candidates,
		},
		send: (t) => dc.send(t),
	};
}

export async function applyAnswer(
	offerer: RTCOfferer,
	answerSDP: string,
): Promise<void> {
	await offerer.pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
}
