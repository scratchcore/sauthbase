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
    title: "Documentation",
  },
  about: {
    type: "page",
    title: "About",
    theme: {
      typesetting: "article",
      sidebar: false,
    },
  },
  license: {
    type: "page",
    title: "License",
    theme: {
      typesetting: "article",
      sidebar: false,
      toc: false,
    },
  },
  showcase: {
    type: "page",
    title: "Showcase",
    theme: {
      typesetting: "article",
      layout: "full",
      timestamp: false,
      toc: false,
    },
  },
  sponsors: {
    type: "page",
    title: "Sponsors",
    theme: {
      typesetting: "article",
      layout: "full",
      timestamp: false,
      toc: false,
    },
  },
  __: {
    type: "separator",
    title: "More",
  },
  "about-link": {
    title: "About SAuthBase",
    href: "/about",
  },
  "scratchauth-link": {
    title: "Scratch Auth",
    href: "https://auth.itinerary.eu.org",
  },
};

export default meta;
