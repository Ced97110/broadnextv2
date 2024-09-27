import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // ShadCN components
import { useEffect, useState } from 'react';




export default function FinancialTable({ data }) {


  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

  const { dataSource, columns } = data;

  console.log('Data', data);

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
}
