document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('tbody');
  
    function fetchLogs() {
      fetch('http://localhost:3000/api/logs')
        .then(response => response.json())
        .then(data => {
          tbody.innerHTML = ''; // Clear existing rows
          data.forEach(item => {
            const row = document.createElement('tr');
  
            const actionCell = document.createElement('td');
            actionCell.textContent = item.action;
            row.appendChild(actionCell);
  
            const entityCell = document.createElement('td');
            entityCell.textContent = item.entity;
            row.appendChild(entityCell);
  
            const entityIdCell = document.createElement('td');
            entityIdCell.textContent = item.entity_id;
            row.appendChild(entityIdCell);
  
            const timestampCell = document.createElement('td');
            timestampCell.textContent = new Date(item.timestamp).toLocaleString();
            row.appendChild(timestampCell);
  
            tbody.appendChild(row);
          });
        })
        .catch(error => console.error('Error fetching logs data:', error));
    }
  
    // Initial fetch
    fetchLogs();
  });
  