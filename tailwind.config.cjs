/** @type {import(tailwindcss).Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		screens: {
			sm: "640px",
			// => @media (min-width: 640px) { ... }

			md: "768px",
			// => @media (min-width: 768px) { ... }

			md2: "896px",
			// => @media (min-width: 896px) { ... }

			lg: "1024px",
			// => @media (min-width: 1024px) { ... }

			xl: "1280px",
			// => @media (min-width: 1280px) { ... }
			"1.5xl": "1348px",

			"2xl": "1536px",
			// => @media (min-width: 1536px) { ... }
		},
		extend: {
			colors: {
				primary: "#9865FF",
				mute: "#6E6FA6",
				light: "#EEEEFE",
				red: "#F85C67",
				green: "#02D0C8",
				gold: "#F3C062",
			},
		},
	},

	plugins: [
		require("tailwind-scrollbar-hide"),
		// ...
	],
};
