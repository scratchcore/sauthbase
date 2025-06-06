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
  index: "Introduction",
  installation: "Installation",
  quickstart: "Quick Start",
  usage: "Usage",
  advanced: "Advanced Features",
  "api-reference": "API Reference",
};

export default meta;
