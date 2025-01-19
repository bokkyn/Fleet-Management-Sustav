import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import LoginForma from "../components/LoginForma";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const LoginRegistracija = () => {
  return (
    <div className="flex flex-col items-center space-y-4 m-10">


    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Prijava</TabsTrigger>
        <TabsTrigger value="password">Registracija</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <LoginForma />
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Registracija?</CardTitle>
            <CardDescription>
              Registrirati korisnika može samo administrator. Obratite se
              administratoru vaše organizacije kako bi vas dodao u bazu, i
              omogućio da lakše nego ikad zatražite poslovna vozila, prijavite
              štetu i još mnogo toga!
            </CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  );
};

export default LoginRegistracija;
