'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"




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


  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Company[]>(dataCompany || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCompanies, setLoadingCompanies] = useState<number[]>([]);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  const sectors = useMemo(() => {
    const uniqueSectors = new Set(data.map(company => company.Sector))
    return Array.from(uniqueSectors).sort()
  }, [data])

  const companyTypes = useMemo(() => {
    const uniqueTypes = new Set(data.map(company => company.Type))
    return Array.from(uniqueTypes).sort()
  }, [data])

  const locations = useMemo(() => {
    const uniqueLocations = new Set(data.map(company => company.Location))
    return Array.from(uniqueLocations).sort()
  }, [data])

   
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.original.Name;
        const id = row.original.Id;

        return (
          <Link className="font-medium" href={`/company/${id}`} scroll={false}>
            {name}
          </Link>
        );
      },
    },
    {
      accessorKey: "Ticker",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ticker
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "Sector",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
        
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  Sector
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {sectors.map((sector) => (
                  <DropdownMenuCheckboxItem
                    key={sector}
                    checked={(column.getFilterValue() as string[] | undefined)?.includes(sector)}
                    onCheckedChange={(checked) => {
                      const filterValue = column.getFilterValue() as string[] ?? []
                      if (checked) {
                        column.setFilterValue([...filterValue, sector])
                      } else {
                        column.setFilterValue(
                          filterValue.filter((value) => value !== sector)
                        )
                      }
                    }}
                  >
                    {sector}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => {
        const sector = row.getValue("Sector");
        const formattedSector =
          typeof sector === 'string' && sector.length > 0
            ? sector.charAt(0).toUpperCase() + sector.slice(1).toLowerCase()
            : 'N/A';

        return <>{formattedSector}</>;
      },
      filterFn: (row, id, filterValue: string[]) => {
        if (!filterValue.length) return true
        const sector = row.getValue(id)
        return filterValue.includes(sector as string)
      },
    },
    {
      accessorKey: "Location",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                    Location
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {locations.map((location) => (
                  <DropdownMenuCheckboxItem
                    key={location}
                    checked={(column.getFilterValue() as string[] | undefined)?.includes(location)}
                    onCheckedChange={(checked) => {
                      const filterValue = column.getFilterValue() as string[] | undefined
                      if (checked) {
                        column.setFilterValue([...(filterValue || []), location])
                      } else {
                        column.setFilterValue(
                          filterValue?.filter((value) => value !== location) || []
                        )
                      }
                    }}
                  >
                    {location}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      filterFn: (row, id, filterValue: string[]) => {
        if (!filterValue.length) return true
        const location = row.getValue(id)
        return filterValue.includes(location as string)
      },
    },
    {
      accessorKey: "Type",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                Company Type
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {companyTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={(column.getFilterValue() as string[] | undefined)?.includes(type)}
                    onCheckedChange={(checked) => {
                      const filterValue = column.getFilterValue() as string[] | undefined
                      if (checked) {
                        column.setFilterValue([...(filterValue || []), type])
                      } else {
                        column.setFilterValue(
                          filterValue?.filter((value) => value !== type) || []
                        )
                      }
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      filterFn: (row, id, filterValue: string[]) => {
        if (!filterValue.length) return true
        const type = row.getValue(id)
        return filterValue.includes(type as string)
      },
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

        return <div className="text-right">{formatted}</div>;
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
          Market Cap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("MarketCap"));
        const formatted = !isNaN(amount) ? FormatMarketCap(amount) : 'N/A';

        return <div className="text-right">{formatted}</div>;
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        );
      },
    },
  ], [loadingCompanies, handleAddWatchlist, handleRemoveFromWatchlist]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      columnFilters,
      sorting,
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




