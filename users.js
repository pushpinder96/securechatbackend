const users = [];

const addNewUser = ({id,name,room,adminname,getimage})=>{
    
    name=name.trim().toLowerCase();
    room=room.trim().toLowerCase(); 

    let existingUser = users.find(user=>{user.name==name && user.room == room});

    if(existingUser){
        return {error:'Username Is Taken'};
    }

    const user = { id , name , room,adminname,getimage};
    users.push(user);
  //  console.log(users);

    for(let i =0;i<users.length;i++){

    }
    return user;
};

const removerExistingUser = (id)=>{
 const indexOfUser = users.findIndex(user=>{ return user.id ==id});
  if(indexOfUser !== -1){
      return users.splice(indexOfUser,1)[0];
  }
   
};

const getUser =(id)=>{
  return  users.find(user=>{ return user.id==id}); 
};

const getUsersInRoom = (room)=>{
  //console.log(room);
  return  users.filter(user=>{

         return user.room==room
        }
        )};

const updateUsersProfile = (id,room,getimage)=>{
 const usersinoneroom= getUsersInRoom(room);  

   let SelectedUser= usersinoneroom.filter(user=>{
     return user.id==id
   })
   SelectedUser[0].getimage = getimage;
   return usersinoneroom;
 };        

module.exports={addNewUser,removerExistingUser,getUser,getUsersInRoom,updateUsersProfile};