import { create } from "zustand";



export type Sector = {
    Id: number;
    Name: string;
}

export type DataCompany = {
    CEO: string;
    CIK: string;
    Exchange: string;
    HasFinancials: boolean;
    HasTwitter: boolean;
    Ticker: string;
    Sectors: Sector[]; 
    Website: string;
    Description: string;
    Logo: string;
    Name: string;
    EmployeesCount: number;
    Location: string;

}

export type FinancialResult = {
    Label: string;
    Results: string[]; // Assuming the results are always strings, even for numbers
    ChartType: number;
};

export type FinancialData = {
    Results: FinancialResult[];
};


type State = {
    company: DataCompany;
    financials: FinancialData;
}

const initialState: State = {
    company: {
        CEO: "",
        CIK: "",
        Exchange: "",
        HasFinancials: false,
        HasTwitter: false,
        Ticker: "",
        Sectors: [],
        Website: "",
        Description: "",
        Logo: "",
        Name: "",
        EmployeesCount: 0,
        Location: ""
    },
    financials: {
        Results: []
    }
}

type Action = {
    setCompany: (company: DataCompany) => void;
    setFinancials: (financials: FinancialData) => void;
}

export const useCompanyStore = create<State & Action>((set) => ({
    ...initialState,
    setCompany: (data: DataCompany) => set({company: data}),
    setFinancials: (data: FinancialData) => set({financials: data})
}))