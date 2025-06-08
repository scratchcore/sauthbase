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
    type: "page",
    theme: {
      toc: false,
    },
  },
  "0.0.1": {
    type: "page",
    theme: {
      toc: false,
    },
  },
  "0.0.2": {
    type: "page",
    theme: {
      toc: false,
    },
  },
};

export default meta;
