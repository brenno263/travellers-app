# WebRTC Test

This test app was built to try out WebRTC with no helper libraries. It was
pretty sick learning the negotiation protocol!

## How it works

In summary, to open a bidirectional datachannel (or video or audio channel), we
need a WebRTC offer, and a WebRTC answer. Client 1 initializes a PeerConnection
and makes an offer, which is sent to client 2. This offer contains information
about the channels to be opened, metadata, and importantly ICE candidates to be
used to form a p2p connection. Client 2 processes the offer, and builds an
answer with its own information and ICE candidates, which is sent back to Client

1. Once client 1 processes this answer the connection is established and
   communications can commence.

In this demo, we bundle up these offers or answers into SignalBundles, which are
serialized them to JSON then encoded to base64. This gives us some very
copypasteable strings that we can send back and forth.

## Why we didn't pick this direction

The main benefit of WebRTC is high throughput and latency over p2p connections.
The primary reason that I was interested in it was the idea that we could avoid
deploying a server and could statically host an app that communicates
exclusively p2p.

First, we needed STUN and TURN servers to get ICE to work. I was able to find
free options for these, so no problem.

However, the signaling overhead is... high. For just two clients, it's not too
bad to send a few chunky base64 strings back and forth, but we're trying to make
an application for ideally 3-6 peers at a time. In a 6 peer situation, if we
were to designate one person the host and the others as clients, then the host
would need to send out 5 offers, and recieve+paste 5 answers. Not too bad, but
assuredly clunky. However then we'd need to figure out how to migrate hosts if
the host drops, or else the application would crash if the host disconnects. A
more resilient mesh network (every peer connects to every other peer), would
require the 5 offers and 5 answers for _every peer_, exponentially increasing
the clunkiness.

The other concern is staleness, WebRTC expects to be continually informed of
changes in ICE candidates. If we were to negotiate once with signal/candidate
bundles, as network topology shifts the connection could degrade significantly
over time.

The solution to this signaling overhead of course is to build a websocket server
to share signal info between clients. They could connect with a room code or
something, transact signal info through the server, and establish p2p
connections. At this point however, we've done all this work to _still need a
server_. At this point we might as well just use a websocket server. Automerge
works just fine over websockets, and our networking needs are really minimal, so
we don't need the improved bandwidth and latency of WebRTC. Check out the
[automerge-test](../automerge-test/README.md) experiment for an idea of our
chosen solution.
