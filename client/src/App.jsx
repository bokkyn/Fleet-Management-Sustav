import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles.css";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import DodajVozilo from "./pages/DodajVozilo";
import RezervacijaTablica from "./components/tablica/rezervacije-table";
import CarManager from "./pages/CarManager";
import UserManager from "./pages/UserManager";
import LoginRegistracija from "./pages/LoginRegistracija";
import DodajRezervaciju from "./pages/DodajRezervaciju";
import Kalendar2 from "./pages/Kalendar2";
import TehnickiManager from "./pages/TehnickiManager";
import Statistika from "./pages/Statistika";
import PrijaviProblem from "./pages/PrijaviProblem";
import ProblemiTablica from "./components/tablica/problemi-table";
import FeedbackManager from "./pages/FeedbackManager";
import RegistracijaForma from "./pages/RegistracijaForma";
import ModeIzbornik from "./pages/ModeIzbornik";
import Osobno from "./pages/Osobno";
import OProjektu from "./pages/OProjektu";

const App = () => (
  <Router>
    <div className="flex h-screen">
      <SidebarProvider>
        <div className="fixed h-full w-64">
          <AppSidebar />
        </div>
        <div className="flex-1 ml-64 p-10 overflow-y-auto w-full">
          <Routes>
            <Route path="/rezervacije" element={<RezervacijaTablica />} />
            <Route path="/kalendar" element={<Kalendar2 />} />
            <Route path="/dodaj-rezervaciju" element={<DodajRezervaciju />} />
            <Route path="/statistika" element={<Statistika />} />

            <Route path="/vozni-park" element={<CarManager />} />
            <Route path="/dodaj-vozilo" element={<DodajVozilo />} />
            <Route path="/tehnicki-pregledi" element={<TehnickiManager />} />
            <Route path="/problemi" element={<ProblemiTablica />} />
            <Route path="/prijavi-problem" element={<PrijaviProblem />} />

            <Route path="/user-manager" element={<UserManager />} />
            <Route path="/registracija" element={<RegistracijaForma />} />
            <Route path="/feedback" element={<FeedbackManager />} />

            <Route path="/login" element={<LoginRegistracija />} />
            <Route path="/osobno" element={<Osobno />} />
            <Route path="/o-projektu" element={<OProjektu />} />
            <Route path="/postavke" element={<ModeIzbornik />} />
            <Route path="/" element={<LoginRegistracija />} />
          </Routes>
          <Toaster></Toaster>
        </div>
      </SidebarProvider>
    </div>
  </Router>
);

export default App;
