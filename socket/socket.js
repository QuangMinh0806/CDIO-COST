const {Server} = require("socket.io");
const http = require("http");
const express = require("express");


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

const getReceiverId = (receiverId) => {
	return userSocket[receiverId];
};

const userSocket = {};


io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;

	if(userId != "undefined") userSocket[userId] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocket));

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocket[userId];
		io.emit("getOnlineUsers", Object.keys(userSocket));
	});
});

module.exports = {app, server, io, getReceiverId};