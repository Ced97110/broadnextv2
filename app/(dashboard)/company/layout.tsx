import { param } from "drizzle-orm";
import Providers from "../providers";
import TabMenu from "./[id]/tabmenu";



export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <Providers>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <TabMenu/>
            <div className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
              {children}
            </div>
          </div>
        </div>
      </Providers>
    );
  }