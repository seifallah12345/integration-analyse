window.addEventListener('DOMContentLoaded', () => {
  const plantsContainer = document.getElementById('plants');
  const totalPlantsElement = document.createElement('div');
  totalPlantsElement.id = 'totalPlants';
  plantsContainer.parentNode.insertBefore(totalPlantsElement, plantsContainer);

  const username = "your_username"; // Replace this with the actual username, you might want to get this from user login data

  // Request plant data from the main process
  window.electron.ipcRenderer.send('get-all-plants');

  // Handle the response
  window.electron.ipcRenderer.on('get-all-plants-result', (plants) => {
    if (plants.error) {
      plantsContainer.innerHTML = '<tr><td colspan="10">Error loading plants.</td></tr>';
    } else {
      plantsContainer.innerHTML = ''; // Clear previous rows
      plants.forEach(plant => {
        const plantRow = document.createElement('tr');
        plantRow.innerHTML = `
          <td>${plant.id}</td>
          <td>${plant.name}</td>
          <td>${plant.plant_id}</td>
          <td>${plant.provenance}</td>
          <td>${plant.description}</td>
          <td>${plant.stage}</td>
          <td>${plant.entreposage}</td>
          <td class="status">${plant.status}</td>
          <td>${plant.date_added || new Date().toISOString().split('T')[0]}</td>
          <td><button class="generate-qrcode" data-plant='${JSON.stringify(plant)}'>Generate QR Code</button></td>
        `;
        applyStatusColor(plantRow.querySelector('.status'), plant.status);
        plantsContainer.appendChild(plantRow);
      });
      totalPlantsElement.textContent = `Total Plants: ${plants.length}`;

      // Add event listeners for QR code generation
      document.querySelectorAll('.generate-qrcode').forEach(button => {
        button.addEventListener('click', (event) => {
          const plant = JSON.parse(event.target.getAttribute('data-plant'));
          const plantInfo = `
            ID: ${plant.id}\n
            Name: ${plant.name}\n
            Plant ID: ${plant.plant_id}\n
            Provenance: ${plant.provenance}\n
            Description: ${plant.description}\n
            Stage: ${plant.stage}\n
            Entreposage: ${plant.entreposage}\n
            Status: ${plant.status}\n
            Date Added: ${plant.date_added || new Date().toISOString().split('T')[0]}
          `;
          generateQRCode(plantInfo);
        });
      });
    }
  });

  window.electron.ipcRenderer.on('add-plant-result', (result) => {
    if (result.success) {
      alert('Plant added successfully.');
      window.electron.ipcRenderer.send('get-all-plants');
    } else {
      alert('Failed to add plant: ' + result.message);
    }
  });

  window.electron.ipcRenderer.on('remove-plant-result', (result) => {
    if (result.success) {
      alert('Plant removed successfully.');
      window.electron.ipcRenderer.send('get-all-plants');
    } else {
      alert('Failed to remove plant: ' + result.message);
    }
  });

  window.electron.ipcRenderer.on('edit-plant-result', (result) => {
    if (result.success) {
      alert('Plant edited successfully.');
      window.electron.ipcRenderer.send('get-all-plants');
    } else {
      alert('Failed to edit plant: ' + result.message);
    }
  });

  // Add event listeners for the modals
  document.getElementById('addPlantButton').addEventListener('click', () => {
    const name = document.getElementById('addPlantName').value;
    const plant_id = document.getElementById('addPlantID').value;
    const provenance = document.getElementById('addPlantProvenance').value;
    const description = document.getElementById('addPlantDescription').value;
    const stage = document.getElementById('addPlantStage').value;
    const entreposage = document.getElementById('addPlantEntreposage').value;
    const status = document.getElementById('addPlantStatus').value;

    window.electron.ipcRenderer.send('add-plant', {
      name, plant_id, provenance, description, stage, entreposage, status
    });
  });

  document.getElementById('removePlantButton').addEventListener('click', () => {
    const plant_id = document.getElementById('removePlantID').value;
    window.electron.ipcRenderer.send('remove-plant', { plant_id });
  });

  document.getElementById('editPlantButton').addEventListener('click', () => {
    const plant_id = document.getElementById('editPlantID').value;
    const name = document.getElementById('editPlantName').value;
    const provenance = document.getElementById('editPlantProvenance').value;
    const description = document.getElementById('editPlantDescription').value;
    const stage = document.getElementById('editPlantStage').value;
    const entreposage = document.getElementById('editPlantEntreposage').value;
    const status = document.getElementById('editPlantStatus').value;

    window.electron.ipcRenderer.send('edit-plant', {
      plant_id, name, provenance, description, stage, entreposage, status
    });
  });

  // Function to apply background color based on status
  function applyStatusColor(cell, status) {
    switch (status) {
      case 'Bonne santé':
        cell.style.backgroundColor = 'green';
        cell.style.color = 'white';
        break;
      case 'Santé moyenne':
        cell.style.backgroundColor = 'yellow';
        cell.style.color = 'black';
        break;
      case 'Mauvaise santé':
        cell.style.backgroundColor = 'orange';
        cell.style.color = 'white';
        break;
      case 'Plante en grand danger':
        cell.style.backgroundColor = 'red';
        cell.style.color = 'white';
        break;
      default:
        cell.style.backgroundColor = '';
        cell.style.color = '';
        break;
    }
  }

  function generateQRCode(text) {
    const qrcodeContainer = document.getElementById('qrcodeContainer');
    qrcodeContainer.innerHTML = ''; // Clear previous QR code
    new QRCode(qrcodeContainer, text);
  }

  // View Logs button click event
  document.getElementById('viewLogsButton').addEventListener('click', () => {
    window.electron.ipcRenderer.send('view-logs');
  });
});
