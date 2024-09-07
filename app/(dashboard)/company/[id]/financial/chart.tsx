'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { format } from 'd3-format';



const CompanyFinancials = ({data}) => {


  const transformData = (data, label) => {
    let quarters = [];
    let values = [];
    let chartTypes;
  
    data?.forEach((item) => {
      if (item.Label === 'QUARTER') {
        quarters = item.Results;
      } else if (item.Label === label) {
        values = item.Results;
        chartTypes = item.ChartType;
      }
    });
  
    if (!quarters.length || !values.length) {
      console.error(`Data for ${label} not found`);
      return { highchartData: [], chartTypeData: [] };
    }
  
    const highchartData = quarters.map((quarter, index) => ({
      type: quarter,
      value: parseFloat(values[index] || 0),
    }));
  
    const chartTypeData = chartTypes;
  
    return { highchartData, chartTypeData };
  };

  const dataTransforms = [
    { title: 'Revenue (USD) per Quarter', key: 'Revenue (USD)' },
    { title: 'Net Income (USD) per Quarter', key: 'Net Income (USD)' },
    { title: 'Operating Income (USD) per Quarter', key: 'Operating Income (USD)' },
    { title: 'Diluted Earnings Per Share Quarter', key: 'Diluted Earning Per Share (USD/Share)' },
    { title: 'Cash, cash equivalents and restricted cash, beginning balances (USD)', key: 'Cash, cash equivalents and restricted cash, beginning balances (USD)' },
    { title: 'Gross Margin', key: 'Gross Margin' },
    { title: 'Operating Margin', key: 'Operating Margin' },
    { title: 'Net Profit Margin', key: 'Net Profit Margin' },
    { title: 'Current Ratio', key: 'Current Ratio' },
    { title: 'Quick Ratio', key: 'Quick Ratio' },
    { title: 'Debt-to-Equity Ratio', key: 'Debt-to-Equity Ratio' },
    { title: 'Interest Coverage Ratio', key: 'Interest Coverage Ratio' },
    { title: 'Price-to-Book (P/B) Ratio', key: 'Price-to-Book (P/B) Ratio' },
    { title: 'Price-to-Earnings (P/E) Ratio', key: 'Price-to-Earnings (P/E) Ratio' },
    { title: 'Inventory Turnover', key: 'Inventory Turnover' },
    { title: 'Asset Turnover', key: 'Asset Turnover' },
    { title: 'Stock Close Price ($)', key: 'Stock Close Price ($)' }
  ];

  const memoizedData = dataTransforms.map(({ key }) => 
    useMemo(() => transformData(data?.Results, key), [data])
  );

  const createChartOptions = (data, chartType, titleY) => {
    return {
      chart: {
        type: chartType === 1 ? 'spline' : 'column',
        height: 400,
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: data.map((d) => d.type),
        title: {
          text: 'Quarter',
          style: { fontSize: 14, fontWeight: 'bold' },
        },
      },
      yAxis: {
        title: {
          text: titleY,
          style: { fontSize: 14, fontWeight: 'bold' },
        },
        labels: {
          formatter: function () {
            return format(',')(this.value);
          },
        },
      },
      series: [
        {
          name: titleY,
          data: data.map((d) => d.value),
        },
      ],
      legend: false,
    };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between w-full mb-4">
        {/* You can add header content here if needed */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dataTransforms.map((item, index) => (
          <div key={item.key} className="bg-white border rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">{item.title}</h2>
            </div>
            <div className="p-4">
              <HighchartsReact
                highcharts={Highcharts}
                options={createChartOptions(memoizedData[index].highchartData, memoizedData[index].chartTypeData, item.title)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyFinancials;