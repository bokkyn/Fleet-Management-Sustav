# Fleet-Management-Sustav



## Datoteke za uvoz
**Važno!** Potrebno je importati bazu u kojoj su spremljeni podaci korisnika, jer radi sigurnosnih razloga, kod ovakvog tipa aplikacije, jedino ima smisla da administrator može dodavati korisnike.
Imate sljedeće exportirane JSON datoteke u folderu **database**:
- `fleetDatabase.Feedback.json`
- `fleetDatabase.Korisnici.json`
- `fleetDatabase.Problemi.json`
- `fleetDatabase.Rezervacije.json`
- `fleetDatabase.Vozila.json`

## Koraci za uvoz podataka u MongoDB

Možete koristiti **MongoDB Compass** za uvoz podataka putem grafičkog sučelja:
   - Otvorite MongoDB Compass i povežite se s vašom bazom podataka.
   - U lijevom izborniku odaberite kolekciju u koju želite uvesti podatke.
   - Kliknite na "Import Data", odaberite vašu JSON datoteku i slijedite upute za uvoz.
     

Ili **Otvorite terminal** i upišite sljedeće naredbe za uvoz svake JSON datoteke u MongoDB:
   - Pokrenite sljedeće za svaku datoteku:

   ```bash
   mongoimport --db fleetDatabase --collection Feedback --file fleetDatabase.Feedback.json --jsonArray
   mongoimport --db fleetDatabase --collection Korisnici --file fleetDatabase.Korisnici.json --jsonArray
   mongoimport --db fleetDatabase --collection Problemi --file fleetDatabase.Problemi.json --jsonArray
   mongoimport --db fleetDatabase --collection Rezervacije --file fleetDatabase.Rezervacije.json --jsonArray
   mongoimport --db fleetDatabase --collection Vozila --file fleetDatabase.Vozila.json --jsonArray
   ```

## Pokretanje aplikacije

Nakon što su podaci uvezeni, slijedite ove korake za pokretanje backend i frontend servera: (s preduvjetom da imate preuzeto sve potrebno za pokretanje reacta)

1. **Idite u backend direktorij** i pokrenite:

   ```bash
   npm run start
   ```

2. **Idite u frontend direktorij** i pokrenite:

   ```bash
   npm run dev
   ```

3. Server bi sada trebao biti pokrenut i **možete se prijaviti s slijedećim podacima:**

   - **Korisničko ime**: admin@admin.hr
   - **Lozinka**: admin
  
**Fleet Management Sustav** je aplikacija namijenjena organizacijama za upravljanje službenim vozilima. Sustav omogućuje administratorima jednostavno upravljanje voznim parkom, dok zaposlenici mogu pregledati dostupnost vozila i podnositi zahtjeve za njihovu rezervaciju.

## 🌟 Ključne značajke

### Za zaposlenike:
- **Rezervacija vozila**: Zaposlenici mogu pregledati dostupnost vozila i slati zahtjeve za njihovu rezervaciju.
- **Prijava šteta**: Jednostavna prijava problema ili šteta na vozilima putem aplikacije.
- **Povijest rezervacija**: Pregled svih prethodnih rezervacija na jednom mjestu.
- **Povratne informacije**: Mogućnost slanja povratnih informacija administratorima, anonimno ili imenovano.

### Za administratore:
- **Upravljanje korisnicima**: Dodavanje i upravljanje zaposlenicima u sustavu.
- **Praćenje vozila**: Upravljanje voznim parkom, slanje vozila na tehnički pregled i pregled njihovog statusa.
- **Kalendar rezervacija**: Detaljan uvid u kalendar za efikasno planiranje.
- **Povijest problema**: Evidencija svih prijavljenih problema ili šteta na vozilima.
- **Prilagodba sustava**: Opcija promjene izgleda aplikacije (standardni i šareni mod).

## 📸 Prikaz sučelja
Slike sučelja aplikacije:


<p align="center">
  <img src="client/public/assets/ui/ui2.png" width="300"/>
  <img src="client/public/assets/ui/ui5.png"  width="300"/>
</p>
<p align="center">

  <img src="client/public/assets/ui/ui3.png"  width="300"/>
    <img src="client/public/assets/ui/ui4.png" width="300"/>

</p>

## 💡 Često postavljana pitanja (FAQ)

1. **Zašto ne mogu samostalno kreirati račun?**  
   Registraciju korisnika obavlja administrator kako bi se osigurala sigurnost i ovlaštenje unutar organizacije.

2. **Kako mogu prijaviti štetu na vozilu?**  
   Koristite opciju "Prijava šteta" u aplikaciji. Administrator će dobiti obavijest i poduzeti potrebne korake.

3. **Može li se prilagoditi izgled aplikacije?**  
   Da, aplikacija nudi dvije teme: standardni crno-bijeli dizajn i šareni mod. Promjenu možete izvršiti u postavkama.
<p align="center">

  <img src="client/public/assets/primjeri/normalno1.png"  width="300"/>
    <img src="client/public/assets/primjeri/normalno2.png" width="300"/>

</p>
<p align="center">

  <img src="client/public/assets/primjeri/veselo1.png"  width="300"/>
    <img src="client/public/assets/primjeri/veselo2.png" width="300"/>

</p>
