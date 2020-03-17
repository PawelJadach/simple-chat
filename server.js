const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));

const messages = [];
const users = [];

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).json({message: 'Not found'});
})

const server = app.listen(port, () => console.log(`Server start on port ${port}`));
const io = socket(server);

io.on('connection', (socket) => {
  
  socket.on('login', (userName) => {
    users.push({id: socket.id, userName: userName.userName});
    socket.broadcast.emit('message', {author: 'Chat Bot', content: `${userName.userName} has joined the conversation!`});
  });

  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    const user =  users[users.findIndex(user => user.id === socket.id)];
    io.emit('message', {author: 'Chat Bot', content: `${user.userName} has left the conversation... :(`});
    users.splice(users.findIndex(user => user.id === socket.id), 1);
  });
});