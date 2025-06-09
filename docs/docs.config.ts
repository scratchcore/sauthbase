import docsConfigType from "./src/types/docs.config";

const docsConfig: docsConfigType = {
  url: "https://sauthbase.scratchcore.org",
  version: "latest",
  github: {
    name: "scratchcore",
    repo: "sauthbase",
  },
  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    localeConfigs: {
      ja: {
        label: "日本語", // Label for the Japanese locale
        htmlLang: "ja-JP", // HTML language attribute for Japanese
        path: "ja", // Path prefix for Japanese locale
      },
      en: {
        label: "English", // Label for the English locale
        htmlLang: "en-US", // HTML language attribute for English
        path: "en", // Path prefix for English locale
      },
    },
  },
  sitemap: {
    excludedDirs: [],
  },
};

export default docsConfig;
