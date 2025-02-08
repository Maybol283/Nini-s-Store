import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        `./resources/**/*.tsx`,
    ],
    theme: {
        extend: {
            colors: {
                cream: "#FDF5E6",
                beige: "#E6D5B8",
                brown: "#A67A5B",
                pink: "#D4A5A5",
                green: "#799B8B",
                charcoal: "#333333",
                lightGray: "#666666",
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                modak: ["Modak", "cursive"],
            },
            strokeWidth: {
                sm: "1px",
                md: "2px",
                lg: "4px",
            },
        },
    },
    plugins: [
        require("tailwind-scrollbar")({ nocompatible: true }),
        function ({ matchUtilities, theme }) {
            // Dynamic text outline colors
            matchUtilities(
                {
                    "text-outline": (value) => ({
                        "-webkit-text-stroke": `1px ${value}`, // 2px stroke width by default
                    }),
                },
                { values: theme("colors") } // Use Tailwind's color palette
            );

            // Dynamic outline width
            matchUtilities(
                {
                    "outline-width": (value) => ({
                        "-webkit-text-stroke-width": value,
                    }),
                },
                { values: theme("strokeWidth") }
            );
        },
    ],
};
