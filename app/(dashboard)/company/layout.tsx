import { prepareData } from "../data";
import Providers from "../providers";
import TabMenu from "./[id]/tabmenu";



export default async function DashboardLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      id: string
    }
  }) {
  
    return (
      <Providers>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
           <div className="flex justify-center">
           <TabMenu/>
           </div>
            <div className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
              {children}
            </div>
          </div>
        </div>
      </Providers>
    );
  }