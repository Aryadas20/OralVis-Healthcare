import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './DentistDashboard.css';

const DentistDashboard = () => {
    const [scans, setScans] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchScans = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/scans`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setScans(response.data.scans);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch scans.');
            }
        };
        fetchScans();
    }, []);
    
    const generatePdf = (scan) => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text('OralVis Healthcare Scan Report', 105, 20, null, null, 'center');
        
        doc.setFontSize(16);
        doc.text('Patient Details', 14, 40);
        doc.setFontSize(12);
        doc.text(`Patient Name: ${scan.patientName}`, 14, 50);
        doc.text(`Patient ID: ${scan.patientId}`, 14, 57);
        
        doc.setFontSize(16);
        doc.text('Scan Information', 14, 72);
        doc.setFontSize(12);
        doc.text(`Scan Type: ${scan.scanType}`, 14, 82);
        doc.text(`Region: ${scan.region}`, 14, 89);
        doc.text(`Upload Date: ${new Date(scan.uploadDate).toLocaleDateString()}`, 14, 96);
        
        // Note: Adding images from URLs can be tricky due to CORS.
        // This simple method might not work for all image hosts.
        // A backend proxy or converting image to base64 is a more robust solution.
        try {
             doc.addImage(scan.imageUrl, 'JPEG', 15, 110, 180, 160);
        } catch (e) {
            doc.text("Image could not be loaded.", 15, 120);
            console.error("jsPDF image error:", e);
        }

        doc.save(`Scan-Report-${scan.patientId}.pdf`);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="dentist-dashboard">
            <h2>Dentist Dashboard: View Scans</h2>
            <div className="scans-grid">
                {scans.length > 0 ? (
                    scans.map(scan => (
                        <div key={scan.id} className="scan-card">
                            <img src={scan.imageUrl} alt={`Scan for ${scan.patientName}`} className="scan-thumbnail" />
                            <div className="scan-info">
                                <h3>{scan.patientName} (ID: {scan.patientId})</h3>
                                <p><strong>Type:</strong> {scan.scanType}</p>
                                <p><strong>Region:</strong> {scan.region}</p>
                                <p><strong>Date:</strong> {new Date(scan.uploadDate).toLocaleDateString()}</p>
                            </div>
                            <div className="scan-actions">
                                <a href={scan.imageUrl} target="_blank" rel="noopener noreferrer" className="action-btn">View Full Image</a>
                                <button onClick={() => generatePdf(scan)} className="action-btn">Download Report</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No scans found.</p>
                )}
            </div>
        </div>
    );
};

export default DentistDashboard;