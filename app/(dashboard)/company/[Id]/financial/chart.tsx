'use client'

import React, { use, useEffect, useMemo, useState } from 'react';
import { format } from 'd3-format';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';


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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full">
     
        {metrics.map((metric) => (
          <Card key={metric} className="mb-6">
            <CardHeader>
              <CardTitle>{metric}</CardTitle>
              <CardDescription>Quarterly Performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                  <ComposedChart
                      width={500}
                      height={500}
                      data={data}
                   
                      margin={{
                        top: 60,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="Quarter" tickLine={false} tickMargin={6} axisLine={false} />
                  <YAxis dataKey={metric} width={100} height={500} allowDecimals={true} tickLine={false} tickMargin={10} tickFormatter={(value) => format(",")(value)} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey={metric} radius={4} fill="#f5f5f5" />
                  <Line type="monotone" dataKey={metric}  stroke="#000000" />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  
  );
};

export default CompanyFinancials;