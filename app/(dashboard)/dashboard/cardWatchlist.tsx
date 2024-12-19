import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card component
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, CirclePlus,CircleMinus} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

export const CompanyCardWatchList = ({watchlist,handleRemoveFromWatchlist,loadingCompanies}) => {

  return (
    <div className="mb-4 w-full rounded-lg">
    <Card className="border border-gray-200 rounded-lg bg-white shadow-xl hover:shadow-2xl transition-shadow duration-200">
      <CardHeader className="bg-gray-50 p-4 rounded-lg">
        <CardTitle className="text-base font-medium">Watchlist</CardTitle>
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
            {watchlist &&  watchlist?.map(({Id,LogoUrl, Name,Ticker, ClosePrice,PriceDate }) => {
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
             
                  <Button className="cursor-pointer" onClick={() => handleRemoveFromWatchlist(Id)}>
                       {loadingCompanies.includes(Id) ?  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : <CircleMinus/> }
                  </Button>
      
         
            
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