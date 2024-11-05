const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        primary: "#009ddc",
        onprimary: "#ffffff",
        secondary: "#6ba368",
        onsecondary: "#ffffff",
        tertiary: "#F79824",
        ontertiary: "#ffffff",
        surface: "#f5f5f5",
        onsurface: "#474747",
        container: "#ffffff",
        oncontainer: "#474747",
        darksurface: "#222831",
        ondarksurface: "#F5F5F5",
        darkcontainer: "#31363F",
        ondarkcontainer: "#F5F5F5",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
