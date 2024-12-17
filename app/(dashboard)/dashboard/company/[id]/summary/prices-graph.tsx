'use client'
import React from 'react';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Company } from './page';
import PriceIndicator from '../../price-indicator';
import { Button } from '@/components/ui/button';



interface RawPriceData {
  Date: string;
  Price: number;
}

interface PricesGraphProps {
  data: RawPriceData[];
  company: Company
}

export const PricesGraph = ({ data,company }: PricesGraphProps) => {
  const [timeRange, setTimeRange] = React.useState("7d");

  // Reference Date
  const referenceDate = React.useMemo(() => new Date(), []);

  // Determine days to subtract based on timeRange
  const daysToSubtract = React.useMemo(() => {
    switch (timeRange) {
      case "30d":
        return 30;
      case "7d":
        return 7;
      case "1y":
        return 365;
      case "90d":
        return 90;
      case "180d":
        return 180;
        default:
          return 90;
    }
  }, [timeRange]);

  // Calculate start date
  const startDate = React.useMemo(() => {
    const date = new Date(referenceDate);
    date.setDate(date.getDate() - daysToSubtract);
    return date;
  }, [referenceDate, daysToSubtract]);

  // Transform and filter data based on date range
  const filteredData = React.useMemo(() => {
   
    const result = data
      .filter((item) => {
        const itemDate = new Date(item.Date);
        return itemDate >= startDate && itemDate <= referenceDate;
      })
      .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

    console.log("Filtered Data:", result); // Debugging

    return result;
  }, [data, startDate, referenceDate]);

  const timeRanges = [
    { value: '7d', label: '1W' },
    { value: '30d', label: '1M' },
    { value: '90d', label: '3M' },
    { value: '180d', label: '6M' },
    { value: '1y', label: '1Y' },
  ];

  const chartConfig = {
    Price: {
      label: "Price",
      color: "hsl(var(--chart-1))", // Ensure this CSS variable is defined
    } as ChartConfig
  };

  return (
    <Card className='max-h-[658px]'>
      <CardHeader className="flex flex-col items-start gap-4 border-b py-5">
        {/* Price Information */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <CardTitle className="text-xl flex items-center gap-2">
            <span>${company.ClosePrice}</span>
            <PriceIndicator 
              PriceMovement={Number(company.PriceMovement)} 
              PriceChange={Number(company.PriceChange)}
            />
          </CardTitle>
        </div>

        {/* Time Range Selection Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium focus:outline-none transition-colors duration-200 ${
                timeRange === range.value
                  ? 'text-white'
                  : 'bg-transparent text-black hover:bg-blue-100'
              }`}
              aria-pressed={timeRange === range.value}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[233px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={`hsl(var(--chart-1))`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`hsl(var(--chart-1))`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="Date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  // Determine if the range is 1 year
                  if (daysToSubtract === 365) {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    });
                  }
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                dataKey="Price"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                cursor={{ stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
                content={({ active, payload, label }) => (
                  <CustomTooltip active={active} payload={payload} label={label} />
                )}
              />
              <Area
                type="monotone"
                dataKey="Price"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorPrice)"
                name="Price"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

// Custom Tooltip Component


function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const date = new Date(label);
    return (
      <div className="custom-tooltip p-2 bg-white border rounded shadow">
        <p className="label">{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: 'numeric' })}</p>
        <p className="intro">Price: ${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }

  return null;
}