/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["images.unsplash.com", "optimistic-owl-188.convex.cloud"], // Add any other image domains as needed
  },
};

export default config;
