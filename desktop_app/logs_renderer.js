const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'logs.json');

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('logsBody');

  if (fs.existsSync(logFilePath)) {
    const logs = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));

    logs.forEach(log => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${log.timestamp}</td>
        <td>${log.action}</td>
        <td>${log.details}</td>
      `;

      tableBody.appendChild(row);
    });
  }
});
