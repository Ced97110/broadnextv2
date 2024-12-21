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
  SelectLabel,
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
import Loading from '../load';
import { periodOption } from '../twitter-sentiment/twitter-entities';

const period = [
  { "label": "This Month", "value": "0" },
  { "label": "This Quarter", "value": "1" },
  { "label": "Year To Day", "value": "2" },
  { "label": "Custom Date Range", "value": "3" }
];

const defaultSignalSources = [
  { "label": "All Sources", "value": "0" },
  { "label": "Twitter", "value": "1" },
  { "label": "News Feed", "value": "2" }
];

export const DashboardSentimentChart = ({ id }) => {
  const [selectedPeriodType, setSelectedPeriodType] = useState("0");
  const [selectedSignalSource, setSelectedSignalSource] = useState("0");
  const [signalSource, setSignalSource] = useState(defaultSignalSources);
  const [sentiment, setSentimentAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [neutralOption, setNeutral] = useState('no');
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (selectedPeriodType === '3' && (!customDateRange.start || !customDateRange.end)) {
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
        periodParams: { periodType: selectedPeriodType },
        PeriodStartDate: selectedPeriodType === '3' ? formattedStartDate : '',
        PeriodEndDate: selectedPeriodType === '3' ? formattedEndDate : '',
        endpoint: 'SentimenAnalysis',
        SignalSource: selectedSignalSource
      }, '1');

    

      if (newEntities.length === 0) {
        setLoading(false);
        return;
      }
      setSentimentAnalysis(newEntities);
      setLoading(false);
    };

    fetchData();
  }, [selectedPeriodType, customDateRange, neutralOption, id, selectedSignalSource]);

  const chartConfig = {
    Positive: { label: "Positive", color: "#43AA8B" },
    Negative: { label: "Negative", color: "#F94144" },
    Neutral: { label: "Neutral", color: "#e7ecef" },
  } satisfies ChartConfig;

  const chartData = useMemo(
    () =>
      sentiment?.map(({ Type, Score }) => ({
        name: Type,
        value: parseFloat(Score),
        fill: chartConfig[Type]?.color || '#8884d8',
      })) || [],
    [sentiment, chartConfig]
  );

  const handleDateChange = (date) => {
    const { from, to } = date || {};
    setSelectedDate(date);

    if (from && to) {
      setCustomDateRange({ start: from, end: to });
      setSelectedPeriodType('3');
      setIsPopoverOpen(false);
    }
  };

  return (
    <Card className="shadow-md p- w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
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
              <div className='flex flex-col items-center space-y-3'>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Add Neutral Signal:</span>
                  <Switch
                    checked={neutralOption === 'yes'}
                    onCheckedChange={(checked) => setNeutral(checked ? 'yes' : 'no')}
                  />
                </div>
                <div>
                  <Select value={selectedPeriodType} onValueChange={(value) => setSelectedPeriodType(value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {period
                        .filter((p) => p.label !== 'Custom Date Range')
                        .map((option, i) => (
                          <SelectItem key={i} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedSignalSource} onValueChange={(value) => setSelectedSignalSource(value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {signalSource.map((option, i) => (
                        <SelectItem key={i} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
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
                            ? `${format(selectedDate.from, 'yyyy-MM-dd')} - ${format(selectedDate.to, 'yyyy-MM-dd')}`
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

              <div className="w-full h-full">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-square pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {chartData && chartData.length > 0 && (
                      <Pie data={chartData} dataKey="value" label nameKey="name" innerRadius={60} />
                    )}
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