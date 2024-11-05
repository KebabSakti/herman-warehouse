const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  darkMode: "class",
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
        onsurface: "#333333",
        container: "#ffffff",
        oncontainer: "#333333",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
