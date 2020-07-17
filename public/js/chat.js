const socket=io();
socket.on("countUpdatedEvent",(count)=>{
    console.log("The Count has been updated",count)
})

document.querySelector('#increment').addEventListener('click',()=>{
    console.log('Clicked')
    socket.emit("increament");
})