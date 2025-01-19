import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  if (isNaN(date)) {
    return "-"; 
  }
  return format(date, "dd.MM.yyyy, HH:mm");
};



const columns = [
  {
    id: "status",
    accessorKey: "status",
    headerName: "Status", 
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, getValue }) => {
      const [openDialog, setOpenDialog] = useState(false);
      const [currentId, setCurrentId] = useState(null);
      const status = getValue();

      const idProblem = row.original._id;
      console.log(idProblem);

      return <span className="flex ml-4"  >{status}</span>;
    },
  },
  {
    id: "imeIPrezime",
    accessorFn: (row) =>
      `${row.id_korisnika?.ime} ${row.id_korisnika?.prezime}`,
    headerName: "Ime i Prezime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ime i Prezime
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "email",
    accessorFn: (row) => row.id_korisnika?.email,
    headerName: "Email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "markaVozila",
    accessorFn: (row) => row.id_vozila?.marka,
    headerName: "Marka Vozila",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Marka Vozila
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "modelVozila",
    accessorFn: (row) => row.id_vozila?.model,
    headerName: "Model Vozila",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Model Vozila
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "registracijaVozila",
    accessorFn: (row) => row.id_vozila?.registracija,
    headerName: "Registracija Vozila",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Registracija Vozila
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "datumPrijave",
    accessorFn: (row) => formatDate(row.datum_prijave),
    headerName: "Datum Prijave",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Datum Prijave
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "kategorija",
    accessorKey: "kategorija",
    headerName: "Kategorija",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Kategorija
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
];

export default columns;
