'use client'


import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { prepareData, prepareDataGo, prepareDataSentiment } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Loader } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Loading from '@/app/(dashboard)/load';



const periodOption = [
  { label: 'This Month', value: '0' },
  { label: 'This Quarter', value: '1' },
  { label: 'Year To Date', value: '2' },
  { label: 'Custom Date Range', value: '3' },
];


export default function Entities ({params}){
  const [periodParams, setPeriodParams] = useState({ periodType: '0' });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false)
  const [neutralOption, setNeutral] = useState("no");
  const [loading, setLoading] = useState(false);
  const [sentimentEntities, setSentimentEntities] = useState<any>([]);
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);


  useEffect(() => {
     async function fetchData () {
      setLoading(true);
      const formattedStartDate = customDateRange.start ? format(new Date(customDateRange.start), 'yyyy-MM-dd') : '';
      const formattedEndDate = customDateRange.end ? format(new Date(customDateRange.end), 'yyyy-MM-dd') : '';
      const response = await prepareDataGo({
          CompanyId: params.Id,
          AddNeutralSignal: neutralOption,
          periodParams: periodParams,
          PeriodStartDate: periodParams.periodType === '3' ? formattedStartDate : '',
          PeriodEndDate: periodParams.periodType === '3' ? formattedEndDate : '',
          endpoint: 'Entities',
          SignalSource: '1',
          
        },'prepare-data-sentiment-entities')
       
        setSentimentEntities(response);

         setLoading(false);
    };

    fetchData();
  }, [periodParams, neutralOption]);

  
 const period = []
 
  interface SentimentData {
    Date?: string;
    Positive?: any;
    Negative?: any;
    Neutral?: any; 
    EntityName?:any// Optional Neutral property
  }
  

  const chartConfig = {
    PositiveScore: {
      label: "Positive",
      color: "#2563eb",
    },
    NegativeScore: {
      label: "Negative",
      color: "#60a5fa",
    },
    NeutralScore: {
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
      setPeriodParams({periodType: '3',});
      setIsPopoverOpen(false);
     
    }
  };


  

  
  return (
    <>
      <div className="flex justify-between w-full h-full">
        <div className="mb-4">
          <Select defaultValue={periodOption[0].value} onValueChange={(value) => setPeriodParams({ periodType: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {periodOption.filter((period) => period.label !== 'Custom Date Range').map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        <div className="flex items-center space-x-2">
          <Switch
            className="bg-gray-600"
            onCheckedChange={(checked: boolean) => setNeutral(checked ? 'yes' : 'no')}
            id="airplane-mode"
          />
          <label htmlFor="airplane-mode">Add Neutral Signal</label>
        </div>
      </div>

      <div className="">
      
        <Card className="shadow-md p-1 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
            <span className="ml-2">Fetching data...</span>
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Popular Entities Sentiment (Top 10)</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Check if sentimentSerie has valid data */}
              {sentimentEntities && sentimentEntities.length > 0 ? (
                <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                <BarChart data={sentimentEntities} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
                  <CartesianGrid horizontal={false} />
                  <YAxis type="category" dataKey="EntityName" tickLine={false}  tickMargin={8} axisLine={false} />
                  <XAxis type="number" tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="NegativeScore" stackId="a" fill="#f94144" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="PositiveScore" stackId="a" fill="#43AA8B" radius={[4, 4, 0, 0]} />
                  {neutralOption === "yes" && (
                    <Bar dataKey="NeutralScore" stackId="a" fill="#e7ecef" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ChartContainer>
              ) : (
                // Display a message when no data is available
                <div className="flex justify-center items-center h-32">
                  <span className="text-sm text-muted-foreground">No sentiment data available for the selected period.</span>
                </div>
              )}
            </CardContent>
          </>
            )}
       </Card>
      </div>
   
      </>
  )};


