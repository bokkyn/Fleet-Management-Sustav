import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ProblemDialog = ({ idProblem, openDialog }) => {
  const [problem, setProblem] = useState(null);

  const alertDialogRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (idProblem) {
        try {
          const problemResponse = await axios.get(
            `http://localhost:3000/problemi?id=${idProblem}`,
            {
              withCredentials: true,
            }
          );
          const fetchedProblem = problemResponse.data[0];
          setProblem(fetchedProblem);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData();
  }, [idProblem]);
  useEffect(() => {
    if (openDialog && alertDialogRef.current) {
      alertDialogRef.current.click();
    }
  }, [openDialog]);

  const handleAccept = async () => {
    try {
      const problemData = Array.isArray(problem) ? problem[0] : problem;

      if (
        problemData.kategorija === "mehanički kvar" ||
        problemData.kategorija === "oštećenje karoserije"
      ) {
        const vehicleId = problemData.id_vozila?._id;
        console.log("Kategorija problema zahtijeva servis.");
        console.log("ID vozila:", vehicleId);

        if (vehicleId) {
          const serviceResponse = await axios.put(
            `http://localhost:3000/vozila/servis/${vehicleId}`,
            {
              withCredentials: true,
            }
          );
          console.log("Odgovor servisa:", serviceResponse.data);
          toast("Vozilo je poslano na servis.");
        } else {
          console.error("ID vozila nije pronađen u problemu.");
          toast("Greška: ID vozila nije pronađen.");
          return;
        }
      } else {
        console.log("Kategorija problema ne zahtijeva servis.");
      }

      console.log("Pokušaj prihvaćanja problema s ID-jem:", idProblem);
      const response = await axios.put(
        `http://localhost:3000/problemi/prihvati/${idProblem}`,
        {
          withCredentials: true,
        }
      );
      console.log("Odgovor na prihvaćanje problema:", response.data);

      if (response.status === 200) {
        toast("Prijava prihvaćena.");
        window.location.reload();
      } else {
        toast("Došlo je do pogreške pri prihvaćanju.");
      }
    } catch (error) {
      toast("Došlo je do pogreške pri prihvaćanju.");
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/problemi/odbij/${idProblem}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      window.location.reload();
      toast("Prijava je odbijena");
    } catch (error) {
      console.error("Error:", error);
      toast("Došlo je do pogreške pri odbijanju.");
    }
  };

  if (!problem) return <div>Učitavanje...</div>;

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger ref={alertDialogRef}>
          <div className=" bg-gray-100 px-4 rounded-[30px] border border-gray-300 py-2 whitespace-nowrap font-semibold">
            na čekanju
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Prihvati ili odbij prijavu problema!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ako prihvatite prijavu, status će postati "u tijeku". a ako
              odbijete, status će postati "odbijeno". Ako se radi o tehničkom
              problemu, najbolje bih bilo da vozilo pošaljete na servis, i u
              "Servis" izborniku promjenite status vozila.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Nazad</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>Odbij</AlertDialogAction>
            <AlertDialogAction onClick={handleAccept}>
              Prihvati
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProblemDialog;
