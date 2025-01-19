"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); 
  const [columnVisibility, setColumnVisibility] = useState({
    email: false, 
    registracijaVozila: false, 
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      includesString: (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId) || "";
        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
  });

  
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setColumnFilters([
      ...columnFilters.filter((filter) => filter.id !== "status"), 
      status ? { id: "status", value: status } : {} 
    ]);
  };

  return (
    <div className="px-10">
  
      <div className="flex items-center py-4">
        <Input
          placeholder="Pretraži sve..."
          value={globalFilter || ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />


        <div className="flex mr-3 ml-3 h-9 px-5 w-full rounded-md border border-input bg-transparent py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
      <RadioGroup value={statusFilter} onValueChange={handleStatusChange}>
        <div className="flex items-center space-x-4 w-full">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="option-all" />
            <Label htmlFor="option-all">Sve</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Odbijeno" id="option-rejected" />
            <Label htmlFor="option-rejected">Odbijeno</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Otkazano" id="option-canceled" />
            <Label htmlFor="option-canceled">Otkazano</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Odobreno" id="option-approved" />
            <Label htmlFor="option-approved">Odobreno</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Na čekanju" id="option-waiting" />
            <Label htmlFor="option-waiting">Na čekanju</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
   
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Prikaži
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide()) 
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >

                  {column.columnDef.headerName || column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nema rezultata.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prijašnja
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Slijedeća
        </Button>
      </div>
    </div>
  );
}

export default DataTable;
