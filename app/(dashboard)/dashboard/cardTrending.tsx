'use client'


import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card component
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PriceIndicator from './company/price-indicator';




export const CompanyCard = ({name,trending,watchlist,loadingCompanies,handlewatchlist,handleAddInterested,icon}) => {

  

  return (
    <div className="mb-4 w-full rounded-xl">
    <Card className="border overflow-y-scroll max-w-full max-h-[500px] border-gray-200 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center bg-gray-50 p-4 rounded-xl">
        <div className="flex flex-row items-center space-x-2">
           <div className="text-2xl rounded-full bg-gray-100 p-2">{icon}</div>
          <CardTitle className="text-base font-medium">{name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Portfolio Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>24h Movement</TableHead>
              <TableHead>Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trending && trending.slice(0,5)?.map(({Id,LogoUrl, Name, Ticker, ClosePrice,PriceDate,PriceMovement, PriceChange, MarketCap },index) => {
              return (
              <TableRow key={Id}>
                <TableCell>{index + 1}</TableCell>
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
                 {`$${ClosePrice ? ClosePrice?.toFixed(2) : "N/A"}`}
                </TableCell>
                <TableCell className="text-center">
                 <PriceIndicator PriceMovement={PriceMovement} PriceChange={PriceChange}/>
                </TableCell>
              <TableCell>
                {MarketCap ? FormatMarketCap(MarketCap) : "N/A"}
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



export function FormatMarketCap(marketCap) {
  let suffix = '';
  let scaledValue = marketCap;
  
  if (marketCap >= 1e12) {
    scaledValue = marketCap / 1e12;
    suffix = 'T';
  } else if (marketCap >= 1e9) {
    scaledValue = marketCap / 1e9;
    suffix = 'B';
  } else if (marketCap >= 1e6) {
    scaledValue = marketCap / 1e6;
    suffix = 'M';
  } else if (marketCap >= 1e3) {
    scaledValue = marketCap / 1e3;
    suffix = 'K';
  }
  
  return `$${scaledValue?.toFixed(2)}${suffix}`;
  }
  
  