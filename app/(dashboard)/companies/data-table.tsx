'use client'

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
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { FormatMarketCap } from "../dashboard/company-card"
import Link from "next/link"
import Loading from "../load"
import { debounce } from 'lodash';
import { TableList } from "@/lib/data"
import { handleRemove, handleWatchListFetch } from "@/lib/handlers"
import Watchlist from "../company/[Id]/compo/watchlist"
import PriceIndicator from "../company/[Id]/price-indicator"




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


export function DataTable({Id,dataCompany}: {dataCompany: Company[], Id: string}) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Company[]>(dataCompany || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCompanies, setLoadingCompanies] = useState<number[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedData = await TableList();
      setData(fetchedData); // Remplacez par fetchedData si vous voulez rafraîchir toutes les données
      console.log(fetchedData);
    } catch (err) {
      setError('Échec de la récupération des données.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetchData = useMemo(() => debounce(fetchData, 500), [fetchData]);


  const handleAddWatchlist = useCallback(
    async (id: number) => {
      setLoadingCompanies((prev) => [...prev, id]);
      try {
        await handleWatchListFetch(id);
        await debouncedFetchData();
      } catch (err) {
        setError("Échec de l'ajout à la watchlist.");
        console.error(err);
      } finally {
        setLoadingCompanies((prev) => prev.filter((cid) => cid !== id));
      }
    },
    [debouncedFetchData]
  );

  const handleRemoveFromWatchlist = useCallback(
    async (id: number) => {
      setLoadingCompanies((prev) => [...prev, id]);
      try {
        const status = await handleRemove(id);
        if (status === 200) {
          await debouncedFetchData();
        }
      } catch (err) {
        setError("Échec de la suppression de la watchlist.");
        console.error(err);
      } finally {
        setLoadingCompanies((prev) => prev.filter((cid) => cid !== id));
      }
    },
    [debouncedFetchData]
  );

  useEffect(() => {
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]);

  useEffect(() => {
    debouncedFetchData();
  }, [debouncedFetchData]);

  
   

  const columns = useMemo<ColumnDef<Company, unknown>[]>(() => [
    {
      accessorKey: "Id",
      header: "",
      cell: ({ row }) => {
        const id = row.original.Id;
        const isWatched = row.original.IsWatched;
        const isLoading = loadingCompanies.includes(id);

        return (
          <Watchlist
            Id={id}
            isWatched={isWatched}
            loading={isLoading}
            handleRemove={handleRemoveFromWatchlist}
            handleAddWatchlist={handleAddWatchlist}
          />
        );
      },
    },
    {
      accessorKey: "LogoUrl",
      header: "",
      cell: ({ row }) => (
        <Image
          src={row.getValue("LogoUrl") as string}
          alt="Logo"
          width={50}
          height={50}
          className="object-contain aspect-square"
        />
      ),
    },
    {
      accessorKey: "Name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.original.Name;
        const id = row.original.Id;

        return (
          <Link className="font-medium" href={`/company/${id}`} scroll={false}>
            {name}
          </Link>
        );
      },
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
        const formattedSector =
          typeof sector === 'string' && sector.length > 0
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("ClosePrice"));
        const formatted = !isNaN(amount) ? `$${amount.toFixed(2)}` : 'N/A';

        return <>{formatted}</>;
      },
    },
    {
      accessorKey: "PriceMovement",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          24h Movement
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const priceChange = row.original.PriceChange;
        const amount = parseFloat(row.getValue("ClosePrice"));
        return !isNaN(amount) ? (
          <PriceIndicator
            PriceMovement={row.getValue("PriceMovement")}
            PriceChange={priceChange}
          />
        ) : (
          'N/A'
        );
      },
    },
    {
      accessorKey: "MarketCap",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          MarketCap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("MarketCap"));
        const formatted = !isNaN(amount) ? FormatMarketCap(amount) : 'N/A';

        return <>{formatted}</>;
      },
    },
    {
      accessorKey: "Id",
      header: "",
      cell: ({ row }) => {
        const id = row.getValue("Id");
        return (
          <Link href={`/company/${id}`} scroll={false}>
            <Button variant="outline">
              <ChevronRight />
            </Button>
          </Link>
        );
      },
    },
  ], [loadingCompanies, handleAddWatchlist, handleRemoveFromWatchlist, debouncedFetchData]);

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




