// next.config.mjs
import "./src/env.js";
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "optimistic-owl-188.convex.cloud",
      // add more if you need
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "pdf-parse",
      "mammoth",
      "xlsx",
      "pdfjs-dist",
      "pptx-content-extractor",
      "pdf.js-extract",
    ],
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

const sentryWebpackPluginOptions = {
  // Sentry Wizard injected options
  org: "akintola",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,

  // ✨ Uncomment if you wanna tunnel browser errors through Next.js:
  // tunnelRoute: "/monitoring",
};

// Wrap your Next.js config with Sentry and export as default ESM
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
