const slikeTipova2 = {
  sedan: "assets/icons_tipvozila2/sedan.png",
  karavan: "assets/icons_tipvozila2/karavan.png",
  kabriolet: "assets/icons_tipvozila2/kabriolet.png",
  kombi: "assets/icons_tipvozila2/kombi.png",
  SUV: "assets/icons_tipvozila2/SUV.png",
  coupe: "assets/icons_tipvozila2/coupe.png",
  hatchback: "assets/icons_tipvozila2/hatchback.png",
  default: "assets/icons_tipvozila2/sedan.png",
};

export const getVehicleTypeImage2 = (type) =>
  slikeTipova2[type] || slikeTipova2.default;
