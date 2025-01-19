import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import UzmiIliOstavi from "../UzmiIliOstavi"; 

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd.MM.yyyy, HH:mm");
};


const statusColors = {
  otkazano: "text-red-600", 
  odbijeno: "text-red-600", 
  odobreno: "text-green-600", 
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
      const colorClass = statusColors[status] || "text-gray-700";

      const vrijemePocetka = row.original.vrijeme_pocetka;
      const today = new Date();
      const startDate = new Date(vrijemePocetka);

      
      const idRezervacije = row.original.id_rezervacije || row.original._id;

      const handleOpenDialog = () => {
        if (idRezervacije) {
          setCurrentId(idRezervacije);
          setOpenDialog(true);
        } else {
          console.error("No ID found for the reservation");
        }
      };

      if (status === "na čekanju" && startDate < today) {
        return <span className="text-gray-500">prošlo</span>; 
      }

      if (status === "na čekanju") {
        return (
          <>
            <UzmiIliOstavi
              idRezervacije={idRezervacije}
              openDialog={openDialog}
            />
          </>
        );
      }

      console.log("Row data:", row.original);

      return <span className={colorClass}>{status}</span>;
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
    id: "marka",
    accessorKey: "marka", 
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
    id: "model",
    accessorKey: "model",
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
    id: "vrijemePocetka",
    accessorFn: (row) => formatDate(row.vrijeme_pocetka),
    headerName: "Vrijeme Početka",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Vrijeme Početka
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "vrijemeZavrsetka",
    accessorFn: (row) => formatDate(row.vrijeme_zavrsetka),
    headerName: "Vrijeme Završetka",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Vrijeme Završetka
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
];

export default columns;
