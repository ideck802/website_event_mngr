
if (!pb.authStore.isValid) {
  window.location.href = 'index.html';
}

function logout() {

  pb.authStore.clear();

  window.location.href = 'index.html';
}

function goChangePassword() {

  window.location.href = 'change-password.html';
}

async function testBackend() {

  const response = await fetch(backend + '/get_events');

  const data = await response.json();

  console.log(data);

  const new_json = [{"title":"County Fair Booth","start-date":"6-18-2026","end-date":"6-21-2026","details":"test"},{"title":"Temp","start-date":"7-6-2026","end-date":"7-6-2026","details":"test"}]

  response = await fetch(backend + '/set_events?events=' + JSON.stringify(new_json));
  console.log(await response.json());
}
