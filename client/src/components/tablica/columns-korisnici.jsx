import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatDate = (dateString) => {
  const date = new Date(dateString);
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
      const status = getValue();
      const colorClass =
        status === "otkazano" || status === "odbijeno"
          ? "text-red-600"
          : "text-green-600";

      return (
        <span className={`${colorClass} ml-4  flex justify-center`}>
          {status}
        </span>
      );
    },
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
