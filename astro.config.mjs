import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://solingo.com.tr",
  trailingSlash: "ignore",
  compressHTML: true,
  build: {
    format: "directory",
    // CSS satır içine alınır; ilk boyamayı engelleyen ek istek olmaz
    inlineStylesheets: "always"
  }
});
