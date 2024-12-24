import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';

export const revalidate = 86400

const Sentiment = dynamic(() => import('../twitter-sentiment/twitter-series'));
const Entities = dynamic(() => import('../twitter-sentiment/twitter-entities'));
const PosNeg = dynamic(() => import('../twitter-sentiment/twitter-posneg'));

const NewsSentimentPage = ({params}: {params: {Id: string}}) => {
  
  return (
    <>
      <div className=" w-full h-full">
        <div className=" w-full py-12 px-12">
        <Tabs defaultValue="Financial Health" orientation="vertical" className="w-full flex flex-row space-x-6">
          <TabsList className="flex flex-row md:flex-col items-start space-y-2 mt-10">
            <TabsTrigger value="Financial Health">Sentiment</TabsTrigger>
            <TabsTrigger value="Challenges">Popular Entities</TabsTrigger>
            <TabsTrigger value="Valuation">Entities</TabsTrigger>
          </TabsList>
    
          <div className="w-full">
          <TabsContent value="Financial Health">
              <Sentiment id={params.Id} source='2'/>
            </TabsContent>
            <TabsContent value="Challenges">
               <Entities   id={params.Id} source='2'/>
            </TabsContent>
            <TabsContent value="Valuation">
              <PosNeg id={params.Id} source='2' />
            </TabsContent>
          </div>
        </Tabs>
      </div>
   </div>
   
      </>
  )};


export default NewsSentimentPage;