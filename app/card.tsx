import { FC, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card component
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {
  company?: any;
  title: string;
  color?: string;
  description?: any;
  titleCard?: string;
  number?: [number, number];
  Id?: number;
  portfolio?: any;
};


export const CompanyCard = ({ company, title }) => {
  return (
    <div className="mb-4 w-full">
    <Card className="border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="bg-gray-50 p-4">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        {/* Portfolio Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {company.map((companyItem) => (
              <TableRow key={companyItem.Id}>
                {/* Company Info: Logo and Name */}
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={companyItem.LogoUrl ?? '/logo.png'}
                      className="w-12 h-12 object-contain"
                      width={36}
                      height={36}
                      alt={`${companyItem?.Name ?? 'Company'} Logo`}
                    />
                    <Link
                      href={`company/${companyItem.Id}/summary`}
                      className="font-medium text-gray-800 hover:underline truncate max-w-xs"
                    >
                      {companyItem?.Name ?? 'Company'}
                    </Link>
                  </div>
                </TableCell>

                {/* Ticker */}
                <TableCell>
                  <span className="text-sm text-gray-600">{companyItem?.Ticker ?? 'N/A'}</span>
                </TableCell>

                {/* Stock Price */}
                <TableCell className="text-right">
                  <span className="font-medium text-gray-900">{companyItem?.Price ? `$${companyItem.Price}` : 'N/A'}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  );
};