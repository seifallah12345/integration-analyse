document.addEventListener('DOMContentLoaded', () => {
  const addPlantForm = document.getElementById('addPlantForm');
  const tbody = document.querySelector('tbody');
  const entreposageSelect = document.getElementById('entreposageSelect');
  const responsableDestructionSelect = document.getElementById('responsableDestructionSelect');
  const totalPlants = document.getElementById('totalPlants');
  const activePlants = document.getElementById('activePlants');
  const inactivePlants = document.getElementById('inactivePlants');

  // Fetch and display plant counts
  function fetchPlantCounts() {
    fetch('http://localhost:3000/api/plants/count')
      .then(response => response.json())
      .then(data => {
        totalPlants.textContent = data.count;
      })
      .catch(error => console.error('Error fetching total plant count:', error));

    fetch('http://localhost:3000/api/plants/count/active')
      .then(response => response.json())
      .then(data => {
        activePlants.textContent = data.count;
      })
      .catch(error => console.error('Error fetching active plant count:', error));

    fetch('http://localhost:3000/api/plants/count/inactive')
      .then(response => response.json())
      .then(data => {
        inactivePlants.textContent = data.count;
      })
      .catch(error => console.error('Error fetching inactive plant count:', error));
  }

  // Call this function after adding, updating, or deleting plants
  function updateCountsAndPlants() {
    fetchPlants();
    fetchPlantCounts();
  }

  // Fetch all plants
  function fetchPlants() {
    fetch('http://localhost:3000/api/plants')
      .then(response => response.json())
      .then(data => {
        tbody.innerHTML = ''; // Clear existing rows
        data.forEach(item => {
          const row = document.createElement('tr');

          // Exclude the id field
          const keys = Object.keys(item).filter(key => key !== 'id');
          keys.forEach(key => {
            const cell = document.createElement('td');
            cell.textContent = item[key];

            // Apply classes based on Etat de santé
            if (key === 'etat_de_sante') {
              switch (item[key]) {
                case 'Bonne santé':
                  cell.classList.add('good-health');
                  break;
                case 'Santé moyenne':
                  cell.classList.add('average-health');
                  break;
                case 'Mauvaise santé':
                  cell.classList.add('bad-health');
                  break;
                case 'Plante en grand danger':
                  cell.classList.add('critical-health');
                  break;
              }
            }

            row.appendChild(cell);
          });

          const actionsCell = document.createElement('td');
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', () => editPlant(item));
          actionsCell.appendChild(editButton);

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => deletePlant(item.id));
          actionsCell.appendChild(deleteButton);

          const qrButton = document.createElement('button');
          qrButton.textContent = 'Generate QR';
          qrButton.addEventListener('click', () => generateQRCode(item.id));
          actionsCell.appendChild(qrButton);

          row.appendChild(actionsCell);
          tbody.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching plant data:', error));
  }

  // Function to fetch ENTREPOSAGE data and populate the select dropdown
  function fetchEntreposage() {
    fetch('http://localhost:3000/api/entreposage')
      .then(response => response.json())
      .then(data => {
        entreposageSelect.innerHTML = ''; // Clear existing options
        data.forEach(item => {
          const option = document.createElement('option');
          option.value = item.name;
          option.textContent = item.name;
          entreposageSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching ENTREPOSAGE data:', error));
  }

  // Function to fetch users data and populate the select dropdown
  function fetchUsers() {
    fetch('http://localhost:3000/api/users')
      .then(response => response.json())
      .then(data => {
        responsableDestructionSelect.innerHTML = ''; // Clear existing options
        data.forEach(item => {
          const option = document.createElement('option');
          option.value = item.email_phone;
          option.textContent = item.email_phone;
          responsableDestructionSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching users data:', error));
  }

  // Initial fetch
  updateCountsAndPlants();
  fetchEntreposage();
  fetchUsers();

  // Prevent multiple submissions
  let isSubmitting = false;

  // Handle form submission for adding a new plant
  addPlantForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    isSubmitting = true;

    const formData = new FormData(addPlantForm);
    const plantData = Object.fromEntries(formData.entries());

    console.log('Submitting plant data:', plantData); // Debugging

    fetch('http://localhost:3000/api/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plantData),
    })
      .then(response => response.json())
      .then(data => {
        isSubmitting = false;
        if (data.success) {
          alert('Plant added successfully');
          addPlantForm.reset();
          updateCountsAndPlants(); // Fetch updated data
        } else {
          console.error('Error adding plant:', data.message);
        }
      })
      .catch(error => {
        isSubmitting = false;
        console.error('Error adding plant:', error);
      });
  });

  // Function to handle plant editing
  function editPlant(plant) {
    // Populate the edit form with plant data
    editPlantForm.style.display = 'block';
    addPlantForm.style.display = 'none';

    document.getElementById('editPlantId').value = plant.id;
    document.getElementById('editEtatDeSante').value = plant.etat_de_sante;
    document.getElementById('editDate').value = plant.date.split('T')[0];
    document.getElementById('editIdentification').value = plant.identification;
    document.getElementById('editProvenance').value = plant.provenance;
    document.getElementById('editDescription').value = plant.description;
    document.getElementById('editStade').value = plant.stade;
    document.getElementById('editEntreposage').value = plant.entreposage;
    document.getElementById('editDateDeRetrait').value = plant.date_de_retrait.split('T')[0];
    document.getElementById('editItemRetire').value = plant.item_retire;
    document.getElementById('editResponsableDestruction').value = plant.responsable_destruction;
    document.getElementById('editNote').value = plant.note;
    document.getElementById('editActifInactif').value = plant.actif_inactif;
  }

  // Handle form submission for editing a plant
  editPlantForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    isSubmitting = true;

    const formData = new FormData(editPlantForm);
    const plantData = Object.fromEntries(formData.entries());

    console.log('Submitting edited plant data:', plantData); // Debugging

    fetch(`http://localhost:3000/api/plants/${plantData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plantData),
    })
      .then(response => response.json())
      .then(data => {
        isSubmitting = false;
        if (data.success) {
          alert('Plant updated successfully');
          editPlantForm.reset();
          editPlantForm.style.display = 'none';
          addPlantForm.style.display = 'block';
          updateCountsAndPlants(); // Fetch updated data
        } else {
          console.error('Error updating plant:', data.message);
        }
      })
      .catch(error => {
        isSubmitting = false;
        console.error('Error updating plant:', error);
      });
  });

  // Function to handle plant deletion
  function deletePlant(id) {
    fetch(`http://localhost:3000/api/plants/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Plant deleted successfully');
          updateCountsAndPlants(); // Fetch updated data
        } else {
          console.error('Error deleting plant:', data.message);
        }
      })
      .catch(error => console.error('Error deleting plant:', error));
  }

  // Function to generate QR code for a plant
  function generateQRCode(id) {
    fetch(`http://localhost:3000/api/plants/${id}/qrcode`)
      .then(response => response.json())
      .then(data => {
        if (data.qrCodeUrl) {
          const qrCodeImg = document.createElement('img');
          qrCodeImg.src = data.qrCodeUrl;
          qrCodeImg.alt = 'QR Code';

          const qrCodeContainer = document.createElement('div');
          qrCodeContainer.appendChild(qrCodeImg);

          const printButton = document.createElement('button');
          printButton.textContent = 'Print QR Code';
          printButton.addEventListener('click', () => printQRCode(data.qrCodeUrl));
          qrCodeContainer.appendChild(printButton);

          document.body.appendChild(qrCodeContainer);
        } else {
          console.error('Error generating QR code:', data.message);
        }
      })
      .catch(error => console.error('Error generating QR code:', error));
  }

  // Function to print QR code
  function printQRCode(qrCodeUrl) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<img src="${qrCodeUrl}" alt="QR Code">`);
    printWindow.document.close();
    printWindow.print();
  }

  // Hide the edit form modal when clicking outside of it
  window.onclick = function(event) {
    const modal = document.getElementById('editPlantModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
});
