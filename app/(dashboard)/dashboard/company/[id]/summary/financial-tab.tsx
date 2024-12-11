import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // ShadCN components
import { getAccessToken } from '@auth0/nextjs-auth0/edge';
import { format as d3Format } from "d3-format";



export default async function FinancialTable({ id }) {
  const data = await DataFetch(id);

  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

  const { dataSource, columns } = data;
  console.log('DataSource:', dataSource);
  console.log('column:', columns);

  const formatter = d3Format(",");



  return (
    <Card className="shadow-md p-1">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Financial Summary</h2>
          </div>
        </CardTitle>
      </CardHeader>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Render the column headers correctly */}
              {columns?.map((column, index) => (
                <TableHead key={index} className="text-center font-semibold bg-gray-100">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Iterate through the dataSource and access columns using bracket notation */}
            {dataSource?.map((row, index) => (
              <TableRow key={index}>
                {/* Render the first cell as the row header */}
                <TableCell className="font-semibold">{row.metric}</TableCell>
                {/* Iterate through the columns and render cells */}
                {columns?.slice(1).map((column, colIndex) => {
                const value = row[column];
                const numericValue = Number(value);

                return (
                  <TableCell key={colIndex} className="text-center">
                    { !isNaN(numericValue) ? formatter(numericValue) : (value || "-") }
                  </TableCell>
                );
              })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

async function DataFetch (id: string) {
  const { accessToken } = await getAccessToken();
  const response = await fetch(`http://broadwalkgo.onrender.com/api/financial-summary/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    cache:'force-cache'
  });
  const data = await response.json();
  return data;
}