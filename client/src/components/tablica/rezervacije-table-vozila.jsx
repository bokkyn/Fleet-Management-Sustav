import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./data-table";
import columns from "./columns-vozila";

const RezervacijaTablica = ({ id_vozila }) => {
  const [rezervacije, setRezervacije] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/rezervacije?id_vozila=${id_vozila}`,
          {
            withCredentials: true,
          }
        );
        setRezervacije(response.data);
      } catch (error) {
        console.error("Greška", error);
      }
    };

    fetchData();
  }, [id_vozila]);

  return (
    <div>
      <DataTable columns={columns} data={rezervacije} pagination />
    </div>
  );
};

export default RezervacijaTablica;
