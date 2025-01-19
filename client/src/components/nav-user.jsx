import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronsUpDown,
  LogOut,
  LogIn,
  Settings,
} from "lucide-react"; //ikonice od lucide
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
import { toast } from "sonner";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  
  const handleLogoutWithDelay = () => {
    setTimeout(() => {
      handleLogout();
      setSessionExpired(true);
    }, 60000); 
  };

  
  const handleLogout = async () => {
    try {
      
      await axios.post(
        "http://localhost:3000/korisnici/odjava",
        { withCredentials: true }
      );

      
      localStorage.removeItem("userInfo");
      Cookies.remove("loggedIn");

      
      setIsLoggedIn(false);
      setUserInfo(null);

      
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Greška prilikom odjave:", error);
    }
  };

  
  useEffect(() => {
    const checkLoginStatus = () => {
      const korisnickiPodaci = localStorage.getItem("userInfo");
      const loggedInCookie = Cookies.get("loggedIn");

      if (korisnickiPodaci && loggedInCookie) {
        const parsedUserInfo = JSON.parse(korisnickiPodaci);
        const tokenExpiration = parsedUserInfo.tokenExpiration;
        const currentTime = Date.now() / 1000; 

        
        if (tokenExpiration && tokenExpiration < currentTime) {
          handleLogoutWithDelay();
        } else {
          setIsLoggedIn(true);
          setUserInfo(parsedUserInfo);
        }
      } else {
        
        handleLogoutWithDelay();
      }
    };

    checkLoginStatus();
  }, []);

  
  useEffect(() => {
    if (sessionExpired) {
      toast("Sesija je istekla, morate se ponovo prijaviti.");
    }
  }, [sessionExpired]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {userInfo ? (
                
                userInfo.uloga === "administrator" ? (
                  <img className="size-6" src={"/assets/admin.svg"} />
                ) : (
                  <img className="size-6" src={"/assets/user.svg"} />
                )
              ) : (
                <img className="size-6" src={"/assets/user.svg"} />
              )}

              <div className="grid flex-1 text-left text-sm leading-tight">
                {userInfo ? (
                  
                  <>
                    <span className="truncate font-semibold">
                      {userInfo.ime} {userInfo.prezime}
                    </span>
                    <span className="truncate text-xs">{userInfo.uloga}</span>
                  </>
                ) : (
                  <>
                    <span className="truncate font-semibold">Prijavi se</span>
                    <span className="truncate text-xs">
                      Za pristup značajkama
                    </span>
                  </>
                  
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Settings></Settings>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {userInfo ? (
                    
                    <>
                      <span className="truncate font-semibold">
                        {userInfo.ime} {userInfo.prezime}
                      </span>
                      <span className="truncate text-xs">{userInfo.email}</span>
                    </>
                  ) : (
                    <>
                      <span className="truncate font-semibold">Prijavi se</span>
                      <span className="truncate text-xs">
                        Za pristup značajkama
                      </span>
                    </>
                    
                  )}
                </div>
              </div>
            </DropdownMenuLabel>



            <DropdownMenuItem
              onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
            >
              {isLoggedIn ? <LogOut /> : <LogIn />}

              {isLoggedIn ? "Odjavi se" : "Prijavi se"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
