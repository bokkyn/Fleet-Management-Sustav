const slikeTipova = {
  kabriolet: "assets/icons_tipvozila/cabrio-car.png",
  coupe: "assets/icons_tipvozila/coupe-car.png",
  hatchback: "assets/icons_tipvozila/hatchback-car.png",
  karavan: "assets/icons_tipvozila/karavan-car.png",
  sedan: "assets/icons_tipvozila/sedan-car.png",
  SUV: "assets/icons_tipvozila/suv-car.png",
  kombi: "assets/icons_tipvozila/van-car.png",
  default: "assets/icons_tipvozila/sedan-car.png",
};

export const getVehicleTypeImage = (type) =>
  slikeTipova[type] || slikeTipova.default;
