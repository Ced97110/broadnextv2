import { FC, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // ShadCN Card component
import Link from 'next/link';
import Image from 'next/image';

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

export const CompanyCard: FC<Props> = ({ company, title, color }) => {


  return (
    <div className="mb-4 w-full">
   
      <Card className="border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="bg-gray-50 p-4">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          {/* Company Logos and Names */}
          <div className="space-y-4">
            {company.map((companyItem: any) => (
              <div key={companyItem?.Id} className="flex items-center space-x-4">
                {/* Company Logo */}
                <div>
                <Image
                    src={companyItem.LogoUrl ?? '/logo.png'}
                    className="w-12 h-12 cursor-pointer rounded-md object-contain transform transition-transform duration-300 hover:scale-105"
                    width={48}
                    height={48}
                    alt={`${companyItem?.Name ?? 'Company'} Logo`}
                  />
                </div>

                {/* Company Name */}
                <Link
                  className="text-sm font-normal text-gray-700 truncate cursor-pointer max-w-xs"
                  href={`company/${companyItem.Id}/summary`}
                >
                  {companyItem?.Name && 
                    companyItem.Name.charAt(0).toUpperCase() + 
                    companyItem.Name.slice(1).toLowerCase()}
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};