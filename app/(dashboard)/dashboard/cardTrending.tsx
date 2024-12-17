'use client'


import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card component
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PriceIndicator from '../company/[Id]/price-indicator';





export const CompanyCard = ({name,data,icon}) => {

  

  return (
    
    <div className="relative w-full max-w-full h-auto md:h-[500px] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-white flex flex-col">
    {/* En-tête du Card */}
    <header className="flex items-center bg-gray-50 p-3 rounded-t-xl">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-10 h-10 text-xl rounded-full bg-gray-100">
          {icon}
        </div>
        <h2 className="text-md font-semibold text-gray-800">{name}</h2>
      </div>
    </header>

    {/* Contenu du Card */}
    <main className="flex-1 p-2 md:p-4 overflow-y-auto">
      {/* Tableau du Portfolio */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 text-sm">
          {/* En-tête du Tableau */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">Company</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">Ticker</th>
              <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">Price</th>
              <th className="px-3 py-2 text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">24h Movement</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">Market Cap</th>
            </tr>
          </thead>

          {/* Corps du Tableau */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data.length > 0 ? (
              data.map((company, index) => (
                <tr key={company.Id} className="hover:bg-gray-100 transition-colors duration-200">
            
                  {/* Company */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={company.LogoUrl}
                        width={30}
                        height={30}
                        className="w-8 h-8 object-contain "
                        alt={`${company.Name} Logo`}
                      />
                      <Link href={`/company/${company.Id}`}
                      prefetch={true}
                         className="font-medium text-gray-800 hover:underline truncate max-w-xs">
                          {company.Name || 'Company'}
                      </Link>
                    </div>
                  </td>

                  {/* Ticker */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">{company.Ticker || 'N/A'}</td>

                  {/* Stock Price */}
                  <td className="px-3 py-2 whitespace-nowrap text-right text-gray-700">
                    {company.ClosePrice ? `$${company.ClosePrice.toFixed(2)}` : 'N/A'}
                  </td>

                  {/* 24h Movement */}
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <PriceIndicator PriceMovement={company.PriceMovement} PriceChange={company.PriceChange} />
                  </td>

                  {/* Market Cap */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                    {company.MarketCap ? FormatMarketCap(company.MarketCap) : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-2 text-center text-sm text-gray-500">
                  No companies available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
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
  
  