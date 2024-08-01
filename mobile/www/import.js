document.addEventListener('DOMContentLoaded', () => {
  const importForm = document.getElementById('importForm');
  const message = document.getElementById('message');

  // Function to create FormData with a polyfill if necessary
  function createFormData(form) {
    if (typeof FormData !== 'undefined') {
      return new FormData(form);
    } else {
      console.log('FormData is not supported, using polyfill');
      // Polyfill implementation
      const formData = {};
      for (let element of form.elements) {
        if (element.name && element.files) {
          formData[element.name] = element.files[0];
        } else if (element.name) {
          formData[element.name] = element.value;
        }
      }
      return formData;
    }
  }

  if (importForm) {
    importForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = createFormData(importForm);

      // Use native FormData if available
      const isNativeFormData = (typeof FormData !== 'undefined');
      const fetchOptions = {
        method: 'POST',
        body: isNativeFormData ? formData : JSON.stringify(formData),
        headers: !isNativeFormData ? { 'Content-Type': 'application/json' } : {}
      };

      fetch('http://localhost:3000/api/import', fetchOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            message.textContent = 'Data imported successfully';
            message.style.color = 'green';
          } else {
            message.textContent = 'Error importing data: ' + data.message;
            message.style.color = 'red';
          }
        })
        .catch(error => {
          message.textContent = 'Error importing data: ' + error.message;
          message.style.color = 'red';
        });
    });
  } else {
    console.error('Form not found in the DOM');
  }
});
