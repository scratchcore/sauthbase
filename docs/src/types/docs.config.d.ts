type localeConfig = {
  label: string; // Human-readable name of the locale
  htmlLang: string; // HTML language attribute value
  path: string; // URL path prefix for the locale
};

type i18n = {
  defaultLocale: string; // The default language locale
  locales: string[]; // Array of supported locales
  localeConfigs: { [locale: string]: localeConfig }; // Configuration for each locale
};

export default interface docsConfigType {
  url: string;
  version: "latest" | string;
  github: {
    name: string;
    repo: string;
  };
  i18n: i18n;
  sitemap?: {
    // List of directories to exclude from the sitemap
    excludedDirs?: string[];
  };
}
