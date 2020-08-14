const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const badwords = require("bad-words");
const { generateTime, generateTimeLocation } = require("./utils/generateTime");
const { getUsersRoom, getUser, removeuser, AddUser } = require("./utils/users");
const e = require("express");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public")
const filter = new badwords;

app.use(express.static(publicDir));



io.on("connection", (socket) => {


    socket.on("join", ({ username, room }, callback) => {
        const { user, error } = AddUser({ id: socket.id, username, room });
        if (error) {
            console.log(error)
            return callback(error)
        }

        socket.join(user.room);
        socket.emit("message", generateTime("Admin", "Welcom !"));
        socket.broadcast.to(user.room).emit("message", generateTime("Admin", `${user.username} HAS JOINED !`));
        io.to(user.room).emit("DataRoom", {
            users: getUsersRoom(user.room),
            room: user.room
        })
        callback()
    })
    socket.on("sendMessage", (message, callback) => {
        if (filter.isProfane(message)) {
            return callback("bad-words is not allowds !")
        }
        const user = getUser(socket.id);

        io.to(user.room).emit("message", generateTime(user.username, message));
        callback()
    })

    socket.on("sendLocation", (location, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("messageLocation", generateTimeLocation(user.username, `https://google.com/maps?q=${location.lat},${location.long}`));
        callback("Location Shared dd !")
    })
    ////Disconnected ////
    socket.on("disconnect", () => {
        const user = removeuser(socket.id)
        if (user) {
            io.to(user.room).emit("message", generateTime("Admin", `${user.username} Has Left !`))
           
            io.to(user.room).emit("DataRoom", {
                users: getUsersRoom(user.room),
                room: user.room
            })
        }
    })

})

// let count = 0;

// io.on("connection", (socket) => {

//     console.log("New Web Socket Connection !")
//     socket.emit("countUpdated", count)

//     socket.on("increment", () => {
//         count++;
//         io.emit("countUpdated", count)
//     })
// })

server.listen(port, () => {
    console.log(`serever is up in port ${port}`)
})