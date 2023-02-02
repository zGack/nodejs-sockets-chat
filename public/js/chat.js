const url = (window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://abcde.herokuapp.com/api/auth/'


let user = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulMsg = document.querySelector('#ulMsg');
const ulUsers = document.querySelector('#ulUsers');
const btnLogout = document.querySelector('#btnLogout');

// Validar el token de localStorage
const validarJWT = async () => {

  const token = localStorage.getItem('token') || '';
  
  if (token.length <= 10) {
    window.location = 'index.html';
    throw new Error('No hay token en el servidor');
  }

  const resp = await fetch(url, {
    headers: {'x-token': token}
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem('token', tokenDB);
  user = userDB;
  
  document.title = user.name;

  await conectSocket();

}

const conectSocket = async () => {

  socket = io({
    'extraHeaders': {
      'x-token': localStorage.getItem('token')
    }
  });

  socket.on('connect', () => {
    console.log('Sockets online');
  });

  socket.on('disconnect', () => {
    console.log('Sockets offline');
  });

  socket.on('recv-msg', printMsgs);

  socket.on('active-users', printMsgs);

  socket.on('priv-msg', (payload) =>{
    console.log('Privado: ', payload);
  });
}

const printMsgs = (msgs = []) => {
  let msgsHTML = '';

  console.log(msgs);

  msgs.forEach(({name, msg}) => {
    msgsHTML += `
      <li>
        <p>
          <span class="text-primary">${name}: </span>
          <span>${msg}</span>
        </p>
      </li> 
    `;
  });

  ulMsg.innerHTML = msgsHTML;
}

txtMsg.addEventListener('keyup', ({keyCode}) => {
  const msg = txtMsg.value;
  const uid = txtUid.value;

  if (keyCode !== 13 || msg.length === 0){ return; }

  socket.emit('send-msg', {msg, uid});

  txtMsg.value = '';

});

const main = async () => {

  // validar JWT
  await validarJWT();

}

main();

// const socket = io();