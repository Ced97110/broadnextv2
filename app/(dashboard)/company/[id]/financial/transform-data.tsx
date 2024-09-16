
export  const transformData = (data, label) => {
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