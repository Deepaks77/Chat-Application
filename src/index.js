const path=require("path");
const http=require("http");
const express=require("express");
const socketsio=require("socket.io")


const app=express();
const server =http.createServer(app);
const io = socketsio(server)
const port=process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,"../public")
app.use(express.static(publicDirectoryPath))



let count=0;
//serve(emit)--> client (receive that event)--> countUpdated

//client(emit)-->server (receive that event)-->increament

io.on("connection",(socket)=>{
console.log("New WebSocket Connection")
socket.emit('countUpdatedEvent',count)
socket.on("increament",()=>{
    count++;
    io.emit('countUpdatedEvent',count)
})

})

app.get("/",(req,res)=>{
   // res.sendFile(__dirname+"/index.html");
})
server.listen(port,()=>{
    console.log("Server is up and running",port)
})