import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
cors: {
    origin: "*",
    methods: ["GET", "POST"]
}
});

app.use(cors());

let rooms = {}; // Store code for each room
let roomUsers = {}; // Store number of users per room

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("joinRoom", (roomID) => {
        socket.join(roomID);
        console.log(`User ${socket.id} joined room ${roomID}`);

        // Initialize room if it doesn't exist
        if (!rooms[roomID]) {
            rooms[roomID] = "// Start coding here!";
            roomUsers[roomID] = 0;
        }

        // Increment user count and broadcast update
        roomUsers[roomID]++;
        io.to(roomID).emit("updateUserCount", roomUsers[roomID]);

        // Send existing code to the new user
        socket.emit("codeUpdate", rooms[roomID]);
    });

    socket.on("codeChange", ({ roomID, code }) => {
        rooms[roomID] = code; // Update stored code
        socket.to(roomID).emit("codeUpdate", code); // Send update to other users in the room
    });

    socket.on("disconnecting", () => {
        for (let roomID of socket.rooms) {
            if (roomUsers[roomID]) {
                roomUsers[roomID]--;

                // If no users left, remove the room
                if (roomUsers[roomID] <= 0) {
                    delete rooms[roomID];
                    delete roomUsers[roomID];
                } else {
                    io.to(roomID).emit("updateUserCount", roomUsers[roomID]);
                }
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
    });
});

server.listen(4000, () => {
    console.log("Server running on port 4000");
});
