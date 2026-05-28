
const main = document.getElementById('main');
const dialog = document.getElementById('dialog');

let events = [];

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

function renderDash() {
  let html = `<div class='events'>
    <div class='actions'>
      <button onclick='addEvent()'>Add Event</button>
      <button onclick='storeEvents()'>Store Events</button>
      <button onclick='loadEvents()'>Load Stored Events</button>
      <button onclick='setEvents()'>Publish Events</button>
    </div>`;

  events.forEach(event => {
    html += `<div class="event" id='event${events.indexOf(event)}'>
      <h3>${event.title}</h3>
      <p>${event.start_date} to ${event.end_date}</p>
      <p>${event.details}</p>
      <button onclick='editEvent(${events.indexOf(event)})'>Edit</button>
      <button onclick='deleteEvent(${events.indexOf(event)})'>Delete</button>
    </div>`;
  });

  html += `</div>`;

  main.innerHTML = html;
}

function sortEvents(events) {
  return events;
}

function toggleTime() {
  const timeToggle = document.getElementById('time_toggle');
  const startTime = document.getElementById('start_time');

  if (timeToggle.checked) {
    startTime.style.display = 'inline-block';
  } else {
    startTime.style.display = 'none';
  }
}

function toggleSameDate() {
  const sameDateToggle = document.getElementById('same_date');
  const endDateInput = document.getElementById('end_date');

  if (sameDateToggle.checked) {
    endDateInput.value = document.getElementById('start_date').value;
    endDateInput.disabled = true;
  } else {
    endDateInput.disabled = false;
  }
}

function editEvent(index, isNew = false) {
  const event = events[index];

  let html = `<h3>Edit Event</h3>
    <div class='row'>
      <p>Title:</p>
      <input type='text' id='title' value='${event.title}'>
    </div>
    <input type='checkbox' id='time_toggle' `;

  if (event.start_time !== false) {
    html += 'checked ';
  }

  html += `onchange='toggleTime()'/>
    <label for='time_toggle'>Include start time</label>
    <div class='row'>
      <p>Start Date:</p>
      <input type='date' id='start_date' value='${event.start_date}'>
      <input type='time' id='start_time' value='${event.start_time || '00:00'}'>
    </div>
    <input type='checkbox' id='same_date' ${event.start_date === event.end_date ? 'checked' : ''} 
      onchange='toggleSameDate()'/>
    <label for='same_date'>End date same as start date</label>
    <div class='row' id='end_date_row'>
      <p>End Date:</p>
      <input type='date' id='end_date' value='${event.end_date}'>
    </div>
    <div class='row'>
      <p>Details:</p>
      <textarea id='details'>${event.details}</textarea>
    </div>
    <div class='row'>
      <button onclick='saveEvent(${index})'>Save</button>
      <button onclick='`;

  if (isNew) {
    html += `deleteEvent(${index});`;
  }

  html += `closeDialog()'>Cancel</button>
  </div>`;

  dialog.innerHTML = html;

  toggleTime();

  dialog.style.display = 'flex';
}

function closeDialog() {
  dialog.style.display = 'none';
}

function saveEvent(index) {
  const title = document.getElementById('title').value;
  const startDate = document.getElementById('start_date').value;
  const endDate = document.getElementById('end_date').value;
  const startTime = document.getElementById('start_time').value;
  const includeTime = document.getElementById('time_toggle').checked;
  const details = document.getElementById('details').value;

  events[index] = {
    title,
    'start_date': startDate,
    'end_date': endDate,
    'start_time': includeTime ? startTime : false,
    details
  };

  renderDash();
  closeDialog();
}

function deleteEvent(index) {
  events.splice(index, 1);
  renderDash();
}

function addEvent() {
  const currentDate = new Date();
  const newEvent = {
    title: '',
    'start_date': currentDate.toISOString().split('T')[0],
    'end_date': currentDate.toISOString().split('T')[0],
    'start_time': false,
    details: ''
  };
  events.push(newEvent);
  editEvent(events.length - 1, true);
}

async function getEvents() {

  let response = await fetch(backend + '/get_events');

  events = await response.json();
}

async function setEvents() {
  const response = await fetch(backend + '/set_events?events=' + JSON.stringify(events));
  console.log(await response.json());
}

async function storeEvents() {
  const response = await fetch(backend + '/store_events?events=' + JSON.stringify(events));
  console.log(await response.json());
}

async function loadEvents() {
  const response = await fetch(backend + '/load_events');
  events = await response.json();
  renderDash();
}

getEvents().then(() => {
  //events = sortEvents(events);
  renderDash();
});
