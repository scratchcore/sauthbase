import "./globals.css";

import docsConfig from "../../../docs.config";

import { ReactNode } from "react";
import { Metadata } from "next";
import { getPageMap } from "nextra/page-map";
import { Banner, Head } from "nextra/components";
import { Footer, LastUpdated, Layout, Navbar } from "nextra-theme-docs";
import cn from "clsx";
import { getDocsVersionSpace } from "@/lib/docs-version";
import { getDictionary, getDirection } from "../_dictionaries/get-dictionary";
import { IconMessages } from "@tabler/icons-react";

type LayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
}>;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "SAuthBase - Scratch Auth Base SDK by ScratchCore",
      template: "%s - SAuthBase",
    },
    description:
      "Scratch Auth Base SDK（SAuthBase, SAuthBase SDK）は、Scratch プロジェクトやサービスにおいて、認証機能を安全かつ簡潔に導入するためのモジュール型 SDK です。セッションの検証、ユーザー識別の暗号化などを一貫して提供し、開発者の導入負担を軽減します。",
    icons: {
      icon: "/wp-content/brand/sauthbase/logo-nobg.256x256.ico",
      apple: "/wp-content/brand/sauthbase/logo-nobg.256x256.png",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  let pageMap = await getPageMap(`/${lang}`);

  if (lang === "ja") {
    pageMap = [
      ...pageMap,
      {
        name: "remote",
        route: "/remote",
      },
    ];
  }

  const banner = (
    <Banner
      dismissible={false}
      // storageKey={randomUUID()}
    >
      {dictionary.banner}
    </Banner>
  );
  const navbar = (
    <Navbar
      logoLink="/"
      logo={
        <h1
          className={cn(
            "relative hover:transition-all hover:duration-1000 motion-reduce:hover:transition-none",
            "[mask-image:linear-gradient(60deg,#000_25%,rgba(0,0,0,.2)_50%,#000_75%)] [mask-position:0] [mask-size:400%]",
            "hover:[mask-position:100%]",
            "text-2xl font-bold"
          )}
        >
          SAuthBase
        </h1>
      }
      projectLink={`https://github.com/${docsConfig.github.name}/${docsConfig.github.repo}`}
      chatLink={`https://github.com/${docsConfig.github.name}/${docsConfig.github.repo}/discussions`}
      chatIcon={<IconMessages />}
    />
  );
  const footer = (
    <Footer className="relative flex-col items-center md:items-start">
      <a
        className="x:focus-visible:nextra-focus flex items-center gap-1"
        target="_blank"
        rel="noreferrer"
        title="nextra homepage"
        href="https://nextra.site"
      >
        {dictionary.poweredBy}
        <span className="font-bold text-xl">ScratchCore</span>
        {/* <VercelLogo height="20" /> */}
      </a>
      <p className="mt-6 text-xs">
        © {new Date().getFullYear()} The Scratch Auth Base Project.
      </p>
    </Footer>
  );

  return (
    <html
      // Not required, but good for SEO
      lang={lang}
      // Required to be set
      dir={getDirection(lang)}
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body cz-shortcut-listen="false">
        <Layout
          i18n={[
            { locale: "ja", name: "日本語" },
            { locale: "en", name: "English" },
          ]}
          banner={banner}
          navbar={navbar}
          footer={footer}
          pageMap={pageMap}
          docsRepositoryBase={`https://github.com/${docsConfig.github.name}/${
            docsConfig.github.repo
          }/tree${getDocsVersionSpace("/")}/docs`}
          feedback={{
            content: "ご質問ですか？フィードバックをお寄せください ",
          }}
          editLink="GitHubでこのページを編集する"
          sidebar={{
            autoCollapse: true,
            toggleButton: true,
            defaultMenuCollapseLevel: 1,
          }}
          navigation={{
            prev: true,
            next: true,
          }}
          toc={{
            backToTop: dictionary.backToTop,
            extraContent: true,
            title: "このページ",
          }}
          themeSwitch={{
            dark: dictionary.dark,
            light: dictionary.light,
            system: dictionary.system,
          }}
          lastUpdated={
            <LastUpdated locale={lang}>{dictionary.lastUpdated}</LastUpdated>
          }
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
