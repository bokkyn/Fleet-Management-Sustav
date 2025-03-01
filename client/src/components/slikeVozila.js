const slikeVozila = {
    "Alfa Romeo": "assets/icons_logo/alfa-romeo.svg",
    "Audi": "assets/icons_logo/audi.svg",
    "Aston Martin": "assets/icons_logo/aston-martin.svg",
    "Bentley": "assets/icons_logo/bentley.svg",
    "BMW": "assets/icons_logo/bmw.svg",
    "Bugatti": "assets/icons_logo/bugatti.svg",
    "Chevrolet": "assets/icons_logo/chevrolet.svg",
    "Citroen": "assets/icons_logo/citroen.svg",
    "Dacia": "assets/icons_logo/dacia.svg",
    "Daewoo": "assets/icons_logo/daewoo.svg",
    "Dodge": "assets/icons_logo/dodge.svg",
    "Ferrari": "assets/icons_logo/ferrari.svg",
    "Fiat": "assets/icons_logo/fiat.svg",
    "Ford": "assets/icons_logo/ford.svg",
    "Honda": "assets/icons_logo/honda.svg",
    "Hummer": "assets/icons_logo/hummer.svg",
    "Hyundai": "assets/icons_logo/hyundai.svg",
    "Infiniti": "assets/icons_logo/infiniti.svg",
    "Jaguar": "assets/icons_logo/jaguar.svg",
    "Jeep": "assets/icons_logo/jeep.svg",
    "Kia": "assets/icons_logo/kia.svg",
    "Lamborghini": "assets/icons_logo/lamborghini.svg",
    "Land Rover": "assets/icons_logo/land-rover.svg",
    "Lada": "assets/icons_logo/lada.svg",
    "Lexus": "assets/icons_logo/lexus.svg",
    "Maserati": "assets/icons_logo/maserati.svg",
    "Mazda": "assets/icons_logo/mazda.svg",
    "McLaren": "assets/icons_logo/mclaren.svg",
    "Mercedes": "assets/icons_logo/mercedes-benz.svg",
    "MINI": "assets/icons_logo/mini.svg",
    "Mitsubishi": "assets/icons_logo/mitsubishi.svg",
    "Nissan": "assets/icons_logo/nissan.svg",
    "Opel": "assets/icons_logo/opel.svg",
    "Peugeot": "assets/icons_logo/peugeot.svg",
    "Porsche": "assets/icons_logo/porsche.svg",
    "Renault": "assets/icons_logo/renault.svg",
    "Rolls-Royce": "assets/icons_logo/rolls-royce.svg",
    "Rover": "assets/icons_logo/rover.svg",
    "Saab": "assets/icons_logo/saab.svg",
    "Seat": "assets/icons_logo/seat.svg",
    "Skoda": "assets/icons_logo/skoda.svg",
    "Smart": "assets/icons_logo/smart.svg",
    "Subaru": "assets/icons_logo/subaru.svg",
    "Suzuki": "assets/icons_logo/suzuki.svg",
    "Tesla": "assets/icons_logo/tesla.svg",
    "Toyota": "assets/icons_logo/toyota.svg",
    "Volkswagen": "assets/icons_logo/volkswagen.svg",
    "Volvo": "assets/icons_logo/volvo.svg",
    "Zastava": "assets/icons_logo/zastava.svg",
    "default": "assets/icons_logo/default.svg",
};

export const getVehicleImage = (brand) => slikeVozila[brand] || slikeVozila.default;
