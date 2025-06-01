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
  initialization: "初期化",
  login: "ログインページ生成",
  auth: "セッションの検証",
  verify: "トークンの検証",
  encryption: "暗号化・復号",
};

export default meta;
