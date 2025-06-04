import { sauthbaseOptions } from "./types";

/**
 * この関数は、`sauthbaseOptions` オブジェクトの `secretKey` の 安全性をチェックします。
 *
 * ```typescript
 * const options: sauthbaseOptions = {
 *   secretKey: "your_secret_key_here",
 *   redirect_url: "https://your.redirect.url",
 * };
 * securityCheck(options); // 安全性チェックを実行
 * ```
 *
 * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
 * @param options `sauthbaseOptions` オプションを含むオブジェクト
 * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
 * @copyright [toakiryu](https://github.com/toakiryu)
 */
export const securityCheck = (options: sauthbaseOptions) => {
  const { secretKey } = options;

  if (!secretKey || typeof secretKey !== "string") {
    throw new Error("[SAuthBase] secretKey is required and must be a string.");
  }

  // 推奨: hex形式 64文字（32バイト）
  const isHex = /^[a-fA-F0-9]+$/.test(secretKey);
  if (!isHex || secretKey.length < 64) {
    console.warn(
      "[SAuthBase] ⚠ WARNING: The provided secretKey is weak or not in expected hex format (64 hex characters recommended for AES-256)."
    );
  }
};
