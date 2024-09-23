'use client'


// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [company, setCompany] = useState(''); // The company name entered by the user
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null); // Stores the PDF URL for downloading

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPdfUrl(null); // Reset any previous PDF URL

    try {
      // Send request to the backend API
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequest: `Create a report on ${company}`, // Passing company name as the request
        }),
      });

      if (response.ok) {
        const blob = await response.blob(); // Get the PDF file as a blob
        const pdfUrl = URL.createObjectURL(blob); // Create a downloadable URL from the blob
        setPdfUrl(pdfUrl); // Store the generated URL for later use
      } else {
        alert('Error generating report. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Generate Consulting Report</h1>
      <form onSubmit={handleGenerateReport}>
        <label htmlFor="company">Enter the company name:</label>
        <input
          type="text"
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g., Tesla"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating Report...' : 'Generate Report'}
        </button>
      </form>

      {pdfUrl && (
        <div>
          <h2>Report is ready!</h2>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download="Consulting_Report.pdf">
            Download Report
          </a>
        </div>
      )}
    </div>
  );
}