import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always", // always show locale in URL for clarity
  // defaultLocale "fr" → redirect "/" to "/fr" automatically
});
