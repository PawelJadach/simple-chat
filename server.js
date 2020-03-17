const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));

const messages = [];

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).json({message: 'Not found'});
})

const server = app.listen(port, () => console.log(`Server start on port ${port}`));
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
  console.log('I\'ve added a listener on message event \n');
});