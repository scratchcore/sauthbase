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
  initialization: "Initialization",
  login: "Generate Login Page",
  auth: "Session Verification",
  verify: "Token Verification",
  encryption: "Encryption / Decryption",
};

export default meta;
