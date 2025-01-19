import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "./data-table"; 
import columns from "./columns-me"; 

const RezervacijaTablica = () => {
  const [rezervacije, setRezervacije] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/korisnici/moje-rezervacije", {
          withCredentials: true, 
        });
        setRezervacije(response.data); 
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData(); 
  }, []);

  return (
    <div>

      <DataTable
        columns={columns} 
        data={rezervacije} 
        pagination
      />
    </div>
  );
};

export default RezervacijaTablica;
