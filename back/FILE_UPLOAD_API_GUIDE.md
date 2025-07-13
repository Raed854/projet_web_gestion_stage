# File Upload API Documentation

## Overview
This document explains how to handle file uploads for CompteRendu (Reports) from the frontend. The backend supports file upload, update, download, and deletion operations.

## Supported File Types
- PDF (.pdf)
- Word Documents (.doc, .docx)
- Text Files (.txt)
- Rich Text Format (.rtf)

## File Size Limit
- Maximum file size: 10MB

## API Endpoints

### 1. Create CompteRendu with File Upload
**Endpoint:** `POST /compteRendus`
**Content-Type:** `multipart/form-data`
**Authentication:** Bearer Token required

#### Frontend Implementation (React)

```javascript
// State for form data
const [formData, setFormData] = useState({
  nom: '',
  type: 'Rapport', // or 'Livrable'
  statut: 'En attente'
});
const [selectedFile, setSelectedFile] = useState(null);

// Handle file selection
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Invalid file type. Only PDF, DOC, DOCX, TXT, and RTF files are allowed.');
      return;
    }
    
    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
  }
};

// Submit form with file
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formDataToSend = new FormData();
  formDataToSend.append('nom', formData.nom);
  formDataToSend.append('type', formData.type);
  formDataToSend.append('statut', formData.statut);
  
  if (selectedFile) {
    formDataToSend.append('file', selectedFile);
  }
  
  try {
    const response = await fetch('http://localhost:5000/compteRendus', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        // Don't set Content-Type header - let browser set it for FormData
      },
      body: formDataToSend
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('CompteRendu created:', result);
      // Handle success (e.g., redirect, show success message)
    } else {
      const error = await response.json();
      console.error('Error:', error.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

#### HTML Form Example
```jsx
<form onSubmit={handleSubmit} encType="multipart/form-data">
  <input
    type="text"
    placeholder="Nom du rapport"
    value={formData.nom}
    onChange={(e) => setFormData({...formData, nom: e.target.value})}
    required
  />
  
  <select
    value={formData.type}
    onChange={(e) => setFormData({...formData, type: e.target.value})}
  >
    <option value="Rapport">Rapport</option>
    <option value="Livrable">Livrable</option>
  </select>
  
  <select
    value={formData.statut}
    onChange={(e) => setFormData({...formData, statut: e.target.value})}
  >
    <option value="En attente">En attente</option>
    <option value="Accepté">Accepté</option>
    <option value="Refusé">Refusé</option>
  </select>
  
  <input
    type="file"
    accept=".pdf,.doc,.docx,.txt,.rtf"
    onChange={handleFileChange}
  />
  
  <button type="submit">Créer CompteRendu</button>
</form>
```

### 2. Update CompteRendu with New File
**Endpoint:** `PUT /compteRendus/:id`
**Content-Type:** `multipart/form-data`

```javascript
const updateCompteRendu = async (id, updateData, newFile = null) => {
  const formData = new FormData();
  
  // Add text fields
  Object.keys(updateData).forEach(key => {
    formData.append(key, updateData[key]);
  });
  
  // Add file if provided
  if (newFile) {
    formData.append('file', newFile);
  }
  
  try {
    const response = await fetch(`http://localhost:5000/compteRendus/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('CompteRendu updated:', result);
    }
  } catch (error) {
    console.error('Error updating:', error);
  }
};
```

### 3. Download File
**Endpoint:** `GET /compteRendus/:id/download`

```javascript
const downloadFile = async (compteRenduId, fileName) => {
  try {
    const response = await fetch(`http://localhost:5000/compteRendus/${compteRenduId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'document';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Download failed');
    }
  } catch (error) {
    console.error('Download error:', error);
  }
};

// Usage in component
<button onClick={() => downloadFile(compteRendu.id, compteRendu.fileName)}>
  Télécharger
</button>
```

### 4. Get CompteRendu with File Info
**Endpoint:** `GET /compteRendus/:id`

```javascript
const getCompteRendu = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/compteRendus/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      const compteRendu = await response.json();
      
      // File information is included in the response
      console.log('File info:', {
        fileName: compteRendu.fileName,
        fileSize: compteRendu.fileSize,
        uploadedAt: compteRendu.uploadedAt,
        hasFile: !!compteRendu.filePath
      });
      
      return compteRendu;
    }
  } catch (error) {
    console.error('Error fetching:', error);
  }
};
```

## Response Structure

### CompteRendu with File
```json
{
  "id": 1,
  "nom": "Rapport Stage",
  "type": "Rapport",
  "statut": "En attente",
  "filePath": "/uploads/compte-rendus/file-1642345678901-123456789.pdf",
  "fileName": "rapport_stage.pdf",
  "fileSize": 2048576,
  "uploadedAt": "2025-07-13T10:30:00.000Z"
}
```

## File Display Component Example

```jsx
const FileInfo = ({ compteRendu }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-info">
      {compteRendu.fileName ? (
        <div>
          <p><strong>Fichier:</strong> {compteRendu.fileName}</p>
          <p><strong>Taille:</strong> {formatFileSize(compteRendu.fileSize)}</p>
          <p><strong>Uploadé le:</strong> {new Date(compteRendu.uploadedAt).toLocaleString()}</p>
          <button onClick={() => downloadFile(compteRendu.id, compteRendu.fileName)}>
            Télécharger
          </button>
        </div>
      ) : (
        <p>Aucun fichier attaché</p>
      )}
    </div>
  );
};
```

## Error Handling

```javascript
const handleApiError = (error) => {
  if (error.message.includes('Invalid file type')) {
    alert('Type de fichier non autorisé. Utilisez PDF, DOC, DOCX, TXT ou RTF.');
  } else if (error.message.includes('File too large')) {
    alert('Fichier trop volumineux. Taille maximale: 10MB.');
  } else if (error.message.includes('File not found')) {
    alert('Fichier non trouvé.');
  } else {
    alert('Erreur lors du traitement du fichier.');
  }
};
```

## Important Notes

1. **Always use FormData** for file uploads
2. **Don't set Content-Type header** when using FormData - let the browser handle it
3. **Include Authorization header** for all requests
4. **Validate file type and size** on the frontend before uploading
5. **Handle download as blob** and create temporary URLs
6. **Clean up blob URLs** after downloading to prevent memory leaks

## CSS for File Input Styling

```css
.file-input-container {
  position: relative;
  display: inline-block;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-input-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.file-input-button:hover {
  background-color: #0056b3;
}
```
