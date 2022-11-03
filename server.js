
const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addNewUser,removerExistingUser,getUser,getUsersInRoom,updateUsersProfile} = require('./users');

const port = process.env.PORT || 5000;
const socketserver = http.createServer(app);
const io = socketio(socketserver);

let cors = require('cors');
let bodyParser = require('body-parser');
let nodemailer = require('nodemailer');

app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

//socket connection

io.on('connection' ,(socket)=>{



   socket.on('join-room',({name,room,adminname,getimage})=>{
   
    const newuser = addNewUser({
                    id:socket.id,
                    name,
                    room,
                    adminname,
                    getimage});

         socket.join(newuser.room);

         socket.emit('admin-message', {
                user:`${adminname} has created a new room!!`
              });

         socket.broadcast.to(`${newuser.room}`)
                          .emit('new-user-joined',
                          {newUserName:`${newuser.name} 
                          has joined the room!!`});
        //io.to(newuser.room).emit('roomData', { room: newuser.room, users: getUsersInRoom(newuser.room) });
              
})
       
       socket.on('allusers',({name,room,adminname,getimage})=>{
        io.to(room).emit('roomData', {  users: updateUsersProfile(socket.id,room,getimage)
        });
       })
           
   
          socket.on('send-message',({message,AttachedData})=>{
         const user = getUser(socket.id);
         
            io.to(user.room).emit('recieve-message', { user: user.name, text: message , attachedFile: AttachedData , id:user.id });
              console.log('message recieved',{message,AttachedData});
           })

    


  var clients =  io.allSockets();
 
  socket.on('disconnect',()=>{
    
    const getuser = getUser(socket.id);
    const user = removerExistingUser(socket.id);


 io.to(getuser.room).emit('roomData', {  users: getUsersInRoom(getuser.room) });
     

    if(user){

      socket.broadcast.to(`${user.room}`)
      .emit('user-left',
      {newUserName:`${user.name} 
      has left the chat!!`});
      
    }
    console.log(user.name,'user disconnected');
  })
})



//send email section
let transporter = nodemailer.createTransport({
host:'smtp.outlook.com',
port:587,
secure:false,
 
  auth: {
    user: 'pushpindertechdemo@outlook.com',
    pass:'ONEvsall123$'
    //pass: 'ONEvsall123$'
  }
});

app.post('/roomcreated',(req,res)=>{
  const name = req.body.name;
  const email=req.body.email;
  const roomNumber=req.body.room;
  
  
  let mailOptions = {
    from: 'pushpindertechdemo@outlook.com',  
    to: `${email} ${name}`,
    subject: 'New Chat Room Created For You.',
    text: `You Can Access Your Chat Room By This Room Number ${roomNumber}`
  };
  
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error,mailOptions);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

})

socketserver.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})