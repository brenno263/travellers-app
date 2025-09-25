import { rtcConfig, type SignalBundle, waitForIceGathering } from "./common";

export interface RTCAnswerer {
	pc: RTCPeerConnection;
	dc?: RTCDataChannel;
	localSignals: SignalBundle;
}

export async function createAnswerer(
	offerBundle: SignalBundle,
	dcCallback: (dc: RTCDataChannel) => void,
): Promise<RTCAnswerer> {
	const pc = new RTCPeerConnection(rtcConfig);

	const candidates: RTCIceCandidateInit[] = [];
	pc.onicecandidate = (e) => {
		console.log("ICE candidate event:", e);
		if (e.candidate) {
			candidates.push(e.candidate.toJSON());
		}
	};

	console.log(
		"Created RTCPeerConnection, waiting for ICE gathering to complete...",
	);

	// injest the offer signals
	await pc.setRemoteDescription({ type: "offer", sdp: offerBundle.sdp });
	for (const c of offerBundle.candidates) await pc.addIceCandidate(c);

	const answer = await pc.createAnswer();
	await pc.setLocalDescription(answer);

	await waitForIceGathering(pc);
	const sdp = pc.localDescription!.sdp!;

	// hold a promise for the data channel for once it's available from the offerer
	pc.ondatachannel = (ev) => {
		console.log("Data channel event:", ev);
		ev.channel.onopen = () => console.log("DC Open");
		ev.channel.onclose = () => console.log("DC Close");
		dcCallback(ev.channel);
	};

	return {
		pc: pc,
		dc: undefined,
		localSignals: {
			sdp: sdp,
			candidates: candidates,
		},
	};
}
