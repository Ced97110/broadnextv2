'use client'

import React, { use, useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { format } from 'd3-format';
import { transformData } from './transform-data';
import { useChat } from 'ai/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Loader, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';


const CompanyFinancials = ({ data, raw }) => {
  const [summaryData, setSummaryData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState('');
  const [summary, setSummary] = useState('');


  console.log('DATAaaaaaaaaaaaaa', data)
  const handleSubmit = async () => {
    setLoading(true);
  
    // Try to parse the pasted string into JSON
    let parsedData;
    try {
      parsedData = raw; // Parse the string to JSON
      console.log("Parsed data:", parsedData);
    } catch (error) {
      console.error("Invalid JSON format:", error);
      return; // Stop if the string is not valid JSON
    }
  
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the parsed JSON as the request body
        body: JSON.stringify({ financialData: parsedData }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSummary(data.summary);
        setLoading(false);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const chartConfig = {
    Quarter: {
      label: "Quarter",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const metrics = [
    'Revenue (USD)',
    'Net Income (USD)',
    'Operating Income (USD)',
    'Diluted Earning Per Share (USD/Share)',
    'Stock Close Price ($)',
    'Cash, cash equivalents and restricted cash, beginning balances (USD)',
    'Gross Margin',
    'Operating Margin',
    'Net Profit Margin',
    'Current Ratio',
    'Quick Ratio',
    'Debt-to-Equity Ratio',
    'Interest Coverage Ratio',
    'Asset Turnover',
    'Inventory Turnover',
    'Stock Close Price ($)',
    'Price-to-Earnings (P/E) Ratio',
    'Price-to-Book (P/B) Ratio',
  ];


  


  return (
    <div className="p-6">
    <div className='py-8'>
      {!summary && <Button onClick={handleSubmit}>Get Summary</Button>}
  
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-muted-foreground h-10 w-10" />
          <span className="ml-2">Generating summary...</span>
        </div>
      ) : (
        summary && <div>{summary}</div>
      )}
    </div>
  
    {/* Grid layout with 1 column on small screens and 2 columns on larger screens */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((metric) => (
        <Card key={metric} className="mb-6">
          <CardHeader>
            <CardTitle>{metric}</CardTitle>
            <CardDescription>Quarterly Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart barSize={60} width={600} height={300} data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="Quarter"
                  tickLine={false}
                  tickMargin={6}
                  axisLine={false}
                />
                <YAxis
                  dataKey={metric}
                  width={100}
                  allowDecimals={true}
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => format(",")(value)}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey={metric} // Each graph is for one metric
                  radius={4}
                  fill='#4F75FF'
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  );
};

export default CompanyFinancials;