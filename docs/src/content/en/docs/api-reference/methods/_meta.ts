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
  init: "",
  use: "",
  isReady: "",
  generateSecureKey: "",
  calculateHmac: "",
  encrypt: "",
  decrypt: "",
  generationAuthPageUrl: "",
  generateEncryptedToken: "",
  verifySession: "",
  extractUserWithVerify: "",
  extractUserUnsafe: "",
  getUser: "",
};

export default meta;
