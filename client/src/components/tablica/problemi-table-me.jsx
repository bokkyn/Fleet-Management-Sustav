import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./data-table-problemi";
import columns from "./columns-problemi-me"; 

const ProblemiTablica = () => {
  const [problemi, setProblemi] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/korisnici/moji-problemi",
          {
            withCredentials: true,
          } 
        ); 
        setProblemi(response.data); 
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="font-bold">Problemi</h1>
      <DataTable
        columns={columns} 
        data={problemi}
        pagination
      />
    </div>
  );
};

export default ProblemiTablica;
