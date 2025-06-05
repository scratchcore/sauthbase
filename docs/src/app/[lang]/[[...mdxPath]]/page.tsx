"use server";

import type { FC } from "react";
import { headers } from "next/headers";
import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../../mdx-components";
import { Metadata } from "next";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath, params.lang);

  const header = await headers();
  const pathname = header.get("x-pathname") || "";
  const isLangRoot =
    pathname === `/${params.lang}` || pathname === `/${params.lang}/`;

  if (isLangRoot) {
    delete metadata?.title;
  }

  const image = "https://sauthbase.scratchcore.org/wp-content/brand/sauthbase/logo-nobg.512x512.png";

  let meta: Metadata = {
    openGraph: {
      type: "profile",
      images: image,
      ...metadata?.openGraph,
    },
    twitter: {
      card: "summary",
      images: image,
      ...metadata?.twitter,
    },
    ...metadata,
  };

  return meta;
}

type PageProps = Readonly<{
  params: Promise<{
    mdxPath: string[];
    lang: string;
  }>;
}>;

const Wrapper = getMDXComponents().wrapper;

const Page: FC<PageProps> = async (props) => {
  const params = await props.params;
  const result = await importPage(params.mdxPath, params.lang);
  const { default: MDXContent, toc, metadata } = result;
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
};

export default Page;
