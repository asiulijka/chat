const loginForm = document.getElementById('welcome-form'); // referencja do formularza logowania.
const messagesSection = document.getElementById('messages-section'); // referencja do sekcji z wiadomościami.
const messagesList = document.getElementById('messages-list'); // referencja do samej listy wiadomości.
const addMessageForm = document.getElementById('add-messages-form'); // referencja do formularza dodawania wiadomości.
const userNameInput = document.getElementById('username'); // referencja do pola tekstowego z formularza logowania.
const messageContentInput = document.getElementById('message-content');// referencja do pola tekstowego z formularza do wysyłania wiadomości.

let userName = "";
const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));

loginForm.addEventListener('submit', function(event){
  event.preventDefault();
  if (userNameInput.value == "") {
    alert("Name must be filled out");
  } else {
    userName = userNameInput.value;
    messagesSection.classList.add("show");
    loginForm.classList.remove("show");
    socket.emit('join', {userName});
  }
});

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

function sendMessage(e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;
  let author = userNameInput.value;

  if(!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(author, messageContent);
    socket.emit('message', { author: author, content: messageContent })
    messageContentInput.value = '';
  }

}

addMessageForm.addEventListener('submit', function(event){
  event.preventDefault();
  console.log(addMessageForm);
  sendMessage(event);
});






