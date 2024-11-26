'use client'


import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card component
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';





export const CompanyCardTrending = ({trending,watchlist,loadingCompanies,handlewatchlist,handleAddInterested}) => {

  const renderPriceIndicator = (PriceMovement, ClosePrice) => {
    const { className, symbol } = getPriceIndicator(PriceMovement);
    return (
      <span className={`text-xs ${className} flex items-center justify-end`}>
        <span className="mr-1">{symbol}</span>
        {ClosePrice ?? 'N/A'}
      </span>
    );
  };

  return (
    <div className="mb-4 w-full rounded-lg">
    <Card className="border overflow-y-scroll max-w-[658px] max-h-[500px] border-gray-200 rounded-lg bg-white shadow-xl hover:shadow-2xl transition-shadow duration-200">
      <CardHeader className="bg-gray-50 p-4 rounded-lg">
        <CardTitle className="text-base font-medium">Trending</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        {/* Portfolio Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>24h Movement</TableHead>
              <TableHead>Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trending && trending.slice(0,5)?.map(({Id,LogoUrl, Name, Ticker, ClosePrice,PriceDate,PriceMovement }) => {
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
                      onClick={() => handleAddInterested(Id)}
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
                 {renderPriceIndicator(PriceMovement, ClosePrice)}
                </TableCell>
                <TableCell>
                {watchlist && watchlist.some(company => company.Id === Id) ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                    <Button onClick={() => handlewatchlist(Id)} className="cursor-pointer">
                       {loadingCompanies.includes(Id) ?  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : <CirclePlus/> }
                    </Button>
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


export function getPriceIndicator(PriceMovement) {
    switch (PriceMovement) {
        case 0:
            return { className: 'text-green-500', symbol: '▲' };
        case 1:
            return { className: 'text-red-500', symbol: '▼' };
        case 2:
            return { className: 'text-gray-500', symbol: '—' };
        default:
            return { className: 'text-gray-500', symbol: '—' }; // Default case
    }
}