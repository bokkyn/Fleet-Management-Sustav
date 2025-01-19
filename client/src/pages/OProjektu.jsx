import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const OProjektu = () => {

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center space-y-4 m-10">
          <Tabs defaultValue="korisnik" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="korisnik">Korisnik</TabsTrigger>
              <TabsTrigger value="administrator">Administrator</TabsTrigger>
            </TabsList>
            <TabsContent value="korisnik">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Želite rezervirati službeno vozilo i pojednostaviti svoje
                    poslovne obaveze?
                  </CardTitle>
                  <CardDescription>
                    Registracija korisnika moguća je isključivo preko
                    administratora vaše organizacije. Obratite mu se kako bi vas
                    dodao u bazu korisnika i omogućio vam pristup jednostavnom
                    sustavu za upravljanje službenim vozilima. Nakon
                    registracije, moći ćete brzo i lako zatražiti službena
                    vozila za svoje potrebe, prijaviti eventualne štete,
                    pregledati povijest svojih rezervacija i ostaviti povratne
                    informacije. Naš sustav osmišljen je kako bi vam uštedio
                    vrijeme i olakšao poslovanje, čineći proces upravljanja
                    vozilima efikasnijim nego ikad prije!
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="administrator">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Dosad vam je bilo teško upravljati rezervacijama službenog
                    vozila?
                  </CardTitle>
                  <CardDescription>
                    Kao administrator, imate potpunu kontrolu nad sustavom za
                    upravljanje službenim vozilima. Možete dodavati nove
                    korisnike u bazu, odobravati i pregledavati rezervacije,
                    upravljati voznim parkom, slati vozila na servis i pratiti
                    njihove statuse. Također, sustav vam omogućuje detaljan uvid
                    u kalendar korištenja vozila, pregled prijavljenih problema
                    te povijest najmova za svaki automobil. Digitalizirajte
                    svoje poslovanje i uživajte u preglednom i učinkovitom
                    sustavu koji štedi vrijeme i povećava transparentnost u
                    vašoj organizaciji!
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col items-center space-y-4 m-10 w-[350px]">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
           
          >
            <CarouselContent>
              <CarouselItem>
                <img src="assets/ui/ui1.png" className="w-[350px]"></img>
              </CarouselItem>
              <CarouselItem>
                {" "}
                <img src="assets/ui/ui2.png" className="w-[350px]"></img>
              </CarouselItem>
              <CarouselItem>
                {" "}
                <img src="assets/ui/ui3.png" className="w-[350px]"></img>
              </CarouselItem>
              <CarouselItem>
                {" "}
                <img
                  src="assets/ui/ui4.png"
                  className="w-[350px] flex align-middle"
                ></img>
              </CarouselItem>
              <CarouselItem>
                {" "}
                <img src="assets/ui/ui5.png" className="w-[350px]"></img>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Zašto ne mogu samostalno registrirati račun?
            </AccordionTrigger>
            <AccordionContent>
              Registraciju korisnika obavlja isključivo administrator kako bi se
              osiguralo da sustav koristi samo ovlašteno osoblje organizacije.
              Obratite se administratoru za dodavanje u bazu. Prijaviti se
              možete u sučelju dole lijevo.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Kako mogu rezervirati službeno vozilo?
            </AccordionTrigger>
            <AccordionContent>
              Nakon registracije i prijave u aplikaciju, možete pregledati
              dostupne termine u tablici "Rezervacije" ili putem kalendara,
              odabrati željeno vozilo i poslati zahtjev za rezervaciju.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Što učiniti ako primijetim štetu na vozilu?
            </AccordionTrigger>
            <AccordionContent>
              Jednostavno prijavite problem putem opcije za prijavu štete.
              Administrator će odmah dobiti obavijest i poduzeti potrebne
              korake.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Može li se promijeniti izgled aplikacije?
            </AccordionTrigger>
            <AccordionContent>
              Da, možete birati između dva različita izgleda aplikacije:
              standardnog crno-bijelog dizajna ili veselijeg šarenog moda. Izbor
              možete napraviti u izborniku "Postavke".
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              Kako mogu ostaviti povratnu informaciju?
            </AccordionTrigger>
            <AccordionContent>
              Korisnici imaju opciju slanja povratne informacije koja može biti
              potpuno anonimna. Ovo omogućuje otvorenu i sigurnu komunikaciju s
              administratorima.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              Kako optimizirati dostupnost voznog parka?
            </AccordionTrigger>
            <AccordionContent>
              Praćenjem kalendara i povijesti rezervacija administrator može
              prilagoditi raspored korištenja vozila kako bi svi resursi bili
              ravnomjerno iskorišteni.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>
              Što učiniti ako aplikacija ne radi ispravno?
            </AccordionTrigger>
            <AccordionContent>
              Prije nego što kontaktirate podršku, pokušajte se odjaviti i
              ponovno prijaviti u sustav. Ako problem i dalje postoji, obratite
              se administratoru ili tehničkoj podršci za pomoć.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default OProjektu;
