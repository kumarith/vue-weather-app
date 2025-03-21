module.exports = {
    content: ["./src/**/*.{vue,js,jsx,ts,tsx}"], // Adjust paths as needed
    theme: {
      extend: {
        colors: {
          "weather-primary": "#00668A",
          "weather-secondary": "#004E71",
        },
      },
      fontFamily: {
        Roboto: ["Roboto, sans-serif"],
      },
      container: {
        padding: "2rem",
        center: true,
      },
      screens: {
        sm: "640px",
        md: "768px",
      },
    },
    plugins: [],
  };