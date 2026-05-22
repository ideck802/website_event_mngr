const pb = new PocketBase('http://192.168.2.193:8090');

const statusText = document.getElementById('status');

async function login() {

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {

    await pb.collection('users')
      .authWithPassword(email, password);

    window.location.href = 'dashboard.html';

  } catch (err) {

    console.error(err);

    statusText.innerText = 'Invalid login';
  }
}
