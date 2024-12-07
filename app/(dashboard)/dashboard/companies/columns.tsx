"use client"

import { Column, ColumnDef, ColumnMeta } from "@tanstack/react-table"
import { FormatMarketCap } from "../cardTrending"
import PriceIndicator from "../company/price-indicator"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Company = {
  Id: number
  Name: string
  LogoUrl: string
  Ticker: string
  Sector: string
  Location: string
  CompanyType: string
  MarketCap: number
  PriceMovement: number
  PriceChange: number
  ClosePrice: number
  PriceDate: string
  Type: string
}

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "Id",
    header: "#",
  },
  {
    accessorKey: "LogoUrl",
    header: "",
    cell: ({ row }) => (
      <Image src={row.getValue("LogoUrl")} alt={`${row.getValue("Name")} Logo`} className="w-8 h-8" />
    ),
  },
  {
    accessorKey: "Name",
    header: "Name",
    sortingFn: 'alphanumeric', 
  },
  {
    accessorKey: "Ticker",
    header: "Ticker",
  },
  {
    accessorKey: "Sector",
    header: "Sector",
    meta: {
      filterVariant: 'select',
    },
    cell: ({ row }) => {
      const sector = row.getValue("Sector");
      const formattedSector = typeof sector === 'string' && sector.length > 0
        ? sector.charAt(0).toUpperCase() + sector.slice(1).toLowerCase()
        : 'N/A';
      
      return <div>{formattedSector}</div>;
    },
  },
  {
    accessorKey: "Location",
    header: "Location",
  },
  {
    accessorKey: "Type",
    header: "CompanyType",
  },
  {
    accessorKey: "ClosePrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("ClosePrice"))
      const formatted = amount ? `$${amount.toFixed(2)}` : 'N/A'
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "PriceMovement",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          24h Movement
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // Access PriceChange from the original data, not from columns
      const priceChange = row.original.PriceChange
      const amount = parseFloat(row.getValue("ClosePrice"))
      return amount 
        ? <PriceIndicator PriceMovement={row.getValue("PriceMovement")} PriceChange={priceChange}/>
        : 'N/A'
    },
  },
  {
    accessorKey: "MarketCap",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          MarketCap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("MarketCap"))
      const formatted = amount ? FormatMarketCap(amount) : 'N/A'
 
      return <>{formatted}</>
    },
  },
]


