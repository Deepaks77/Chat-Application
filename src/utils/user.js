const users =[];
//every socket is associated with unique id
const addUser = ({id,username,room})=>{
//clean data
username=username.trim().toLowerCase();
room =room.trim().toLowerCase();

if(!username||!room){
    return{
        error:"Username and Room are required"
    }
}

//check for existing user No dublicates are allowed in same Room    
const existinguser = users.find(user=>{
    return user.room === room && user.username ===username
})


//validate user

if(existinguser){
    return{
        error:"UserName is in Use with this Room!"
    }
}

//Store user

const user= {id,username,room}
users.push(user)
return {user}
}

const removeUser=(id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}



const getUser =(id=>{
    const userIndex=users.findIndex(user=>user.id===id);
    if(userIndex===-1)
    return undefined
    return users[userIndex]
})


const getUserInRoom =(room=>{
    return users.filter(user=>user.room===room.trim().toLowerCase())
})


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}