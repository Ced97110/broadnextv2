


// app/api/prepare-data-sentiment/route.ts

import { NextRequest, NextResponse } from 'next/server';

type PeriodParams = {
  periodType: string;
};

type Config = {
  CompanyId?: string;
  AddNeutralSignal?: string;
  periodParams?: PeriodParams;
  PeriodStartDate?: string;
  PeriodEndDate?: string;
  SignalSource?: string;
  FilterSentiment?: string;
  endpoint?: string;
  token?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { config, path }: { config: Config; path: string } = await request.json();

    if (!config || !path) {
      return NextResponse.json({ error: 'Missing config or path' }, { status: 400 });
    }

    const {
      CompanyId = '',
      AddNeutralSignal = '',
      periodParams = { periodType: '' },
      PeriodStartDate = '',
      PeriodEndDate = '',
      SignalSource = '',
      FilterSentiment = '',
      endpoint = '',
    } = config;

    const queryConfig = {
      CompanyId,
      AddNeutralSignal,
      PeriodType: periodParams.periodType,
      PeriodStartDate: periodParams.periodType === '3' ? PeriodStartDate : '',
      PeriodEndDate: periodParams.periodType === '3' ? PeriodEndDate : '',
      SignalSource,
      endpoint,
      ...(FilterSentiment && { FilterSentiment }),
    };

    // Replace 'http://localhost:8080' with your backend API URL
    const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8080';

    const response = await fetch(`${apiUrl}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      body: JSON.stringify(queryConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching data from backend: ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to fetch data from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}