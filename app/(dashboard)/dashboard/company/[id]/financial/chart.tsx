'use client'

import React, { use, useEffect, useMemo, useState } from 'react';
import { format } from 'd3-format';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Chat } from './chat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { processFinancials } from '@/lib/process-financials';


const CompanyFinancials = ({ data, companyprompt,companyprompt1, companyprompt2 }) => {

  

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
    <div className="flex flex-col space-y-12 p-2 relative">
    {/* Tabs and Content */}
    <div className="flex w-full py-12 px-12">
      <Tabs defaultValue="Financial Health" orientation="vertical" className="w-full flex flex-row space-x-6">
        <TabsList className="flex flex-col items-start space-y-2 mt-10">
          <TabsTrigger value="Financial Health">Financial Health</TabsTrigger>
          <TabsTrigger value="Challenges">Challenges</TabsTrigger>
          <TabsTrigger value="Valuation">Valuation</TabsTrigger>
        </TabsList>
  
        <div className="w-full">
          <TabsContent value="Financial Health">
          <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{companyprompt}</Card>
          </TabsContent>
          <TabsContent value="Challenges">
            <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{companyprompt1}</Card>
          </TabsContent>
          <TabsContent value="Valuation">
            <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{companyprompt2}</Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  
    {/* Charts and Sticky Chat */}
    <div className="grid grid-cols-3 gap-3 relative">
      <div className="col-span-2 grid grid-cols-2 gap-2">
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
                  <XAxis dataKey="Quarter" tickLine={false} tickMargin={6} axisLine={false} />
                  <YAxis dataKey={metric} width={100} allowDecimals={true} tickLine={false} tickMargin={10} tickFormatter={(value) => format(",")(value)} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey={metric} radius={4} fill="#4F75FF" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </div>
  
      {/* Sticky Chat */}
      <div className="sticky top-0 right-0 col-span-1 h-screen overflow-y-scroll">
        <Chat raw={data} endpoint='financial' title={`Ask for financial insights from`}  />
      </div>
    </div>
  </div>
  );
};

export default CompanyFinancials;