import type { MetaRecord } from "nextra";

/**
 * type MetaRecordValue =
 *  | TitleSchema
 *  | PageItemSchema
 *  | SeparatorSchema
 *  | MenuSchema
 *
 * type MetaRecord = Record<string, MetaRecordValue>
 **/
const meta: MetaRecord = {
  index: {
    title: "SAuthBase",
    type: "page",
    theme: {
      typesetting: "article",
      layout: "full",
      toc: false,
    },
    display: "hidden",
  },
  docs: {
    type: "page",
    title: "ドキュメント",
  },
  about: {
    type: "page",
    title: "概要",
    theme: {
      typesetting: "article",
      sidebar: false,
    },
  },
  license: {
    type: "page",
    title: "ライセンス",
    theme: {
      toc: false,
    },
  },
  showcase: {
    type: "page",
    title: "ショーケース",
    theme: {
      typesetting: "article",
      layout: "full",
      timestamp: false,
      toc: false,
    },
  },
  sponsors: {
    type: "page",
    title: "スポンサー",
    theme: {
      typesetting: "article",
      layout: "full",
      timestamp: false,
      toc: false,
    },
  },
  __: {
    type: "separator",
    title: "もっと",
  },
  "about-link": {
    title: "SAuthBase 概要",
    href: "/about",
  },
  "scratchauth-link": {
    title: "Scratch Auth",
    href: "https://auth.itinerary.eu.org",
  },
};

export default meta;