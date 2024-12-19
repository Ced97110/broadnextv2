


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
    CIK: string;
    Website?: string;
    Sectors?: {
      Name: string;
    }[];
  
    ClosePrice?: number;
    PriceMovement?: string;
    PriceChange?: number;
}


interface Sector {
  Id: number;
  Name: string;
}

export interface Company {
  Id: number;
  Name: string;
  LogoUrl: string;
  Ticker: string;
  ClosePrice: number;
  PriceDate: string;
  PriceMovement: number;
  PriceChange: number;
  MarketCap: number;
  Type: string;
  Location: string;
  IsActive: boolean;
  IsWatched: boolean;
  InPortfolio: boolean;
  CEO: string;
  Sectors: Sector[];
  CIK: string;
  Exchange: string;
  HasTwitter: boolean;
  HasFinancials: boolean;
  Description: string;
  Website: string;
  EmployeesCount: number;
  
}