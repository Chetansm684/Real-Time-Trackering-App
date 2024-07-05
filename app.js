const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set the view engine and static directory
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection handling
io.on("connection", function(socket) {
    console.log("A user connected:", socket.id);

    // Receive location from client and broadcast to all clients
    socket.on("send-location", function(data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    // Handle disconnection
    socket.on("disconnect", function() {
        console.log("User disconnected:", socket.id);
        io.emit("user-disconnected", socket.id);
    });
});

// Route for rendering index.ejs
app.get("/", function(req, res) {
    res.render("index");
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, function() {
    console.log(`Server running on port ${PORT}`);
});
