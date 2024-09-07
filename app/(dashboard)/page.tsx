import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { prepareData, prepareDataSentiment } from './data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CompanyCard } from './card';




export default async function ProductsPage() {

  const companiesData = await prepareData(`https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/List`)
  
  return (
    <section className='flex flex-col items-center pt-16'>
        <div className='flex flex-col md:flex-row w-full justify-evenly items-center'>
          <div className='w-full md:w-1/3 p-4'>
          <CompanyCard  title="My Portfolio"
            titleCard="My Portfolio"
            color="#fff"
            company={companiesData && companiesData.filter((item) => ['Tesla', 'Rivian Automotive', 'Gogoro', 'Lordstown', 'Livewire', 'Xos'].includes(item.Name))} 
         />
          </div>
          <div className='w-full md:w-1/3 p-4'>
          <CompanyCard  title="My Portfolio"
            titleCard="My Portfolio"
            color="#fff"
            company={companiesData && companiesData.filter((item) => ['Proterra', 'MULLEN AUTOMOTIVE', 'Lordstown Motors', 'Livewire', 'Arrival'].includes(item.Name))} 
         />
          </div>
          <div className='w-full md:w-1/3 p-4'>
          <CompanyCard  title="My Portfolio"
            titleCard="My Portfolio"
            color="#fff"
            company={companiesData && companiesData.filter((item) => ['Volvo', 'Canoo', 'Aptera Motors', 'Lucid Motors', 'Livewire'].includes(item.Name))} 
         />
          </div>
      </div>
    </section>

  );
}
