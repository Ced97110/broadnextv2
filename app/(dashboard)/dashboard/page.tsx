
import { CompanyUser } from "@/lib/data";
import UserSelection from "./user-selection";


export async function generateStaticParams() {
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/ListCompanies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.map((item) => ({
    id: String(item.Id)
   }));
   
 }

export default async function HomePage() {

  const results = await CompanyUser() 
  return (
    <main className="w-full p-4 pt-24">
       <div className="flex flex-col w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl">Dashboard</h1>
          </div>
            <UserSelection results={results} /> 
        </div>
      </div>
    </main>
  );
}



