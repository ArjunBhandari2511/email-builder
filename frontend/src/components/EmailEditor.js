import { useState } from 'react';
import React from 'react';

function EmailEditor() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    footer: '',
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState('');

  const API_URL = 'http://localhost:5000/api/email';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/uploadImage`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');

      const data = await response.json();
      setImageUrl(data.imageUrl);
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Save email config
      const configResponse = await fetch(`${API_URL}/uploadEmailConfig`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrls: imageUrl ? [imageUrl] : []
        }),
      });

      if (!configResponse.ok) throw new Error('Failed to save configuration');

      // Get rendered template
      const renderResponse = await fetch(`${API_URL}/renderAndDownloadTemplate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrls: imageUrl ? [imageUrl] : []
        }),
      });

      if (!renderResponse.ok) throw new Error('Failed to render template');

      const template = await renderResponse.text();
      setPreview(template);
      setSuccess('Template generated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    if (!preview) return;
    
    const blob = new Blob([preview], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="editor-container">
      <h1>Email Template Editor</h1>
      
      {error && (
        <div className="alert error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label>Footer</label>
          <input
            type="text"
            name="footer"
            value={formData.footer}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="file-input"
          />
          {imageUrl && (
            <p className="image-info">
              Uploaded: {imageUrl.split('/').pop()}
            </p>
          )}
        </div>

        <div className="button-group">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Processing...' : 'Generate Template'}
          </button>

          {preview && (
            <button type="button" className="btn secondary" onClick={downloadTemplate}>
              Download Template
            </button>
          )}
        </div>
      </form>

      {preview && (
        <div className="preview-container">
          <h2>Preview</h2>
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      )}
    </div>
  );
}

export default EmailEditor;