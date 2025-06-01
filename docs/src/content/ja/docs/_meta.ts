import type { MetaRecord } from "nextra";
import { title } from "process";

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
  index: "はじめに",
  installation: "インストール",
  quickstart: "クイックスタート",
  usage: "使い方",
  advanced: "高度な機能",
  "api-reference": "API リファレンス",
};

export default meta;
