const users = [];


////create function Accpete {id,username, Room}

const AddUser = ({ id, username, room }) => {
     username=username.trim().toLowerCase();
     room=room.trim().toLowerCase();
    ///Empty User name and room
    if (!username || !room) {
        return { error: "Please Fill your ROOM" }
    }
    const feildUser = users.find((user) =>user.username === username && user.room === room)
    if (feildUser) {
        return { error: "Please this username Is taken Change It" }
    }

    const user = { id, username, room };
    users.push(user)
    return { user };

}


///////Remove function with Id 

const removeuser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

}

////GET User with there Id ////////
const getUser = (id) => {
    const userFinded = users.find((user) => user.id === id);
    return userFinded
}


// Get All uSER IN room ////////

const getUsersRoom = (room) => {
    const roomtrim = room.trim().toLowerCase();
    const filterRoom = users.filter((user) => user.room === roomtrim)
    return filterRoom
}

module.exports={getUsersRoom,getUser,removeuser,AddUser}