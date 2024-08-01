const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email_phone = document.getElementById('email_phone').value;
      const password = document.getElementById('password').value;
      ipcRenderer.send('login-attempt', { email_phone, password });
    });
    

    ipcRenderer.on('login-response', (event, response) => {
      if (response.success) {
        window.location.href = 'index.html';
      } else {
        document.getElementById('error-message').textContent = response.message;
      }
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('tbody');
  
  // Fetch plant data from the backend
  fetch('http://localhost:3000/api/plants')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const row = document.createElement('tr');

        Object.keys(item).forEach(key => {
          const cell = document.createElement('td');
          cell.textContent = item[key];
          row.appendChild(cell);
        });

        tbody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching plant data:', error));
    document.getElementById('home').addEventListener('click', () => {
      // Logic for home navigation
      console.log('Home clicked');
    });
  
    document.getElementById('plants').addEventListener('click', () => {
      // Logic for plants navigation
      console.log('Plants clicked');
    });
  
    document.getElementById('addPlant').addEventListener('click', () => {
      // Logic for add plant navigation
      console.log('Add Plant clicked');
    });
  
    document.getElementById('logout').addEventListener('click', () => {
      // Logic for logout
      console.log('Logout clicked');
    });
  });


