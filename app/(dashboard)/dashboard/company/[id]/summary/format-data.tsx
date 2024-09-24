import { format } from "d3-format";


export async function prepareDataSource (apiData) {
    console.log("API Data Received:", apiData); // Log the raw data received from the API
    if (!apiData) return { dataSource: [], columns: [] };
  
    const dataSource = [];
    const columns = ["Quarter(USD)"];
  
    apiData[0]?.Results.forEach((quarter) => {
      columns.push(quarter);
    });
  
    const formatValue = format(",");
  
    apiData.slice(1).forEach((item) => {
      const row = { key: item.Label, metric: item.Label };
      item.Results.forEach((value, idx) => {
        row[apiData[0].Results[idx]] = value === '0' ? '-' : formatValue(value);
      });
      dataSource.push(row);
    });
  
    console.log("Data Source Prepared:", dataSource); // Log the prepared dataSource
    return { dataSource, columns };
  };