const path = require("path");
const http = require("http");
const express = require("express");
const socketsio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage } = require("./utils/messages")
const { addUser,
    removeUser,
    getUser,
    getUserInRoom
} = require("./utils/user");
const app = express();
const server = http.createServer(app);
const io = socketsio(server)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, "../public")


app.use(express.static(publicDirectoryPath))



//let count=0;
//serve(emit)--> client (receive that event)--> countUpdated

//client(emit)-->server (receive that event)-->increament

//socket means koi user aya connection event fire hua us particular user ke pass kayga
//io means all connected users ke pass jae notification
io.on("connection", (socket) => {
    console.log("New WebSocket Connection")
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error)
            return callback(error);
        socket.join(user.room)
        //socket.join --> will give a new way to emit events that will be only in that room 
        //written below
        //io.to.emit --> emit to everybody in room
        //socket.broadcast.to.emit --> emit to everybody except sender in room 
        //lets fill now:

        socket.emit("Message", generateMessage("System Admin", "Welcome"))
        socket.broadcast.to(user.room).emit("Message", generateMessage("System Admin", `${user.username} has joined!`)) //broadcast send to all sockets but not current socket
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback();
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        if (user) {
            const filter = new Filter();
            if (filter.isProfane(message)) {
                return callback("Profanity is not allowed!")
            }
            io.to(user.room).emit("Message", generateMessage(user.username, message))
            callback();
        }
    })
    socket.on("sendLocation", ({ latitude, longitude }, callback) => {
        const user = getUser(socket.id);
        if (user) {
            io.to(user.room).emit("LoctionMessage", generateMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
            callback()
        }
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("Message", generateMessage("System Admin", `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })
})

app.get("/", (req, res) => {

})


server.listen(port, () => {
    console.log("Server is up and running", port)
})