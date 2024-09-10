import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // ShadCN components
import { useMemo } from 'react';
import { prepareDataSource } from './format-data';

export default async function FinancialTable ({data }) {

  const { dataSource, columns } = useMemo(() => prepareDataSource(data?.Results), [data]);

  
  if (dataSource.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <Card className="shadow-md p-4">
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
              {columns.map((column) => (
                <TableHead key={column} className="text-center font-semibold bg-gray-100">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSource.map((row) => (
              <TableRow key={row.key}>
                <TableCell className="font-semibold">{row.metric}</TableCell>
                {columns.slice(1).map((column) => (
                  <TableCell key={column} className="text-center">
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

