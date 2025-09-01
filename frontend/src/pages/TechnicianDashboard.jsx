import React, { useState } from 'react';
import axios from 'axios';
import './Form.css'; // Reusable form styles

const TechnicianDashboard = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        patientId: '',
        scanType: 'Intraoral',
        region: 'Maxilla',
        scanImage: null,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, scanImage: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
            // Clear form
            setFormData({
                patientName: '', patientId: '', scanType: 'Intraoral', region: 'Maxilla', scanImage: null
            });
            e.target.reset(); // Clear file input
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed.');
        }
    };

    return (
        <div className="form-container">
            <h2>Technician Dashboard: Upload Scan</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label>Patient Name</label>
                    <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Patient ID</label>
                    <input type="text" name="patientId" value={formData.patientId} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Scan Type</label>
                    <select name="scanType" value={formData.scanType} onChange={handleChange}>
                        <option>Intraoral</option>
                        <option>Extraoral</option>
                        <option>CBCT</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Region</label>
                    <select name="region" value={formData.region} onChange={handleChange}>
                        <option>Maxilla</option>
                        <option>Mandible</option>
                        <option>Full Arch</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Scan Image</label>
                    <input type="file" name="scanImage" onChange={handleFileChange} required />
                </div>
                <button type="submit">Upload Scan</button>
            </form>
        </div>
    );
};

export default TechnicianDashboard;