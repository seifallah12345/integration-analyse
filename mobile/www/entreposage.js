document.addEventListener('DOMContentLoaded', () => {
    const addEntreposageForm = document.getElementById('addEntreposageForm');
    const tbody = document.querySelector('tbody');
  
    // Polyfill for FormData if necessary
    if (typeof FormData === 'undefined') {
        console.log('FormData is not supported, using polyfill');
        // Implement a basic FormData polyfill
        window.FormData = function(form) {
          this.entries = () => {
            const formEntries = [];
            for (let element of form.elements) {
              if (element.name && element.value) {
                formEntries.push([element.name, element.value]);
              }
            }
            return formEntries[Symbol.iterator]();
          };
        };
      }
      function fetchEntreposage() {
        fetch('http://localhost:3000/api/entreposage')
          .then(response => response.json())
          .then(data => {
            tbody.innerHTML = ''; // Clear existing rows
            data.forEach(item => {
              const row = document.createElement('tr');
    
              const idCell = document.createElement('td');
              idCell.textContent = item.id;
              row.appendChild(idCell);
    
              const nameCell = document.createElement('td');
              nameCell.textContent = item.name;
              row.appendChild(nameCell);
    
              const actionsCell = document.createElement('td');
              const editButton = document.createElement('button');
              editButton.textContent = 'Edit';
              editButton.addEventListener('click', () => showEditForm(item));
              actionsCell.appendChild(editButton);
    
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.addEventListener('click', () => deleteEntreposage(item.id));
              actionsCell.appendChild(deleteButton);
    
              row.appendChild(actionsCell);
              tbody.appendChild(row);
            });
          })
          .catch(error => console.error('Error fetching ENTREPOSAGE data:', error));
      }
    
      // Initial fetch
      fetchEntreposage();
    
      // Prevent multiple submissions
      let isSubmitting = false;
    
      // Handle form submission for adding a new ENTREPOSAGE
      addEntreposageForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if (isSubmitting) {
          return; // Prevent multiple submissions
        }
    
        isSubmitting = true;
    
        const formData = new FormData(addEntreposageForm);
        const entreposageData = Object.fromEntries(formData.entries());
    
        console.log('Submitting ENTREPOSAGE data:', entreposageData); // Debugging
    
        fetch('http://localhost:3000/api/entreposage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entreposageData),
        })
          .then(response => response.json())
          .then(data => {
            isSubmitting = false;
            if (data.success) {
              alert('ENTREPOSAGE added successfully');
              addEntreposageForm.reset();
              fetchEntreposage(); // Fetch updated data
            } else {
              console.error('Error adding ENTREPOSAGE:', data.message);
            }
          })
          .catch(error => {
            isSubmitting = false;
            console.error('Error adding ENTREPOSAGE:', error);
          });
      });
    
      // Function to handle showing the edit form
      function showEditForm(entreposage) {
        document.getElementById('editEntreposageId').value = entreposage.id;
        document.getElementById('editEntreposageName').value = entreposage.name;
        document.getElementById('editEntreposageModal').style.display = 'block';
      }
    
      // Handle form submission for editing an ENTREPOSAGE
      editEntreposageForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if (isSubmitting) {
          return; // Prevent multiple submissions
        }
    
        isSubmitting = true;
    
        const formData = new FormData(editEntreposageForm);
        const entreposageData = Object.fromEntries(formData.entries());
    
        console.log('Submitting edited ENTREPOSAGE data:', entreposageData); // Debugging
    
        fetch(`http://localhost:3000/api/entreposage/${entreposageData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entreposageData),
        })
          .then(response => response.json())
          .then(data => {
            isSubmitting = false;
            if (data.success) {
              alert('ENTREPOSAGE updated successfully');
              editEntreposageForm.reset();
              document.getElementById('editEntreposageModal').style.display = 'none';
              fetchEntreposage(); // Fetch updated data
            } else {
              console.error('Error updating ENTREPOSAGE:', data.message);
            }
          })
          .catch(error => {
            isSubmitting = false;
            console.error('Error updating ENTREPOSAGE:', error);
          });
      });
    
      // Function to handle ENTREPOSAGE deletion
      function deleteEntreposage(id) {
        if (confirm('Are you sure you want to delete this ENTREPOSAGE?')) {
          fetch(`http://localhost:3000/api/entreposage/${id}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('ENTREPOSAGE deleted successfully');
                fetchEntreposage(); // Fetch updated data
              } else {
                console.error('Error deleting ENTREPOSAGE:', data.message);
              }
            })
            .catch(error => console.error('Error deleting ENTREPOSAGE:', error));
        }
      }
    
      // Hide the edit form modal when clicking outside of it
      window.onclick = function(event) {
        const modal = document.getElementById('editEntreposageModal');
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      }
    });