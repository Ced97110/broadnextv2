'use client'


import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card component
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PriceIndicator from '../company/[Id]/price-indicator';





export const CompanyCard = ({name,data,icon}) => {

  

  return (
    
    <div className="relative overflow-y-auto  w-[658px] h-[500px] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-white">
    {/* En-tête du Card */}
    <header className="flex items-center bg-gray-50 p-4 rounded-t-xl">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-gray-100">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
      </div>
    </header>

    {/* Contenu du Card */}
    <main className="p-4">
      {/* Tableau du Portfolio */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* En-tête du Tableau */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">24h Movement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
            </tr>
          </thead>

          {/* Corps du Tableau */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data.length > 0 ? (
              data.map((company, index) => (
                <tr key={company.Id} className="hover:bg-gray-100 transition-colors duration-200">
                  {/* Index */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>

                  {/* Company */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={company.LogoUrl}
                        width={38}
                        height={38}
                        className="w-10 h-10 object-contain"
                        alt={`${company.Name} Logo`}
                      />
                      <Link prefetch={true} href={`/company/${company.Id}`}
                         className="font-medium text-gray-800 hover:underline truncate max-w-xs">
                          {company.Name}
                          
                      </Link>
                    </div>
                  </td>

                  {/* Ticker */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{company.Ticker || 'N/A'}</td>

                  {/* Stock Price */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                    {company.ClosePrice ? `$${company.ClosePrice.toFixed(2)}` : 'N/A'}
                  </td>

                  {/* 24h Movement */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <PriceIndicator PriceMovement={company.PriceMovement} PriceChange={company.PriceChange} />
                  </td>

                  {/* Market Cap */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {company.MarketCap ? FormatMarketCap(company.MarketCap) : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
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
  
  