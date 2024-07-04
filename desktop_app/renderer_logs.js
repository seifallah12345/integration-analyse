// renderer_logs.js

window.addEventListener('DOMContentLoaded', () => {
  const logsContainer = document.getElementById('logs');

  // Request log data from the main process
  window.electron.ipcRenderer.send('get-logs');

  // Handle the response
  window.electron.ipcRenderer.on('get-logs-result', (logs) => {
    if (logs.error) {
      logsContainer.innerHTML = '<tr><td colspan="4">Error loading logs.</td></tr>';
    } else {
      logsContainer.innerHTML = ''; // Clear previous rows
      logs.forEach(log => {
        const logRow = document.createElement('tr');
        logRow.innerHTML = `
          <td>${log.id}</td>
          <td>${log.user}</td>
          <td>${log.action}</td>
          <td>${log.timestamp}</td>
        `;
        logsContainer.appendChild(logRow);
      });
    }
  });
});
