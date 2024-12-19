'use client'
import React from 'react'
import { useCompany } from '../provider';

export const Information = () => {
    const { companyRelation } = useCompany();

    if (!companyRelation) return <p>Loading...</p>;

    return (
        <>
            <p className='text-pretty text-[14px]'>{companyRelation?.Description ?? 'No description available.'}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 text-[14px]">
                <div>
                    <p className="font-bold">Exchange:</p>
                    <p>{companyRelation?.Exchange ?? ''}</p>
                    <p className="font-bold mt-4">Ticker:</p>
                    <p>{companyRelation?.Ticker ?? ''}</p>
                    <p className="font-bold mt-4">Location:</p>
                    <p>{companyRelation?.Location ?? 'N/A'}</p>
                </div>

                <div>
                    <p className="font-bold">Website:</p>
                    <a
                        href={companyRelation?.Website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {companyRelation?.Website ?? 'N/A'}
                    </a>
                    <p className="font-bold mt-4">Sector:</p>
                    <p>{companyRelation?.Sectors?.[0]?.Name ?? ''}</p>
                    <p className="font-bold mt-4">CIK:</p>
                    <p>{companyRelation?.CIK ?? 'N/A'}</p>
                </div>

                <div>
                    <p className="font-bold">CEO:</p>
                    <p>{companyRelation?.CEO ?? ''}</p>
                    <p className="font-bold mt-4">Employees:</p>
                    <p>{companyRelation?.EmployeesCount ?? '0'}</p>
                </div>
            </div>
        </>
    )
}
