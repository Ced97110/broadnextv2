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
import { ArrowRight, ArrowUpDown, ChevronDown, ChevronRight, List, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Suspense, useCallback, useEffect, useMemo, useOptimistic, useState } from "react"
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "@/components/ui/select"
import PriceIndicator from "../company/price-indicator"
import { FormatMarketCap } from "../cardTrending"
import ImageLoading from "../company/[id]/Image-loading"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { handleRemove, handleWatchListFetch, TableList } from "@/lib/data"
import Loading from "../../load"
import { debounce } from 'lodash';
import { FaStar } from "react-icons/fa"
import { FaRegStar } from "react-icons/fa"
import StarIconComponent from "./star"
import Watchlist from "../company/[id]/watchlist"
import { toast, useToast } from "@/hooks/use-toast"
import { getAccessToken } from "@auth0/nextjs-auth0/edge"


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
  IsActive: boolean
  IsWatched: boolean
  Type: string
}


export function DataTable({dataCompany}: {dataCompany: Company[]}) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [loadingCompanies, setLoadingCompanies] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Company[]>(dataCompany || []);
   
  const { toast } = useToast()


  const tableLists = async () => {
    const {accessToken} = await getAccessToken();
    const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/ListCompanies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    
  });
  const data = await response.json();
  return data;
  }

const fetchData = useCallback(async () => {
  try {
    const data = await tableLists();
    setData(data);
    console.log(data)
  } catch (err) {
    setError('Échec de la récupération des données.');
    console.error(err);
  }
}, []);

const debouncedFetchData = useMemo(() => debounce(fetchData, 500), [fetchData]);


const handlewatchlist = useCallback(async (Id: number) => {
  setLoading(true)
  setLoadingCompanies((prev) => [...prev, Id]);
 
  try {
    await handleWatchListFetch(Id);
    debouncedFetchData();
  } catch (err) {
    setError('Échec de l\'ajout à la watchlist.');
    console.error(err);
  } finally {
    setLoadingCompanies((prev) => prev.filter((id) => id !== Id));
    setLoading(false)
  }
}, [fetchData, debouncedFetchData]);

const handleRemoveFromWatchlist = useCallback(async (Id: number) => {
  setLoading(true)
  setLoadingCompanies((prev) => [...prev, Id]);
 
  try {
    const status = await handleRemove(Id);
    if (status === 200) {
      debouncedFetchData();
    }
  } catch (err) {
    setError('Échec de la suppression de la watchlist.');
    console.error(err);
  } finally {
    setLoadingCompanies((prev) => prev.filter((id) => id !== Id));
    setLoading(false)
  }
}, [fetchData]);


useEffect(() => {
  return () => {
    debouncedFetchData.cancel();
  };
}, [debouncedFetchData]);

// Synchronize data when dataCompany changes
useEffect(() => {
  setData(dataCompany || []);
}, [dataCompany]);



const columns = useMemo<ColumnDef<Company, unknown>[]>(() => [
  {
    accessorKey: "Id",
    header: "",
    cell: ({ row }) => {
      const id = row.original.Id;
      const isWatched = row.original.IsWatched;
      const isLoading = loadingCompanies.includes(id);
    
      return (
        <>
        
              <Watchlist
                isWatched={isWatched}
                handleRemove={handleRemoveFromWatchlist}
                handleAddWatchlist={handlewatchlist}
                loading={loading}
                isLoading={isLoading}
                Id={id}
               
            />
        </>
      );
    },
  },
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
], [])


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
        <div>
      

        </div>
       
       
       
       
      </div>
      {data.length === 0 ? <Loading /> : 
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
      }
     
     
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




