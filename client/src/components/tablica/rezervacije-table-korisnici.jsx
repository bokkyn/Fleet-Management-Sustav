import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./data-table";
import columns from "./columns-korisnici";

const RezervacijaTablica = ({ id_korisnika }) => {
  const [rezervacije, setRezervacije] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/rezervacije?id_korisnika=${id_korisnika}`,
          {
            withCredentials: true,
          }
        );

        const flatData = response.data.map((item) => ({
          ...item,
          marka: item.id_vozila?.marka || "",
          model: item.id_vozila?.model || "",
          registracija: item.id_vozila?.registracija || "",
        }));

        setRezervacije(flatData);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, [id_korisnika]);

  return (
    <div className="flex flex-col items-center space-y-4">


      <DataTable columns={columns} data={rezervacije} pagination />
    </div>
  );
};

export default RezervacijaTablica;
