const url = (window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://abcde.herokuapp.com/api/auth/'

const myForm = document.querySelector('form');


myForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for( let el of myForm.elements) {
      if ( el.name.length > 0 )
      formData[el.name] = el.value
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var myInit = { method: 'POST',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify(formData) };

    var myRequest = new Request(url + 'login/', myInit);

    fetch(myRequest)
      .then(resp => resp.json())
      .then(({msg, token}) => {
        if (msg) {
          return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
      })
      .catch(console.warn)
  
    });

function handleCredentialResponse(response) {

  // Google Token: ID_TOKEN
  // console.log('id_token',response.credential);
  const body = {id_token: response.credential};

    

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var myInit = { method: 'POST',
              headers: myHeaders,
              mode: 'cors',
              cache: 'default',
              body: JSON.stringify(body) };

  var myRequest = new Request(url + 'google/', myInit);

  fetch(myRequest)
    .then(resp => resp.json())
    .then(({token}) => {
      console.log(token); 
      localStorage.setItem('token', token);
      window.location = 'chat.html';
    })
    .catch(console.warn)
  // console.log('id_token',response.credential);
}

const button = document.getElementById('google_signout');

button.onclick = () => {
  console.log(google.accounts.id);

  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem('email'), done => {
    localStorage.clear();
    location.reload();
  });

}

