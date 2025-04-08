document.getElementById('upload-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData();
  const fileInput = document.getElementById('image-upload');
  formData.append('image', fileInput.files[0]);

  // Upload image
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('image-preview').src = data.filePath;
    document.getElementById('image-preview').style.display = 'block';
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

// Generate Pairing Code
document.getElementById('generate-pairing-code').addEventListener('click', function() {
  fetch('/generate-pairing-code')
    .then(response => response.json())
    .then(data => {
      // Display the generated pairing code in the frontend
      document.getElementById('pairing-code-display').textContent = 'Your Pairing Code: ' + data.pairingCode;
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

// Verify Pairing Code
document.getElementById('verify-pairing-code').addEventListener('click', function() {
  const code = document.getElementById('pairing-code-input').value;

  fetch('/verify-pairing-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('pairing-status').textContent = data.message;
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
