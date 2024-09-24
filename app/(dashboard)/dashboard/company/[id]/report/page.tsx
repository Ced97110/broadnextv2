'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

export const runtime = 'edge';

export default function Home() {
  const { pending } = useFormStatus();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async (formData: FormData) => {
   

    const company = formData.get('company') as string;

    try {
      // Send request to the backend API
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequest: `Create a report on ${company}`, 
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const pdfUrl = URL.createObjectURL(blob);
        return pdfUrl;
      } else {
        throw new Error('Error generating report. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPdfUrl(null);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const url = await handleGenerateReport(formData);
    setPdfUrl(url);
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Get a report on Tesla</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <Label htmlFor="company">Enter the Company Name:</Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g., Tesla"
                required
                className="mt-2"
              />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Generating Report...' : 'Generate Report'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              {error}
            </Alert>
          )}

          {pdfUrl && (
            <div className="mt-6 text-center">
              <h2 className="text-lg font-semibold">Report is Ready!</h2>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Consulting_Report.pdf"
                className="text-blue-500 underline"
              >
                Download Report
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}