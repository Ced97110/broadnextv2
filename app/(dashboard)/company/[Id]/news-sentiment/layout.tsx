

import { CompanyFetch} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import Script from "next/script";
import { CompanyRelation } from "@/app/types/types";
import { Providers } from "../provider";
import TabMenu from "../compo/tabmenu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";


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
      { name: 'Sentiment', href: `/company/${params.Id}/news-sentiment/sentiment` },
      { name: 'Entities', href: `/company/${params.Id}/news-sentiment/entities` },
      { name: 'Popular Entities', href: `/company/${params.Id}/news-sentiment/popular-entities` },
     
    ];

    const { user } = session;
   
    return (
      <>
          <div className="flex flex-col md:px-8 w-full h-full">
            {/* Tab Menu Section */}
            <div className="w-full flex justify-center mb-6 p-0">
              <TabMenu tabs={tabsSentiment} className=" text-xs" id={params.Id} />
                {/* When chat is not visible, show the button full width at the right side */}
            </div>
            <div className="w-full h-full">
              {children}
            </div>
          </div>
       
       </>
    )
  }

