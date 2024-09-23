



export default async function processData (financials: any)  {
  const quarters = financials.Results?.find(item => item.Label === 'QUARTER')?.Results || [];

  console.log('QUARTERS',quarters);

  const data = quarters.map((quarter,index) => {
    const row = {Quarter: quarter}
    financials.Results?.forEach(({Label,Results,ChartType}) => {
      if(Label !== 'QUARTER') {
        row[Label] = Results[index]
        row['ChartType'] = ChartType
      }
    })
    return row
  })

  return data;
}