import nextra from "nextra";

// Set up Nextra with its configuration
const withNextra = nextra({
  // ... Add Nextra-specific options here
  defaultShowCopyCode: true,
  readingTime: true,
  contentDirBasePath: "/",
});

// Export the final Next.js config with Nextra included
export default withNextra({
  i18n: {
    locales: ["ja", "en"],
    defaultLocale: "ja",
  },
});
