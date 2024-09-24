'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { format, set } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Loader, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { prepareDataSentiment } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAccessToken } from '@auth0/nextjs-auth0/edge';



const NewsSentiment = ({id, period, dataEntities, positiveEntitiesData, negativeEntitiesData, neutralEntitiesData, sentimentSeriesData,company,token}) => {
  const [periodParams, setPeriodParams] = useState({ periodType: '0' });
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [neutralOption, setNeutral] = useState("no");
  const [loading, setLoading] = useState(false);
  const [sentimentSerie, setSentimentSerie] = useState(sentimentSeriesData);
  const [entities, setEntities] = useState(dataEntities);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  console.log('neutral',neutralEntitiesData)

  


  useEffect(() => {

    if (
      periodParams.periodType === '3' &&
      (!customDateRange.start || !customDateRange.end)
    ) {
      return;
    }
    const fetchData = async () => {
      setLoading(true);

      const formattedStartDate = customDateRange.start ? format(new Date(customDateRange.start), 'yyyy-MM-dd') : '';
      const formattedEndDate = customDateRange.end ? format(new Date(customDateRange.end), 'yyyy-MM-dd') : '';

      const [newEntities, neutral] = await Promise.all([
          prepareDataSentiment({
            CompanyId: id,
            AddNeutralSignal: neutralOption,
            periodParams: periodParams,
            PeriodStartDate: periodParams.periodType === '3' ? formattedStartDate : '',
            PeriodEndDate: periodParams.periodType === '3' ? formattedEndDate : '',
            endpoint: 'SentimenSeries',
            SignalSource: '2',
          }, token),
          prepareDataSentiment({
            CompanyId: id,
            AddNeutralSignal: neutralOption,
            periodParams: periodParams,
            PeriodStartDate: '',
            PeriodEndDate: '',
            endpoint: 'Entities',
            SignalSource: '2',
          }, token),
      ]);

      setSentimentSerie(newEntities);
      setEntities(neutral);
      console.log('newEntities', newEntities)
      setLoading(false);
    };

    fetchData();
  }, [periodParams, neutralOption]);

  

 
  interface SentimentData {
    Date?: string;
    Positive?: any;
    Negative?: any;
    Neutral?: any; 
    EntityName?:any// Optional Neutral property
  }

  const sentimentSeriesRecharts = useMemo(() => {
    return sentimentSerie?.map(item => {
      const transformedItem: SentimentData = {
        Date: new Date(item.Date).toLocaleDateString(),
        Positive: item.PositiveScore,
        Negative: item.NegativeScore,
      };

      // Conditionally add Neutral if the option is enabled
      if (neutralOption === "yes") {
        transformedItem.Neutral = item.NeutralScore;
      }

      return transformedItem;
    }) || [];
  }, [sentimentSerie, neutralOption]);


  const allSentimentSeriesRechart = useMemo(() => {
    return entities.slice(0, 10).map((item) => {
      const transformedItem: SentimentData = {
        EntityName: item.EntityName,
        Positive: item.PositiveScore,
        Negative: item.NegativeScore,
      }

      return transformedItem;
    });
  }, [entities]);


  const positivesRechart = useMemo(() => {
    return positiveEntitiesData?.slice(0,10).map((item) => {
      const transformedItem:SentimentData = {
        EntityName: item.EntityName,
        Positive: item.OccurenceRatio,
      }

      return transformedItem;

    });
  }, [positiveEntitiesData])


  const negativeRechart = useMemo(() => {
    return negativeEntitiesData?.slice(0,10).map((item) => {
      const transformedItem:SentimentData = {
        EntityName: item.EntityName,
        Negative: item.OccurenceRatio,
      }

      return transformedItem;

    });
  }, [negativeEntitiesData])


  const neutralRechart = useMemo(() => {
    return neutralEntitiesData?.slice(0,10).map((item) => {
      const transformedItem:SentimentData = {
        EntityName: item.EntityName,
        Neutral: item.OccurenceRatio,
      }

      return transformedItem;

    });
  }, [neutralEntitiesData])

  const merged =  {...sentimentSeriesRecharts,...allSentimentSeriesRechart, ...positivesRechart, ...negativeRechart, ...neutralRechart}


  const chartConfig = {
    Positive: {
      label: "Positive",
      color: "#2563eb",
    },
    Negative: {
      label: "Negative",
      color: "#60a5fa",
    },
    Neutral: {
      label: "Neutral",
      color: "#93c5fd",
    },
  } satisfies ChartConfig


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
    <div className="p-6">
      
    <div className="flex justify-between w-full mb-4"></div>
  
    <div>
      <div className="flex justify-around">
        <div className="mb-4">
          <div>
            <Select onValueChange={(value) => setPeriodParams({ periodType: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {period.filter((period) => period.label !== 'Custom Date Range').map((option) => (
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
        <div className="flex items-center space-x-2">
          <Switch
            className="bg-gray-600"
            onCheckedChange={(checked: boolean) => setNeutral(checked ? 'yes' : 'no')}
            id="airplane-mode"
          />
          <label htmlFor="airplane-mode">Add Neutral Signal</label>
        </div>
      </div>
  
      {/* Grid layout for graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* First two graphs stacked on top of each other */}
        <div className="col-span-1">
          <Card className="shadow-md p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-muted-foreground h-10 w-10" />
                <span className="ml-2">Fetching data...</span>
              </div>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Sentiment Over Time</CardTitle>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                    <BarChart accessibilityLayer data={sentimentSeriesRecharts}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="Date"
                        tickLine={false}
                        tickMargin={6}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="Negative" stackId="a" fill="#f94144" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="Positive" stackId="a" fill="#43AA8B" radius={[4, 4, 0, 0]} />
                      {neutralOption === "yes" && (
                        <Bar dataKey="Neutral" stackId="a" fill="#e7ecef" radius={[4, 4, 0, 0]} />
                      )}
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
  
        {/* Popular Entities Sentiment */}
        <div className="col-span-1">
          <Card className="shadow-md p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-muted-foreground h-10 w-10" />
                <span className="ml-2">Fetching data...</span>
              </div>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Popular Entities Sentiment (Top 10)</CardTitle>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                    <BarChart data={allSentimentSeriesRechart} layout="vertical">
                      <CartesianGrid horizontal={false} />
                      <YAxis type="category" dataKey="EntityName" tickLine={false} width={90} tickMargin={10} axisLine={false} />
                      <XAxis type="number" tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="Negative" stackId="a" fill="#f94144" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="Positive" stackId="a" fill="#43AA8B" radius={[4, 4, 0, 0]} />
                      {neutralOption === "yes" && (
                        <Bar dataKey="Neutral" stackId="a" fill="#e7ecef" radius={[4, 4, 0, 0]} />
                      )}
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
  
        {/* Top 10 Positive Entities */}
        <div className="lg:col-span-1">
          <Card className="shadow-md p-4">
                <CardHeader>
                  <CardTitle>Top 10 Positive Entities</CardTitle>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                    <BarChart data={positivesRechart} layout="vertical">
                      <CartesianGrid horizontal={false} />
                      <YAxis type="category" dataKey="EntityName" width={90} tickLine={false} tickMargin={1} axisLine={false} />
                      <XAxis type="number" tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="Positive" stackId="a" fill="#43AA8B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                  </div>
                </CardFooter>
      
          </Card>
        </div>
  
        {/* Top 10 Negative Entities */}
        <div className="lg:col-span-1">
          <Card className="shadow-md p-4">
                <CardHeader>
                  <CardTitle>Top 10 Negative Entities</CardTitle>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                    <BarChart data={negativeRechart} layout="vertical">
                      <CartesianGrid horizontal={false} />
                      <YAxis type="category" dataKey="EntityName" tickLine={false}  width={90}tickMargin={1} axisLine={false} />
                      <XAxis type="number" tickLine={false}  domain={[0, 100]}   tickCount={1} allowDataOverflow={true}  />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="Negative" stackId="a" fill="#f94144" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                  </div>
                </CardFooter>
          </Card>
        </div>
  
        {/* Conditional rendering of Neutral Entities */}
        {neutralOption === "yes" && (
          <div className="lg:col-span-1">
            <Card className="shadow-md p-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader className="animate-spin text-muted-foreground h-10 w-10" />
                  <span className="ml-2">Fetching data...</span>
                </div>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>Top 10 Neutral Entities</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                      <BarChart data={neutralRechart} layout="vertical">
                        <CartesianGrid horizontal={false} />
                        <YAxis type="category" dataKey="EntityName" tickLine={false} tickMargin={1} width={90} axisLine={false} />
                        <XAxis type="number" tickLine={false} />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="Neutral" stackId="a" fill="#e7ecef" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                      Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing total visitors for the last 6 months
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default NewsSentiment;
