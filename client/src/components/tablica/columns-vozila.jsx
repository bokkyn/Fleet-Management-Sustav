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
  otkazano: "text-red-600  justify-center flex",
  odbijeno: "text-red-600  justify-center flex",
  odobreno: "text-green-600  justify-center flex",
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
          console.error("Nema ID");
        }
      };

      if (status === "na čekanju" && startDate < today) {
        return (
          <span className="text-gray-500  justify-center flex">isteklo</span>
        );
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
