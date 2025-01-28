import primevue from "tailwindcss-primeui";
import { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,vue,ts}"],
  theme: {
    extend: {},
  },
  plugins: [primevue],
} satisfies Config;