module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 30px 50px rgba(0, 0, 0, 0.8)", // Your custom shadow
      },
      fontFamily: {
        primaryRegular: ["kurdish"], // Ensure fallback fonts like sans-serif
      },
    },
  },
  plugins: [],
};
