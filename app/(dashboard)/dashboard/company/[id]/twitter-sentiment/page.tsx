import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Sentiment from './twitter-series';
import PosNeg from './twitter-posneg';
import Entities from './twitter-entities';

export const runtime = 'edge';

const TwitterPage = ({params}: {params: {id: string}}) => {
  
  return (
    <>
      <div className="flex justify-around w-full h-full">
        <div className="flex w-full py-12 px-12">
        <Tabs defaultValue="Financial Health" orientation="vertical" className="w-full flex flex-row space-x-6">
          <TabsList className="flex flex-col items-start space-y-2 mt-10">
            <TabsTrigger value="Financial Health">Sentiment</TabsTrigger>
            <TabsTrigger value="Challenges">Popular Entities</TabsTrigger>
            <TabsTrigger value="Valuation">Entities</TabsTrigger>
          </TabsList>
    
          <div className="w-full">
            <TabsContent value="Financial Health">
              <Sentiment id={params.id} source='1'/>
            </TabsContent>
            <TabsContent value="Challenges">
               <Entities   id={params.id} source='1'/>
            </TabsContent>
            <TabsContent value="Valuation">
              <PosNeg id={params.id} source='1' />
            </TabsContent>
          </div>
        </Tabs>
      </div>
   </div>
   
      </>
  )};


export default TwitterPage;