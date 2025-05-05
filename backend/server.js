const http = require("http");
const app = require("./app");
require("dotenv").config();
const Conversation = require("./schema/Conversation");
const API_PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 8000;

// Create HTTP server for Express
const server = http.createServer(app);
// apiServer.listen(API_PORT, () => {
//   console.log(`API Server running on port ${API_PORT}`);
// });

// Create separate HTTP server for Socket.IO
//const socketServer = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
server.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});


// socketServer.listen(SOCKET_PORT, () => {
//   console.log(`Socket.IO server running on port ${SOCKET_PORT}`);
// });

// Socket.IO connection handling
let users = [];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('addUser', (userId) => {
    users = users.filter(user => user.userId !== userId); // Remove if exists
    users.push({ userId, socketId: socket.id });
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ conversationId, senderId, message, receiverId }) => {
    const receiver = users.find(user => user.userId === receiverId);
    if (receiver) {
      io.to([receiver.socketId,socket.id]).emit('getMessage', {
        conversationId,
        sender:{
          _id:senderId,
        },
        message
      })
    }else{
      if(conversationId){
        const func1 = async ()=>{
          const conversation = await Conversation.findById(conversationId);
          conversation.lastMessage = message;
          await conversation.save();
        }
        func1();
        io.to(socket.id).emit('getMessage', {
          conversationId,
          sender:{
            _id:senderId,
          },
          message
        })
      }
    }
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit('getUsers', users);
    console.log('Client disconnected:', socket.id);
  });
});   

module.exports = { server}; 