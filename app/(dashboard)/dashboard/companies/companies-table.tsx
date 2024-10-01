'use client'

import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import Image from 'next/image'
import Link from 'next/link'



  export function TableCompanies({data}) {
    return (
      <section className=''>
        <div>
          <h2 className="text-2xl font-semibold pb-12">Companies</h2>
        </div>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Ticker</TableHead>
                <TableHead className="text-right">Last Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map(({ Id, Name, LogoUrl,SectorName }) => (
                <TableRow key={Id}>
                  <TableCell className="font-medium">
                    <Link href={`company/${Id}/summary`}>
                      <Image
                        src={LogoUrl}
                        alt={Name}
                        width={60}
                        height={60}
                        className="object-contain aspect-square"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`company/${Id}/summary`}>
                      {Name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {SectorName}
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              ))}
            </TableBody>
         </Table>
      </section>
    )
  }