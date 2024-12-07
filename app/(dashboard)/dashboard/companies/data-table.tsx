"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { ArrowRight, ArrowUpDown, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "@/components/ui/select"
import PriceIndicator from "../company/price-indicator"
import { FormatMarketCap } from "../cardTrending"
import ImageLoading from "../company/[id]/Image-loading"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

export interface DataTableProps {
  data: Company[]
}

export function DataTable<TData, TValue>({
  data,
}: DataTableProps) {


  const columns = useMemo<ColumnDef<Company, unknown>[]>(() => [
    {
      accessorKey: "Id",
      header: "#",
      cell: ({ row }) => (
        <>{row.index + 1}</>
      ),
    },
    {
      accessorKey: "LogoUrl",
      header: "",
      cell: ({ row }) => {
        return  <Image
        src={row.getValue("LogoUrl") as string} // Cast to string
        alt="Logo"
        width={50}
        height={50}
        className="object-contain aspect-square"
      />
      },
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
        
        return <>{formattedSector}</>;
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
   
        return <>{formatted}</>
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
    {
      accessorKey: "Id",
      header: "",
      cell: ({ row }) => {
        const id = row.getValue("Id")
        return (
          <Link href={`/dashboard/company/${id}/summary`} scroll={false} >
            <Button variant="ghost">
              <ChevronRight />
            </Button>
          </Link>
        )
      },
    },
  ], [data])
  
  const router = useRouter()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })


  return (
   <div className="mt-16">
    <div>
       <h2 className="text-2xl font-semibold pb-8">Companies</h2>
    </div>
     <div className="flex gap-4 items-center py-4">
       <div className="flex-1">
          <Input
            placeholder="Search by name"
            value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("Name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
       
       
       
       
      </div>
      <Card className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const companyId = row.original.Id
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => router.push(`/dashboard/company/${companyId}/summary`)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
