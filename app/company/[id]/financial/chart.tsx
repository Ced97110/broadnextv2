'use client'

import React, { use, useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { format } from 'd3-format';
import { transformData } from './transform-data';
import { useChat } from 'ai/react';


const CompanyFinancials = ({ data }) => {
  const [summaryData, setSummaryData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const financialData = data?.Results || [];


  const formatFinancialData = (data) => {
    return data?.Results.map(item => {
      const label = item.Label;
      const results = item.Results.join(', '); // Join the result array values with commas
      return `${label}: ${results}`;
    }).join('\n'); // Join each item into a new line for better readability
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
    { title: 'Stock Close Price ($)', key: 'Stock Close Price ($)' },
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
       <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}
    </div>
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={data.Results}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>

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