'use client'

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { addDays, format, set } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Pie, PieChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CalendarIcon, Loader, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRange } from 'react-day-picker';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { prepareData } from '@/lib/data';
import { Progress } from '@/components/ui/progress';






const DashboardSentimentChart = ({ periodOptions, sourceOption, id }) => {
  const [periodParams, setPeriodParams] = useState({ periodType: '0' });
  const [signalSource, setSignalSource] = useState({ signalSource: '' });
  const [sentiment, setSentimentAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [neutralOption, setNeutral] = useState('no');
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);


  console.log('sentimentAnalysis', sentiment);

  useEffect(() => {

    if (
      periodParams.periodType === '3' &&
      (!customDateRange.start || !customDateRange.end)
    ) {
      return;
    }
   
  
      const fetchData = async () => {
        setLoading(true);

        const formattedStartDate = customDateRange.start
          ? format(new Date(customDateRange.start), 'yyyy-MM-dd')
          : '';
        const formattedEndDate = customDateRange.end
          ? format(new Date(customDateRange.end), 'yyyy-MM-dd')
          : '';

        const newEntities = await prepareData({
          CompanyId: id,
          AddNeutralSignal: neutralOption,
          periodParams: periodParams,
          PeriodStartDate: periodParams.periodType === '3' ? formattedStartDate : '',
          PeriodEndDate: periodParams.periodType === '3' ? formattedEndDate : '',
          endpoint: 'SentimenAnalysis',
          SignalSource: signalSource.signalSource,
        }, '1');
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

 

  const handleDateChange = (date) => {
    const { from, to } = date || {};
    setSelectedDate(date);
  
    if (from && to) {
      // Set periodParams once the range is fully selected
      setCustomDateRange({ start: from, end: to });
      setPeriodParams({
        periodType: '3',
      });
      setIsPopoverOpen(false);
     
    }
  };

 

  return (
    <Card className="shadow-md p- w-full">
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
      <div className="flex justify-start items-center gap-4">
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
         <Select defaultValue={periodParams.periodType} onValueChange={(value) => setPeriodParams({ periodType: value })}>
            <SelectTrigger  className="w-[150px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions?.filter((period) => period.label !== 'Custom Date Range').map((option,i) => (
                <SelectItem key={i} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
        <Select value={signalSource.signalSource} onValueChange={(value) => setSignalSource({signalSource:value})}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOption.map((option,i) => (
                <SelectItem key={i} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
        <div className={cn("grid gap-1")}>
        <Popover
                onOpenChange={(open) => {
                  setIsPopoverOpen(open);
                  if (open) {
                    // Reset the date selection when the popover opens
                    setSelectedDate(null);
                  }
                }}
                open={isPopoverOpen}
              >
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[220px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate?.from && selectedDate?.to
                      ? `${format(
                          selectedDate.from,
                          'yyyy-MM-dd'
                        )} - ${format(selectedDate.to, 'yyyy-MM-dd')}`
                      : 'Custom Date Range'}
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
        <Progress value={33} /><Progress value={23} />
        <ChartContainer
        config={chartConfig}
        className="aspect-square pb-0 [&_.recharts-pie-label-text]:fill-foreground"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie data={chartData} dataKey="value" label nameKey="name"  innerRadius={60}/>
        </PieChart>
      </ChartContainer>
        </div>
      </div>
    </CardContent>
    </>
    )}
  </Card>
  );
};

export default DashboardSentimentChart;