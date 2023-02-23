/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        home: "0 35px 60px -15px rgba(0, 0, 0, 0.7)",
      },
      keyframes: {
        bg: {
          "0%": {
            opacity: "0%",
            transform: "translateY(-100px)",
          },
          "100%": {
            opacity: "100%",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "bg-anim": "bg 0.3s linear",
      },
    },
  },
  plugins: [],
};
