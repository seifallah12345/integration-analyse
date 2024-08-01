document.addEventListener('DOMContentLoaded', () => {
    const addUserForm = document.getElementById('addUserForm');
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
  
      function fetchUsers() {
        fetch('http://localhost:3000/api/users')
          .then(response => response.json())
          .then(data => {
            tbody.innerHTML = ''; // Clear existing rows
            data.forEach(item => {
              const row = document.createElement('tr');
    
              const idCell = document.createElement('td');
              idCell.textContent = item.id;
              row.appendChild(idCell);
    
              const emailPhoneCell = document.createElement('td');
              emailPhoneCell.textContent = item.email_phone;
              row.appendChild(emailPhoneCell);
    
              const actionsCell = document.createElement('td');
              const editButton = document.createElement('button');
              editButton.textContent = 'Edit';
              editButton.addEventListener('click', () => showEditForm(item));
              actionsCell.appendChild(editButton);
    
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.addEventListener('click', () => deleteUser(item.id));
              actionsCell.appendChild(deleteButton);
    
              row.appendChild(actionsCell);
              tbody.appendChild(row);
            });
          })
          .catch(error => console.error('Error fetching users data:', error));
      }
    
      // Initial fetch
      fetchUsers();
    
      // Prevent multiple submissions
      let isSubmitting = false;
    
      // Handle form submission for adding a new user
      addUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if (isSubmitting) {
          return; // Prevent multiple submissions
        }
    
        isSubmitting = true;
    
        const formData = new FormData(addUserForm);
        const userData = Object.fromEntries(formData.entries());
    
        console.log('Submitting user data:', userData); // Debugging
    
        fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then(response => response.json())
          .then(data => {
            isSubmitting = false;
            if (data.success) {
              alert('User added successfully');
              addUserForm.reset();
              fetchUsers(); // Fetch updated data
            } else {
              console.error('Error adding user:', data.message);
            }
          })
          .catch(error => {
            isSubmitting = false;
            console.error('Error adding user:', error);
          });
      });
    
      // Function to handle showing the edit form
      function showEditForm(user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editEmailPhone').value = user.email_phone;
        document.getElementById('editUserModal').style.display = 'block';
      }
    
      // Handle form submission for editing a user
      editUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if (isSubmitting) {
          return; // Prevent multiple submissions
        }
    
        isSubmitting = true;
    
        const formData = new FormData(editUserForm);
        const userData = Object.fromEntries(formData.entries());
    
        console.log('Submitting edited user data:', userData); // Debugging
    
        fetch(`http://localhost:3000/api/users/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then(response => response.json())
          .then(data => {
            isSubmitting = false;
            if (data.success) {
              alert('User updated successfully');
              editUserForm.reset();
              document.getElementById('editUserModal').style.display = 'none';
              fetchUsers(); // Fetch updated data
            } else {
              console.error('Error updating user:', data.message);
            }
          })
          .catch(error => {
            isSubmitting = false;
            console.error('Error updating user:', error);
          });
      });
    
      // Function to handle user deletion
      function deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
          fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('User deleted successfully');
                fetchUsers(); // Fetch updated data
              } else {
                console.error('Error deleting user:', data.message);
              }
            })
            .catch(error => console.error('Error deleting user:', error));
        }
      }
    
      // Hide the edit form modal when clicking outside of it
      window.onclick = function(event) {
        const modal = document.getElementById('editUserModal');
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      }
    });
  