import express from "express";
import { WebSocketServer } from "ws";
import { PeerId, Repo } from "@automerge/automerge-repo";
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket";
import { NodeFSStorageAdapter } from "@automerge/automerge-repo-storage-nodefs";
import fs from "fs";
import os from "os";

const datadir = ".automerge";
if (!fs.existsSync(datadir)) {
	fs.mkdirSync(datadir);
}

var hostname = os.hostname();

const port = 3000;
const globalSocket = new WebSocketServer({ noServer: true });
const app = express();
app.use(express.static("public"));

const repo = new Repo({
	// @ts-ignore The types don't align for the ws server and what automerge expects.
	// It works anyways!!!
	network: [new NodeWSServerAdapter(globalSocket)],
	storage: new NodeFSStorageAdapter(datadir),
	peerId: `storage-server-${hostname}` as PeerId,
	// Since this is a server, we don't want to share docs with peers who can't ask
	// for them by exact ID.
	sharePolicy: async () => false,
});

app.get("/", (req, res) => {
	res.send("Automerge Repo Signaling Server is running!");
});

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
	globalSocket.handleUpgrade(request, socket, head, (socket) => {
		globalSocket.emit("connection", socket, request);
	});
});
