export default {
  expo: {
    name: "TerraViva",
    slug: "terraviva",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    icon: "./assets/images/terraviva.png",
    splash: {
      image: "./assets/images/terraviva.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/terraviva.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/images/terraviva.png",
    },
  },
};
