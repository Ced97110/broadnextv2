


export interface CompanyRelation {
    Id:number
    Logo: string;
    Name: string;
    Description: string;
    website: string;
    Sector: string;
    LogoUrl: string;
    Industry: string;
    EmployeesCount: number;
    Ticker?: string;
    HasTwitter:boolean;
    HasFinancials:boolean;
    Exchange?: string;
    IsWatched?: boolean;
    InPortfolio: boolean;
    Location?: string;
    Type?: string;
    CEO?: string;
    Website?: string;
    Sectors?: {
      Name: string;
    }[];
  
    ClosePrice?: number;
    PriceMovement?: string;
    PriceChange?: number;
}