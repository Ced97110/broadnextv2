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




const periodOption = [
  { label: 'This Month', value: '0' },
  { label: 'This Quarter', value: '1' },
  { label: 'Year To Date', value: '2' },
  { label: 'Custom Date Range', value: '3' },
];

function PosNeg({ id,source }) {
  const [periodParams, setPeriodParams] = useState({ periodType: '0' });
  const [neutralOption, setNeutral] = useState('no');
  const [loading, setLoading] = useState(false);
  const [sentimentPositive, setSentimentPositive] = useState([]);
  const [sentimentNegative, setSentimentNegative] = useState([]);
  const [sentimentNeutral, setSentimentNeutral] = useState([]);
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const formattedStartDate = customDateRange.start
        ? format(new Date(customDateRange.start), 'yyyy-MM-dd')
        : '';
      const formattedEndDate = customDateRange.end
        ? format(new Date(customDateRange.end), 'yyyy-MM-dd')
        : '';

      try {
        const promises = [
          prepareDataGo(
            {
              CompanyId: id,
              AddNeutralSignal: neutralOption,
              periodParams: periodParams,
              PeriodStartDate: periodParams.periodType === '3' ? formattedStartDate : '',
              PeriodEndDate: periodParams.periodType === '3' ? formattedEndDate : '',
              endpoint: 'Entities',
              FilterSentiment: '1',
              SignalSource: source,
            },
            'prepare-data-sentiment-entities'
          ),
          prepareDataGo(
            {
              CompanyId: id,
              AddNeutralSignal: neutralOption,
              periodParams: periodParams,
              PeriodStartDate: periodParams.periodType === '3' ? formattedStartDate : '',
              PeriodEndDate: periodParams.periodType === '3' ? formattedEndDate : '',
              FilterSentiment: '2',
              endpoint: 'Entities',
              SignalSource: '1',
            },
            'prepare-data-sentiment-entities'
          ),
        ];

        if (neutralOption === 'yes') {
          promises.push(
            prepareDataGo(
              {
                CompanyId: id,
                AddNeutralSignal: neutralOption,
                periodParams: periodParams,
                PeriodStartDate: periodParams.periodType === '3' ? formattedStartDate : '',
                PeriodEndDate: periodParams.periodType === '3' ? formattedEndDate : '',
                FilterSentiment: '3',
                endpoint: 'Entities',
                SignalSource: '1',
              },
              'prepare-data-sentiment-entities'
            )
          );
        }

        const [positive, negative, neutral] = await Promise.all(promises);

        setSentimentPositive(positive);
        setSentimentNegative(negative);

        if (neutralOption === 'yes') {
          setSentimentNeutral(neutral);
        } else {
          setSentimentNeutral([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, periodParams, neutralOption, customDateRange]);

  const chartConfig = {
    PositiveScore: {
      label: 'Positive',
      color: '#2563eb',
    },
    NegativeScore: {
      label: 'Negative',
      color: '#60a5fa',
    },
    NeutralScore: {
      label: 'Neutral',
      color: '#93c5fd',
    },
  };

  const handleDateChange = (date) => {
    const { from, to } = date || {};
    setSelectedDate(date);

    if (from && to) {
      setCustomDateRange({ start: from, end: to });
      setPeriodParams({ periodType: '3' });
      setIsPopoverOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-around w-full h-full">
        <div className="mb-4">
          <Select onValueChange={(value) => setPeriodParams({ periodType: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {periodOption
                .filter((period) => period.label !== 'Custom Date Range')
                .map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className={cn('grid gap-1')}>
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
                variant={'outline'}
                className={cn(
                  'w-[220px] justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate?.from && selectedDate?.to
                  ? `${format(selectedDate.from, 'yyyy-MM-dd')} - ${format(
                      selectedDate.to,
                      'yyyy-MM-dd'
                    )}`
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
            onCheckedChange={(checked) => setNeutral(checked ? 'yes' : 'no')}
            id="airplane-mode"
          />
          <label htmlFor="airplane-mode">Add Neutral Signal</label>
        </div>
      </div>

      <div>
        {/* Top 10 Positive Entities */}
        <div className="lg:col-span-1">
          <Card className="shadow-md p-4">
            <CardHeader>
              <CardTitle>Top 10 Positive Entities</CardTitle>
              <CardDescription>{/* Add date range or description here */}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                <BarChart data={sentimentPositive} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    type="category"
                    dataKey="EntityName"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <XAxis type="number" tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="PositiveScore"
                    stackId="a"
                    fill="#43AA8B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 Negative Entities */}
        <div className="lg:col-span-1">
          <Card className="shadow-md p-4">
            <CardHeader>
              <CardTitle>Top 10 Negative Entities</CardTitle>
              <CardDescription>{/* Add date range or description here */}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                <BarChart data={sentimentNegative} layout="vertical">
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    type="category"
                    dataKey="EntityName"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    domain={[0, 100]}
                    tickCount={6}
                    allowDataOverflow={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="NegativeScore"
                    stackId="a"
                    fill="#f94144"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Conditional rendering of Neutral Entities */}
        {neutralOption === 'yes' && (
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
                    <CardDescription>{/* Add date range or description here */}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="max-h-[50vh] w-full">
                      <BarChart data={sentimentNeutral} layout="vertical">
                        <CartesianGrid horizontal={false} />
                        <YAxis
                          type="category"
                          dataKey="EntityName"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <XAxis type="number" tickLine={false} />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                          dataKey="NeutralScore"
                          stackId="a"
                          fill="#e7ecef"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

export default PosNeg;