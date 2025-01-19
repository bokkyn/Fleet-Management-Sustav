import * as React from "react";
import { Car, User, Settings2, Book } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  //ode bi mozda mogli stavit neki naziv aplikacije il nsto
} from "@/components/ui/sidebar";


const data = {
  user: {
    name: "PRIJAVI SE",
    email: "Za pristup značajkama",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Rezervacije i Statistika",
      url: "/rezervacije",
      icon: Book,
      isActive: true,
      items: [
        {
          title: "Rezervacije",
          url: "/rezervacije",
        },
        {
          title: "Kalendar",
          url: "/kalendar",
        },
        {
          title: "Dodaj Rezervaciju",
          url: "/dodaj-rezervaciju",
        },
        {
          title: "Statistika",
          url: "/statistika",
        },
      ],
    },
    {
      title: "Vozni Park i Štete",
      url: "/vozni-park",
      icon: Car,
      isActive: true,
      items: [
        {
          title: "Vozni Park",
          url: "/vozni-park",
        },
        {
          title: "Dodavanje vozila",
          url: "/dodaj-vozilo",
        },
        {
          title: "Tehnički pregledi",
          url: "/tehnicki-pregledi",
        },
        {
          title: "Prijavljeni problemi",
          url: "/problemi",
        },
        {
          title: "Prijavi problem",
          url: "/prijavi-problem",
        },
      ],
    },
    {
      title: "Zaposlenici i Osobno",
      url: "/user-manager",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Popis zaposlenika",
          url: "/user-manager",
        },
        {
          title: "Registracija zaposlenika",
          url: "/registracija",
        },

        {
          title: "Feedback",
          url: "/feedback",
        },
        {
          title: "Osobno",
          url: "/osobno",
        },
      ],
    },
    {
      title: "Postavke i Općenito",
      url: "/postavke",
      icon: Settings2,
      items: [
        {
          title: "Postavke",
          url: "/postavke",
        },
        {
          title: "O Projektu",
          url: "/o-projektu",
        },
      ],
    },
  ],
};

const dataKorisnik = {
  user: {
    name: "PRIJAVI SE",
    email: "Za pristup značajkama",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Rezervacije",
      url: "/dodaj-rezervaciju",
      icon: Book,
      isActive: true,
      items: [
        {
          title: "Dodaj Rezervaciju",
          url: "/dodaj-rezervaciju",
        },
      ],
    },
    {
      title: "Vozni Park i Štete",
      url: "/prijavi-problem",
      icon: Car,
      isActive: true,
      items: [
        {
          title: "Prijavi problem",
          url: "/prijavi-problem",
        },
      ],
    },
    {
      title: "Zaposlenici i Osobno",
      url: "/user-manager",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Feedback",
          url: "/feedback",
        },
        {
          title: "Osobno",
          url: "/osobno",
        },
      ],
    },
    {
      title: "Postavke i Općenito",
      url: "/postavke",
      icon: Settings2,
      items: [
        {
          title: "Postavke",
          url: "/postavke",
        },
        {
          title: "O Projektu",
          url: "/o-projektu",
        },
      ],
    },
  ],
};

const dataNeprijavljen = {
  user: {
    name: "PRIJAVI SE",
    email: "Za pristup značajkama",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Postavke i Općenito",
      url: "/postavke",
      icon: Settings2,
      items: [
        {
          title: "O Projektu",
          url: "/o-projektu",
        },
      ],
    },
  ],
};
export function AppSidebar({ ...props }) {
  // Dohvat userInfo iz localStoragea
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  
  let sidebarData;

  if (userInfo && userInfo.uloga === "korisnik") {
    sidebarData = dataKorisnik;
  } else if (userInfo && userInfo.uloga === "administrator") {
    sidebarData = data;
  } else {
    sidebarData = dataNeprijavljen;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
