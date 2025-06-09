import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import docsConfig from "docs.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result: MetadataRoute.Sitemap = [];

  for (const lang of docsConfig.i18n.locales) {
    const langConfig = docsConfig.i18n.localeConfigs[lang];

    const homeUrl = `${docsConfig.url}/${langConfig.path}`;

    result.push({
      url: homeUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: docsConfig.i18n.locales.reduce<{ [key: string]: string }>(
          (acc, l) => {
            const lConfig = docsConfig.i18n.localeConfigs[l];
            acc[lConfig.htmlLang] = `${docsConfig.url}/${lConfig.path}`;
            return acc;
          },
          {}
        ),
      },
    });

    const contentRoot = path.join(process.cwd(), "src/content", lang);
    if (fs.existsSync(contentRoot)) {
      const traverse = (dir: string): string[] => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        return entries.flatMap((entry) => {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) return traverse(fullPath);
          if (entry.isFile() && entry.name.endsWith(".mdx")) return [fullPath];
          return [];
        });
      };

      const mdxFiles = traverse(contentRoot);
      for (const file of mdxFiles) {
        const relative = path.relative(contentRoot, file).replace(/\.mdx$/, "");
        const segments = relative.split(path.sep);

        // If file is named `index`, remove the last segment to get the parent directory path
        if (segments[segments.length - 1] === "index") {
          segments.pop();
        }

        const pagePath = segments.map(encodeURIComponent).join("/");
        const pageUrl = pagePath
          ? `${docsConfig.url}/${langConfig.path}/${pagePath}`
          : `${docsConfig.url}/${langConfig.path}`;

        result.push({
          url: pageUrl,
          lastModified: new Date().toISOString(),
          changeFrequency: "daily",
          priority: 0.7,
          alternates: {
            languages: docsConfig.i18n.locales.reduce<{
              [key: string]: string;
            }>((acc, l) => {
              const lConfig = docsConfig.i18n.localeConfigs[l];
              const altPath = `${docsConfig.url}/${lConfig.path}/${pagePath}`;
              acc[lConfig.htmlLang] = altPath;
              return acc;
            }, {}),
          },
        });
      }
    }
  }

  return result;
}
