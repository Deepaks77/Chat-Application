const socket=io();

const $messageform=document.querySelector('#message_form')
const $messageforminput=document.querySelector("input");
const $messageformbutton=document.querySelector("button")
const $sendlocationbutton=document.querySelector("#send-location");
const $messageframe=document.querySelector("#message-frame");

//Templates
const $messagetemplate=document.querySelector("#message-template").innerHTML;
const $locationmessagetemplate=document.querySelector("#Location-message-template").innerHTML;

//sidebarTemplate
const $sidebartemplate=document.querySelector("#sidebar-template").innerHTML;

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll =()=>{
    //new Message element
    const $newMessage=$messageframe.lastElementChild;
    
    //Height of the new Message
    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargin=parseInt(newMessageStyle.marginBottom);
    const newMessageHeight=newMessageMargin + $newMessage.offsetHeight
    
    console.log("New Mesage Height",newMessageHeight);
    //visible height
    const visibleHeight=$messageframe.offsetHeight

    console.log("Visible Height",visibleHeight)
    //Height of message container that i can't see but messages are there
    const containerHeight =$messageframe.scrollHeight


    console.log("Container Height",containerHeight);
    //How much i have scrolled down refer to Top?
    const scrolloffset=$messageframe.scrollTop+ visibleHeight;
    console.log("ScrollOffset",scrolloffset)
    if(containerHeight - newMessageHeight <=scrolloffset){
        $messageframe.scrollTop=$messageframe.scrollHeight;
    }
}

socket.on("Message",(message)=>{
    console.log(message);
    const html = Mustache.render($messagetemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('hh:mm a')
    });
    $messageframe.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

socket.on("LoctionMessage",(lmessage)=>{
    const html = Mustache.render($locationmessagetemplate,{
        username:lmessage.username,
        url:lmessage.text,
        createdAt:moment(lmessage.createdAt).format('hh:mm a')
    });
    $messageframe.insertAdjacentHTML('beforeend',html);
    autoScroll();
    console.log(lmessage);
})

socket.on("roomData",({room,users})=>{
const html= Mustache.render($sidebartemplate,{
    room,
    users
})
document.querySelector("#sidebar").innerHTML=html
})

$messageform.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageformbutton.disabled=true;
    const formData = new FormData(e.target);
    const inputmessage=formData.get("message")
    socket.emit("sendMessage",inputmessage,(error)=>{
        $messageformbutton.disabled=false;
        $messageforminput.value='';
        $messageforminput.focus();
        if(error)
        return alert(error);
        console.log("This Message Was Delivered")
    });

});


$sendlocationbutton.addEventListener("click",()=>{
    if(!navigator.geolocation)
    return alert("Geolocation is not supported by your browser");
    $sendlocationbutton.disabled=true;
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("sendLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
           console.log("Location Sent Successfully") 
           $sendlocationbutton.disabled=false;
        })
        
    })
})


socket.emit('join' ,{username , room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }

})
// socket.on("countUpdatedEvent",(count)=>{
//     console.log("The Count has been updated",count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit("increament");
// })