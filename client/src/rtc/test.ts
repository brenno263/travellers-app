import { rtcConfig } from "./common";

export async function test() {
	console.log("Starting WebRTC test...");
	const pc = new RTCPeerConnection(rtcConfig);
	pc.onicecandidate = (ev) => {
		console.log("ICE candidate event:", ev);
	};
	pc.oniceconnectionstatechange = () => {
		console.log("ICE connection state change:", pc.iceConnectionState);
	};
	pc.onicegatheringstatechange = () => {
		console.log("ICE gathering state change:", pc.iceGatheringState);
	};

	pc.createDataChannel("testChannel");

	const offer = await pc.createOffer({
		offerToReceiveAudio: false,
		offerToReceiveVideo: false,
	});

	await pc.setLocalDescription(offer);

	console.log("Local description set:", pc.localDescription);
}
