const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content)); //listener
let userName = '';


loginForm.addEventListener('submit', e => {
  e.preventDefault();
  if(userNameInput.value !== ''){
    userName = userNameInput.value;
    loginForm.classList.toggle('show');
    messagesSection.classList.toggle('show');
    socket.emit('login', { userName: userName })
  } else alert('Wpisz dane!');
});

addMessageForm.addEventListener('submit', e => {
  e.preventDefault();
  if(messageContentInput.value !== '') {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value })
    messageContentInput.value = '';
  }
  else alert('Wypełnij pole!');
})

const addMessage = (author, message) => {
  const li = document.createElement('li');
  li.classList.add('message', 'message--received');
  if(userName === author) li.classList.add('message--self');
  const h3 = document.createElement('h3');
  h3.classList.add('message__author');
  const div = document.createElement('div');
  div.classList.add('message__content');

  if(author === userName) h3.innerText = 'You'
  else h3.innerText = author
  div.innerText = message;

  if(author === 'Chat Bot') div.classList.add('i');
  li.appendChild(h3);
  li.appendChild(div);
  messagesList.appendChild(li);
}