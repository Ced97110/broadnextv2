'use client'

import React, { use, useEffect, useMemo, useState } from 'react';
import { format } from 'd3-format';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';


const CompanyFinancials = ({ data, companyprompt,companyprompt1, companyprompt2, companyId }) => {

  

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
    'Stock Close Price (USD)',
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
    'Price-to-Earnings (P/E) Ratio',
    'Price-to-Book (P/B) Ratio',
  ];


  


  return (
    <div className="flex flex-col p-2 w-full">

    <div className="grid grid-cols-2 gap-6 w-full h-full">
     
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
    </div>
  
  );
};

export default CompanyFinancials;