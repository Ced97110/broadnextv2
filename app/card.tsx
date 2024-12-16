'use client'

import { FC, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card component
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, CirclePlus } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Spinner } from '@/components/icons';
import { CompanyUser} from '@/lib/data';

type Props = {
  company?: any;
  title: string;
  color?: string;
  description?: any;
  titleCard?: string;
  number?: [number, number];
  Id?: number;
  portfolio?: any;
  handleWatchList?: (Id: number) => void;
  path?: string;
};




export const CompanyCardWatchlist = ({ company, title, handleWatchList,path }) => {

  const [addedCompanies, setAddedCompanies] = useState(company);
  const [loadingCompanies, setLoadingCompanies] = useState([]);

  const { user } = useUser();


    useEffect(() => {
      CompanyUser().then((data) => {
        setAddedCompanies(data);
      }
      );
    }, [handleWatchList]);

 

  console.log('COMPANY',company)
  return (
    <div className="mb-4 w-full rounded-lg">
    <Card className="border border-gray-200 rounded-lg bg-white shadow-xl hover:shadow-2xl transition-shadow duration-200">
      <CardHeader className="bg-gray-50 p-4 rounded-lg">
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
            {addedCompanies && addedCompanies?.map(({Id,LogoUrl, Name,SectorName, Ticker, ClosePrice,PriceDate }) => {
               const previousClosePrice = ClosePrice - Math.random() * 1;
              return (
              <TableRow key={Id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={LogoUrl}
                      unoptimized
                      width={38}
                      height={38}
                      className="w-12 h-12 object-contain"
                      alt={`${Name ?? 'Company'} Logo`}
                    />
                    <Link
                      href={`/dashboard/company/${Id}/summary`}
                      className="font-medium text-gray-800 hover:underline truncate max-w-xs"
                      prefetch={true}
                    >
                      {Name ?? 'Company'}
                    </Link>
                  </div>
                </TableCell>

                {/* Ticker */}
                <TableCell>
                  <span className="text-xs text-gray-600">{Ticker ?? 'N/A'}</span>
                </TableCell>

                {/* Stock Price */}
                <TableCell className="text-right">
                  {(() => {
                    const { className, symbol } = getPriceIndicator(ClosePrice, previousClosePrice);
                    return (
                      <span className={`text-xs ${className} flex items-center justify-end`}>
                        <span className="mr-1">{symbol}</span>
                        {ClosePrice ?? 'N/A'}
                      </span>
                    );
                  })()}
                </TableCell>
                <TableCell>
                {addedCompanies && addedCompanies.includes(Id) ? (
                  <CheckCircle className="text-green-500" />
                ) : loadingCompanies.includes(Id) ? (
                  <Spinner />
                ) : (
                  <CirclePlus onClick={() => handleWatchList(Id)} className="cursor-pointer" />
                )}
              </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  );
};



function getPriceIndicator(currentPrice, previousPrice) {
  if (previousPrice == null) {
    return { className: 'text-gray-500', symbol: '', percentageChange: null };
  }
  const percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  if (currentPrice > previousPrice) {
    return { className: 'text-green-500', symbol: '▲', percentageChange };
  } else if (currentPrice < previousPrice) {
    return { className: 'text-red-500', symbol: '▼', percentageChange };
  } else {
    return { className: 'text-gray-500', symbol: '—', percentageChange: 0 };
  }
}