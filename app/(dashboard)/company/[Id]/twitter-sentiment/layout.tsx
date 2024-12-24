
import { CompanyFetch} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import Script from "next/script";
import { CompanyRelation } from "@/app/types/types";
import { Providers } from "../provider";
import TabMenu from "../compo/tabmenu";
import { Card } from "@/components/ui/card";
import TwitterPage from "./test";



export default async function SentimentLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      Id: string
    }
  }) {


    const session = await getSession();
    if (!session || !session.user) {
      redirect('/api/auth/me');
    }

    const tabsSentiment = [
      { name: 'Sentiment', href: `/company/${params.Id}/twitter-sentiment/sentiment` },
      { name: 'Entities', href: `/company/${params.Id}/twitter-sentiment/entities` },
      { name: 'Popular Entities', href: `/company/${params.Id}/twitter-sentiment/popular-entities` },
     
    ];

    const { user } = session;
   
    return (
      <>
          <div className="flex flex-col md:px-8 w-full h-full">
            {/* Tab Menu Section */}
            <div className="w-full flex justify-center">
              <TabMenu tabs={tabsSentiment} className="bg-blue-300 rounded-full" id={params.Id} />
            </div>
            <div className="w-full h-full">
              {children}
            </div>
          </div>
       
       </>
    )
  }

