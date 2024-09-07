'use client'

import React, { useEffect, useMemo, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { format } from 'date-fns';
import { prepareDataSentiment } from '../../data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';


const TwitterSentiment = ({ period, dataEntities, positiveEntitiesData, negativeEntitiesData, neutralEntitiesData, sentimentSeriesData }) => {
  const [periodParams, setPeriodParams] = useState({ periodType: 0 });
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false)
  const [neutralOption, setNeutral] = useState("no");
  const [loading, setLoading] = useState(false);
  const [sentimentSerie, setSentimentSerie] = useState(sentimentSeriesData);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const formattedStartDate = customDateRange.start ? format(new Date(customDateRange.start), 'yyyy-MM-dd') : '';
      const formattedEndDate = customDateRange.end ? format(new Date(customDateRange.end), 'yyyy-MM-dd') : '';

      const newEntities = await prepareDataSentiment({
        CompanyId: '1527',
        AddNeutralSignal: neutralOption,
        periodParams: periodParams,
        PeriodStartDate: periodParams.periodType === 3 ? formattedStartDate : '',
        PeriodEndDate: periodParams.periodType === 3 ? formattedEndDate : '',
        endpoint: 'SentimenSeries',
        SignalSource: '1',
      });
      setSentimentSerie(newEntities);
      console.log('newEntities', newEntities)
      setLoading(false);
    };

    fetchData();
  }, [periodParams, neutralOption]);

  const handleDateChange = (date) => {
    const { from, to } = date;
    setSelectedDate(date);
    setCustomDateRange({ start: from, end: to });
    setPeriodParams({
      periodType: 3,
    });
  };

  const record = dataEntities;
  const recordPositive = positiveEntitiesData;
  const recordNegative = negativeEntitiesData;
  const recordNeutral = neutralEntitiesData;

  const categories = useMemo(() => record?.slice(0, 10).map(item => item.EntityName) || [], [record]);
  const positiveScores = useMemo(() => record?.slice(0, 10).map(item => Math.round(item.PositiveScore)) || [], [record]);
  const negativeScores = useMemo(() => record?.slice(0, 10).map(item => Math.round(item.NegativeScore)) || [], [record]);
  const neutralScores = useMemo(() => record?.slice(0, 10).map(item => Math.round(item.NeutralScore)) || [], [record]);

  const categoriesEntitiesPositive = useMemo(() => recordPositive?.slice(0, 10).map(item => item.EntityName) || [], [record]);
  const categorieEntitiesNegative = useMemo(() => recordNegative?.slice(0, 10).map(item => item.EntityName) || [], [record]);
  const categorieEntitiesNeutral = useMemo(() => recordNeutral?.slice(0, 10).map(item => item.EntityName) || [], [record]);
  const positiveScoresEntities = useMemo(() => recordPositive?.slice(0, 10).map(item => Math.round(item.OccurenceRatio)) || [], [recordPositive]);
  const negativeScoresEntities = useMemo(() => recordNegative?.slice(0, 10).map(item => Math.round(item.OccurenceRatio)) || [], [recordNegative]);
  const neutralScoresEntities = useMemo(() => recordNeutral?.slice(0, 10).map(item => Math.round(item.OccurenceRatio)) || [], [recordNeutral]);

  const sentimentCategories = useMemo(() =>
    sentimentSerie?.map(item => new Date(item.Date).toLocaleDateString()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) || [],
    [sentimentSerie]
  );
  const sentimentPositiveScores = useMemo(() => sentimentSerie?.map(item => item.PositiveScore) || [], [sentimentSerie]);
  const sentimentNegativeScores = useMemo(() => sentimentSerie?.map(item => item.NegativeScore) || [], [sentimentSerie]);
  const sentimentNeutralScores = useMemo(() => sentimentSerie?.map(item => item.NeutralScore) || [], [sentimentSerie]);

  const positiveSentimentSeries = [{ name: 'Tweet Count', data: positiveScoresEntities, color: '#43AA8B', type: "bar" }];
  const negativeSentimentSeries = [{ name: 'Tweet Count', data: negativeScoresEntities, color: '#f94144', type: "bar" }];
  const neutralSentimentSeries = [{ name: 'Tweet Count', data: neutralScoresEntities, color: "#e7ecef", type: "bar" }]

  const allSentimentsSeries = useMemo(() => {
    const series = [
      { name: 'Positive', data: positiveScores, color: '#43AA8B', type: 'column' },
      { name: 'Negative', data: negativeScores, color: '#f94144', type: 'column' },
    ];

    if (neutralOption === "yes") {
      series.push({
        name: 'Neutral',
        data: neutralScores,
        color: "#e7ecef",
        type: 'column'
      });
    }

    return series;
  }, [neutralOption, positiveScores, negativeScores, neutralScores]);

  console.log('allSentimentsSeries', allSentimentsSeries)

  const sentimentSeries = useMemo(() => {
    const series = [
      { name: 'Positive', data: sentimentPositiveScores, color: '#43AA8B', type: 'column' },
      { name: 'Negative', data: sentimentNegativeScores, color: '#f94144', type: 'column' },
    ];

    if (neutralOption === "yes") {
      series.push({
        name: 'Neutral',
        data: sentimentNeutralScores,
        color: "#e7ecef",
        type: 'column'
      });
    }

    return series;
  }, [neutralOption, sentimentPositiveScores, sentimentNegativeScores, sentimentNeutralScores]);

  const createChartOptions = useMemo(() => (title, series, type, categories, stacking = 'normal', typePlot, xLabel, yLabel, percentage = 'true', showTooltip = true, tooltipFormat = 'percentage',) => ({
    chart: {
      type: type,
      height: 500,
    },
    title: {
      text: title,
    },
    xAxis: {
      categories: categories,
      title: {
        text: xLabel,
        style: { fontSize: 14, fontWeight: 'bold' },
      },
    },
    yAxis: {
      max: 100,
      title: {
        text: yLabel,
        style: { fontSize: 14, fontWeight: 'bold' },
      },
      labels: {
        rotation: 0,
        align: 'right',
        style: {
          fontSize: '12px',
        },
      },
    },
    tooltip: showTooltip
      ? {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          tooltipFormat === 'percentage'
            ? '<span style="color:{point.color}">{point.name}</span> <b>{point.y:.2f}%</b><br/>'
            : '<span style="color:{point.color}">{point.name}</span> <b>{point.y}</b><br/>',
      }
      : false,
    plotOptions: {
      [typePlot]: {
        stacking: stacking,
        dataLabels: {
          enabled: false,
          color: '#ffffff',
          formatter: function () {
            return percentage === 'true' ? this.y + '%' : this.y;
          },
        },
      },
    },
    series: series,
  }), [neutralOption, sentimentPositiveScores, sentimentNegativeScores, sentimentNeutralScores]);

  return (
    <div className="p-6">
      <div className="flex justify-between w-full mb-4"></div>

      <div>
        <div className="flex justify-around">
          <div className="mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger className='border black rounded-md p-2'>
                Select Period
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {period.map((option, index) => (
                  <DropdownMenuItem
                    key={index}
                    onSelect={() => {
                      if (option.value === 3) {
                        setShowCustomDateRange(true);
                      } else {
                        setPeriodParams({ periodType: option.value });
                        setShowCustomDateRange(false);
                      }
                    }}
                  >
                    {option.label || option.value}
                  </DropdownMenuItem>
                ))}
                {showCustomDateRange && (
                  <div className="p-4">
                    <Calendar
                      mode="range"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      className="rounded-md border"
                    />
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
            className='bg-gray-600'
              onCheckedChange={(checked: boolean) => setNeutral(checked ? 'yes' : 'no')}
              id="airplane-mode"
            />
            <label htmlFor="airplane-mode">Add Neutral Signal</label>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <HighchartsReact
              highcharts={Highcharts}
              options={createChartOptions('Sentiment Over Time', sentimentSeries, 'column', sentimentCategories, 'normal', 'series', '', '', 'true', true, 'percentage')}
            />
          </div>
          <div>
            <HighchartsReact
              highcharts={Highcharts}
              options={createChartOptions('Popular Entities Sentiment (Top 10)', allSentimentsSeries, 'bar', categories, 'normal', 'series', '', '', 'true', true, 'percentage')}
            />
          </div>
          <div>
            <HighchartsReact highcharts={Highcharts} options={createChartOptions('Top 10 Positive Entities', positiveSentimentSeries, 'column', categoriesEntitiesPositive, 'normal', 'bar', '', '', 'false', true, '')} />
          </div>
          <div>
            <HighchartsReact highcharts={Highcharts} options={createChartOptions('Top 10 Negative  Entities', negativeSentimentSeries, 'column', categorieEntitiesNegative, 'normal', 'bar', '', '', 'false', true, '')} />
          </div>
          {neutralOption === 'yes' ? (
            <div>
              <HighchartsReact highcharts={Highcharts} options={createChartOptions('Top 10 Neutral Entities', neutralSentimentSeries, 'column', categorieEntitiesNeutral, 'normal', 'bar', '', '', 'false', true, '')} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TwitterSentiment;
