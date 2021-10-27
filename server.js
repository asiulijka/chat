const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

app.use(express.static(path.join(__dirname, '/client')));

let messages = [];
let users = [];

const serverName = 'Czat Bot';

app.get('/', (req, res) => {
  res.render('index.html');
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', ({userName}) => {
    console.log('Ooo, new user! - ' + userName);
    users.push({userName, id: socket.id});
    socket.broadcast.emit(
      'message', 
      {
        author: serverName, 
        content: userName + ' has joined the conversation!'
      }
    ); 
  });

  socket.on('disconnect', (reason) => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    const userWhoLeft = users.splice(users.map(e => e.id).indexOf(socket.id), 1);

    if (userWhoLeft.length){
      socket.broadcast.emit(
        'message', 
        {
          author: serverName, 
          content: userWhoLeft[0].userName + ' has left the conversation... :('
        }
      ); 
    }
    
  });

  console.log('I\'ve added a listener on message and disconnect events \n');
});