'use client'

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { addDays, format } from 'date-fns';
import { prepareDataSentiment } from '@/app/data';
import { Calendar } from '@/components/ui/calendar';
import { Pie, PieChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CalendarIcon, Loader, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRange } from 'react-day-picker';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';




const DashboardSentimentChart = ({ periodOptions, sourceOption, sentimentAnalysis, id }) => {
  const [periodParams, setPeriodParams] = useState({ periodType: '0' });
  const [signalSource, setSignalSource] = useState({ signalSource: '0' });
  const [sentiment, setSentimentAnalysis] = useState(sentimentAnalysis);
  const [loading, setLoading] = useState(true);
  const [neutralOption, setNeutral] = useState('no');
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [selectedDate, setSelectedDate] = useState(null);


  console.log('sentimentAnalysis', sentiment);

  useEffect(() => {
   
  
      const fetchData = async () => {
        setLoading(true);

        const formattedStartDate = customDateRange.start
          ? format(new Date(customDateRange.start), 'yyyy-MM-dd')
          : '';
        const formattedEndDate = customDateRange.end
          ? format(new Date(customDateRange.end), 'yyyy-MM-dd')
          : '';

        const newEntities = await prepareDataSentiment({
          CompanyId: id,
          AddNeutralSignal: neutralOption,
          periodParams: periodParams,
          PeriodStartDate: periodParams.periodType === '3' ? formattedStartDate : '',
          PeriodEndDate: periodParams.periodType === '3' ? formattedEndDate : '',
          endpoint: 'SentimenAnalysis',
          SignalSource: signalSource.signalSource,
        });
        setSentimentAnalysis(newEntities);
        setLoading(false);
      };

      fetchData();
    }
  , [signalSource, periodParams, customDateRange, neutralOption, id]);


  const colors = ['#F94144', '#43AA8B', '#e7ecef'];

  // Use the correct data structure for the Pie chart


  const chartConfig = {
    Positive: {
      label: "Positive",
      color: "#43AA8B",
    },
    Negative: {
      label: "Negative",
      color: "#F94144",
    },
    Neutral: {
      label: "Neutral",
      color: "#e7ecef",
    },
  } satisfies ChartConfig;

  
  const chartData = useMemo(
    () =>
      sentiment?.map(({ Type, Score }) => ({
        name: Type,                                // Use 'Type' as the 'name'
        value: parseFloat(Score.replace('', '')), // Convert 'Score' to a number
        fill: chartConfig[Type]?.color || '#8884d8', // Use the color from chartConfig
      })) || [],
    [sentiment, chartConfig]
  );

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  })

  const handleDateChange = (date) => {
    const { from, to } = date;
    setSelectedDate(date);
  
    if (from && to) {
      // Set periodParams once the range is fully selected
      setCustomDateRange({ start: from, end: to });
      setPeriodParams({
        periodType: '3',
      });
    }
  };

 

  return (
    <Card className="shadow-md p-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-muted-foreground h-10 w-10" />
        <span className="ml-2">Fetching data...</span>
      </div>
      ) : (
        <>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Sentiment Analysis</h2>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Toggle for Neutral Signal */}
          <div className='flex flex-col items-center space-y-3'>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Add Neutral Signal:</span>
            <Switch
              checked={neutralOption === 'yes'}
              onCheckedChange={(checked) => setNeutral(checked ? 'yes' : 'no')}
            />
          </div>
          <div>
          <Select onValueChange={(value) => setPeriodParams({ periodType: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.filter((period) => period.label !== 'Custom Date Range').map((option) => (
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
          <Select onValueChange={(value) => setSignalSource({signalSource:value})}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {sourceOption.map((option) => (
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
          <div className={cn("grid gap-1")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Custom Date Range</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                />
              </PopoverContent>
            </Popover>
           </div>
          </div>
          </div>
         
          {/* Recharts Pie Chart */}
          <div className="w-full h-full">
          <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="value" label nameKey="name"  innerRadius={60}/>
          </PieChart>
        </ChartContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
      </>
      )}
    </Card>
  );
};

export default DashboardSentimentChart;