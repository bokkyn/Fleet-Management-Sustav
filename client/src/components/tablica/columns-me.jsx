import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react"; // Pretpostavimo da koristite ovu komponentu
import OtkazivanjeDialog from "../OtkazivanjeDialog"; // Pretpostavimo da koristite ovu komponentu
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd.MM.yyyy, HH:mm");
};

// Boje za status
const statusColors = {
  otkazano: "text-red-600", // Blago crvena nijansa
  odbijeno: "text-red-600", // Blago crvena nijansa
  odobreno: "text-green-600", // Blago zelena nijansa
};

const columns = [
  {
    id: "status",
    accessorKey: "status",
    headerName: "Status", // Ovo koristimo kako bi u dropdownu, lipše prikazali stupce, ne priko id-a
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

      // Use `id_rezervacije` or `_id` as the reservation ID
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
        return <span className="text-gray-500">prošlo</span>; // Display "Prošlo" if it's in the past
      }

      if (
        status === "na čekanju" ||
        (status === "odobreno" && startDate > today)
      ) {
        return (
          <>
            <OtkazivanjeDialog
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
