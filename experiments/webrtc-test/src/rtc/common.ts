export interface SignalBundle {
	sdp: string;
	candidates: RTCIceCandidateInit[];
}

export const rtcConfig: RTCConfiguration = {
	iceServers: [
		{
			urls: "stun:stun.relay.metered.ca:80",
		},
		{
			urls: "turn:standard.relay.metered.ca:80",
			username: "daee16b4c84fed93c485fb09",
			credential: "yFpi/mDD7/WKkShY",
		},
		{
			urls: "turn:standard.relay.metered.ca:80?transport=tcp",
			username: "daee16b4c84fed93c485fb09",
			credential: "yFpi/mDD7/WKkShY",
		},
		{
			urls: "turn:standard.relay.metered.ca:443",
			username: "daee16b4c84fed93c485fb09",
			credential: "yFpi/mDD7/WKkShY",
		},
		{
			urls: "turns:standard.relay.metered.ca:443?transport=tcp",
			username: "daee16b4c84fed93c485fb09",
			credential: "yFpi/mDD7/WKkShY",
		},
	],
};

export async function waitForIceGathering(
	pc: RTCPeerConnection,
): Promise<void> {
	if (pc.iceGatheringState === "complete") {
		return;
	}
	let onStateChange!: () => void;
	await new Promise<void>((resolve) => {
		onStateChange = () => {
			if (pc.iceGatheringState === "complete") {
				resolve();
			}
		};
		pc.addEventListener("iceconnectionstatechange", onStateChange);
		setTimeout(resolve, 5000);
	});
	// cleanup
	if (onStateChange !== undefined) {
		pc.removeEventListener("iceconnectionstatechange", onStateChange);
	}
}

interface HasEventListeners<EventName, Event> {
	addEventListener: (name: EventName, callback: (e: Event) => void) => void;
	removeEventListener: (name: EventName, callback: (e: Event) => void) => void;
}
/**
 * Adds an event listener, with a callback.
 * The first time the callback doesn't return undefined,
 * clears the event listener and returns the result of the callback.
 * If the timeout lapses, rejects.
 * @param i
 * @param eventName
 * @param callback
 * @returns
 */
export async function eventListenerCallbackToPromise<
	EventName,
	Event,
	I extends HasEventListeners<EventName, Event>,
	R,
>(
	i: I,
	eventName: EventName,
	callback: (e: Event) => R | undefined,
	timeout = 5000,
): Promise<R> {
	return new Promise<R>((resolve, reject) => {
		let timeoutHandle!: ReturnType<typeof setTimeout>;
		const internalCallback = (e: Event) => {
			const res = callback(e);
			if (res !== undefined) {
				i.removeEventListener(eventName, internalCallback);
				clearTimeout(timeoutHandle);
				resolve(res);
			}
		};
		timeoutHandle = setTimeout(
			() => reject("Failed to resolve event: " + eventName),
			timeout,
		);
		i.addEventListener(eventName, internalCallback);
	});
}

export function encodeSignalBundle(sb: SignalBundle): string {
	return btoa(JSON.stringify(sb));
}

export function decodeSignalBundle(s: string): SignalBundle {
	return JSON.parse(atob(s));
}
