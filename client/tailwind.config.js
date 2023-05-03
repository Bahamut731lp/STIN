/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            "sans": ['Cabin', "sans-serif"],
            "serif": ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
            "mono": ["Quantico", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"]
        },
        extend: {},
    },
    plugins: [],
}

