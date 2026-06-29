import type { Config } from "tailwindcss";

/**
 * Tailwind v4 — theme tokens live in app/globals.css (@theme + :root).
 * This file declares content paths for tooling compatibility (build-plan Unit 02).
 */
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
};

export default config;
