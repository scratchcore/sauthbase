export const version = "0.0.1";

import axios from "axios";
import crypto from "crypto";
import { getScratchUserInfo } from "./scratchapi";
import type {
  APIResult,
  sauthbaseOptions,
  userInfoProps,
  verifySessionProps,
  verifySessionResponse,
} from "./types.ts";
import { securityCheck } from "./security";

/**
 * このクラスは、Scratchの認証システムを使用するための基本的な機能を提供します。
 * 認証ページの生成、ユーザー情報の取得、トークンの検証などの機能を含みます。
 * シングルトンパターンを使用して、アプリケーション全体で1つのインスタンスを共有します。
 *
 * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
 * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
 * @copyright [toakiryu](https://github.com/toakiryu)
 */
export class sauthbase {
  private static instance: sauthbase | undefined = undefined;

  /**
   * このコンストラクタは、`sauthbase` のインスタンスを作成します。
   * `secretKey` と `redirect_url` を指定する必要があります。
   * `secretKey` は、セキュリティのために十分に強力である必要があります。
   * `redirect_url` は、認証後にリダイレクトされるURLです。
   *
   * ```typescript
   * const sab = new sauthbase({ secretKey: "your_secret_key_here",  redirect_url: "https://your.redirect.url"});
   * console.log(sab); // SAuthBase インスタンスが表示されます
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param secretKey セキュリティキー（AES-256-GCMなどの暗号化アルゴリズムで使用）
   * @param redirect_url リダイレクト先のURL
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  private constructor(
    private readonly secretKey: string,
    private readonly redirect_url: string
  ) {}

  /**
   * このメソッドは、`sauthbase` のインスタンスを初期化します。
   * `secretKey` と `redirect_url` を指定する必要があります。
   * `secretKey` は、セキュリティのために十分に強力である必要があります。
   * `redirect_url` は、認証後にリダイレクトされるURLです。
   * 初期化後、`sauthbase.use()` を使用してインスタンスを取得できます。
   *
   * ```typescript
   * const sab = sauthbase.init({
   *   secretKey: "your_secret_key_here",
   *   redirect_url: "https://your.redirect.url",
   * });
   * console.log(sab); // sauthbase インスタンスが表示されます
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param options `sauthbaseOptions` オプションを含むオブジェクト
   * @returns  `sauthbase` インスタンス
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  static init(options: sauthbaseOptions): sauthbase {
    if (!this.instance) {
      securityCheck(options);
      this.instance = new sauthbase(options.secretKey, options.redirect_url);
    }
    return this.instance;
  }

  /**
   * このメソッドは、`sauthbase` のインスタンスを取得します。
   * 初期化されていない場合は、エラーをスローします。
   *
   * @example
   * ```typescript
   * const sab = sauthbase.use();
   * console.log(sab); // sauthbase インスタンスが表示されます
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @returns `sauthbase` インスタンスを取得します。
   * @throws エラーが発生した場合、`sauthbase` が初期化されていないことを示すエラーメッセージをスローします。
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  static use(): sauthbase {
    if (!this.instance) {
      throw new Error("SAuthBase has not been initialized.");
    }
    return this.instance;
  }

  /**
   * このメソッドは、`sauthbase` のインスタンスが初期化されているかどうかを確認します。
   * 初期化されている場合は `true` を返し、初期化されていない場合は `false` を返します。
   *
   * ```typescript
   * const isInitialized = sauthbase.isReady();
   * console.log(isInitialized); // true または false が表示されます
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @returns `boolean` インスタンスが初期化されているかどうかを確認します。
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  static isReady(): boolean {
    return this.instance !== null;
  }

  /**
   * セキュアなキーを生成します。32バイトのランダムなバイナリデータを16進数文字列に変換して返します。
   * 生成されるキーは、AES-256-GCMなどの暗号化アルゴリズムで使用するのに適しています。
   *
   * ```typescript
   * const secureKey = sauthbase.generateSecureKey();
   * console.log(secureKey); // 例: "a3f5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7"
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @returns `string` 生成されたキー
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  static generateSecureKey(): string {
    return crypto.randomBytes(32).toString("hex"); // 64文字
  }

  /**
   * このメソッドは、指定されたコンテンツに対してHMACを計算します。
   * HMACは、指定されたシークレットキーを使用して計算されます。
   * 成功した場合、計算されたHMACを16進数文字列として返します。
   * 失敗した場合は、エラーメッセージとステータスコードを含むAPI結果オブジェクトを返します。
   *
   * ```typescript
   * const hmacResult = sauthbase.use().calculateHmac("......");
   * if (hmacResult.success) {
   *   console.log(hmacResult.data); // 計算されたHMACが表示されます
   * } else {
   *   console.error(hmacResult.message); // エラーメッセージが表示されます
   * }
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param content 計算するコンテンツ
   * @returns `APIResult<string>` 計算されたHMACを含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  calculateHmac(content: string): APIResult<string> {
    try {
      return {
        success: true,
        code: "SUCCESS",
        data: crypto
          .createHmac("sha256", this.secretKey)
          .update(content)
          .digest("hex"),
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        code: "ERROR/INTERNAL_HMAC_CALCULATION",
        message: "HMAC の計算中にエラーが発生しました。",
        error,
      };
    }
  }

  /**
   * このメソッドは、指定されたコンテンツをAES-GCMアルゴリズムを使用して暗号化します。
   * 暗号化には、指定されたシークレットキーが使用されます。
   * 成功した場合、暗号化されたデータをIV（初期化ベクトル）、暗号文、および認証タグを含む形式で返します。
   * 失敗した場合は、エラーメッセージとステータスコードを含むAPI結果オブジェクトを返します。
   *
   * ```typescript
   * const encrypted = sauthbase.use().encrypt("......");
   * if (encrypted.success) {
   *   console.log(encrypted.data); // 暗号化されたデータが表示されます
   * } else {
   *   console.error(encrypted.message); // エラーメッセージが表示されます
   * }
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param content 暗号化するコンテンツ
   * @returns `APIResult<string>` 暗号化されたデータを含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  encrypt(content: string): APIResult<string> {
    try {
      const iv = crypto.randomBytes(12); // 96bit IV
      const keyBuffer = Buffer.from(this.secretKey, "hex");
      const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);

      let encrypted = cipher.update(content, "utf8", "hex");
      encrypted += cipher.final("hex");

      const authTag = cipher.getAuthTag().toString("hex");
      return {
        success: true,
        code: "SUCCESS",
        data: `${iv.toString("hex")}:${encrypted}:${authTag}`,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        code: "ERROR/INTERNAL_ENCRYPTION",
        message: "データの暗号化中にエラーが発生しました。",
        error,
      };
    }
  }

  /**
   * このメソッドは、指定された暗号化されたコンテンツをAES-GCMアルゴリズムを使用して復号します。
   * 復号には、指定されたシークレットキーが使用されます。
   * 成功した場合、復号されたデータをUTF-8文字列として返します。
   * 失敗した場合は、エラーメッセージとステータスコードを含むAPI結果オブジェクトを返します。
   *
   * ```typescript
   * const decrypted = sauthbase.use().decrypt("......");
   * if (decrypted.success) {
   *   console.log(decrypted.data); // 復号されたデータが表示されます
   * } else {
   *   console.error(decrypted.message); // エラーメッセージが表示されます
   * }
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param content 復号する暗号化されたコンテンツ
   * @returns `APIResult<string>` 復号されたデータを含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  decrypt(content: string): APIResult<string> {
    const parts = content.split(":");
    if (parts.length !== 3) {
      return {
        success: false,
        status: 400,
        code: "ERROR/FORMAT_INVALID_TOKEN",
        message: "トークン形式が無効です。",
      };
    }

    try {
      const [iv, encrypt, authTag] = content.split(":");
      const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        Buffer.from(this.secretKey, "hex"),
        Buffer.from(iv, "hex")
      );

      decipher.setAuthTag(Buffer.from(authTag, "hex"));

      let decrypted = decipher.update(encrypt, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return {
        success: true,
        code: "SUCCESS",
        data: decrypted,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        code: "ERROR/INTERNAL_DECRYPTION",
        message: "データの復号中にエラーが発生しました。",
        error,
      };
    }
  }

  /**
   * このメソッドは、認証ページのURLを生成します。
   * デフォルトでは、タイトルは "ScratchCore" ですが、オプションで変更できます。
   * 生成されるURLは、認証システムにリダイレクトするためのものです。
   * URLには、リダイレクト先のURLがBase64エンコードされた形式で含まれます。
   * 生成されたURLは、ユーザーが認証を行うために使用できます。
   *
   * ```typescript
   * const authUrl = sauthbase.use().generationAuthPageUrl("MyApp");
   * console.log(authUrl.data); // 例: "https://auth.itinerary.eu.org/auth/?redirect=..."
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param title 認証ページでタイトルとして表示されます
   * @returns `APIResult<string>` 認証ページのURLを含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  generationAuthPageUrl(title?: string | undefined): APIResult<string> {
    const _title = title || "ScratchCore";
    const redirectLocation = btoa(this.redirect_url);
    return {
      success: true,
      code: "SUCCESS",
      data: `https://auth.itinerary.eu.org/auth/?redirect=${redirectLocation}&name=${_title}`,
    };
  }

  /**
   * このメソッドは、指定されたScratchアカウント名を暗号化します。
   * アカウント名とHMACを組み合わせて暗号化し、暗号化されたデータを返します。
   * 成功した場合、暗号化されたデータを含むAPI結果オブジェクトを返します。
   * 失敗した場合は、エラーメッセージとステータスコードを含むAPI結果オブジェクトを返します。
   *
   * ```typescript
   * const encryptedAccount = await sauthbase.use().generateEncryptedToken("exampleUser");
   * if (encryptedAccount.success) {
   *   console.log(encryptedAccount.data); // 暗号化されたトークン情報が表示されます
   * } else {
   *   console.error(encryptedAccount.message); // エラーメッセージが表示されます
   * }
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param content アカウント名
   * @returns `APIResult<string>` 暗号化されたトークン情報を含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  async generateEncryptedToken(
    content?: string | undefined
  ): Promise<APIResult<string>> {
    if (!content) {
      return {
        status: 400,
        success: false,
        code: "ERROR/ARGUMENT_REQUIRED_USERNAME",
        message:
          "ユーザー名が指定されていません。暗号化するアカウント名を渡してください。",
      };
    }
    // アカウント名の暗号化
    const hmac = this.calculateHmac(content);
    if (hmac.success) {
      // アカウント情報の暗号化
      const encrypted = this.encrypt(content + "|" + hmac.data);
      if (encrypted.success) {
        return {
          success: true,
          code: "SUCCESS",
          data: encrypted.data,
        };
      } else {
        return {
          status: 500,
          success: false,
          code: "ERROR/INTERNAL_ENCRYPTION_FAILURE",
          message: encrypted.message,
          error: encrypted.error,
        };
      }
    } else {
      return {
        status: 500,
        success: false,
        code: "ERROR/INTERNAL_HMAC_FAILURE",
        message: hmac.message,
        error: hmac.error,
      };
    }
  }

  /**
   * このメソッドは、指定されたユーザーセッションを検証します。
   * ユーザーセッションが有効であり、リダイレクトURLが一致する場合、トークンと検証データを返します。
   * 失敗した場合は、エラーメッセージとステータスコードを含むAPI結果オブジェクトを返します。
   *
   * ```typescript
   * const verificationResult = await sauthbase.use().verifySession("your_token_here");
   * if (verificationResult.success) {
   *   console.log(verificationResult.data); // トークンと検証データが表示されます
   * } else {
   *   console.error(verificationResult.message); // エラーメッセージが表示されます
   * }
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param content 検証するセッション
   * @returns `APIResult<verifySessionResponse>` セッションの検証結果を含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  async verifySession(
    content?: string | undefined,
    fetcher: (url: string) => Promise<{ data: verifySessionProps }> = axios
  ): Promise<APIResult<verifySessionResponse>> {
    if (!content) {
      return {
        status: 400,
        success: false,
        code: "ERROR/ARGUMENT_REQUIRED_SESSION",
        message: "検証対象のユーザーセッションが指定されていません。",
      };
    }
    try {
      // ユーザーセッションの検証
      const response = await fetcher(
        `https://auth.itinerary.eu.org/api/auth/verifyToken?privateCode=${content}`
      );
      const data: verifySessionProps = response.data;
      if (data.valid === true && data.redirect === this.redirect_url) {
        let token = await this.generateEncryptedToken(data.username);
        if (token.success) {
          return {
            success: true,
            code: "SUCCESS",
            data: {
              token: token.data,
              payload: data,
            },
          };
        } else {
          // propagate error and code, but override if not present
          return {
            ...token,
            code: token.code ?? "ERROR/INTERNAL_TOKEN_GENERATION",
          };
        }
      }
      return {
        status: 404,
        success: false,
        code: "ERROR/SESSION_INVALID_OR_REDIRECT_MISMATCH",
        message:
          "ユーザーセッションの検証に失敗しました。リダイレクトURLが一致しないか無効なユーザーセッションです。",
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        code: "ERROR/INTERNAL_VERIFICATION",
        message: "認証サーバーへのアクセス中にエラーが発生しました。",
        error,
      };
    }
  }

  /**
   * このメソッドは、暗号化されたトークンを復号し、セッションIDとHMACを検証します。改ざんが検知された場合は失敗として返します。
   *
   * ```typescript
   * const sessionIdResult = await sauthbase.use().extractUserWithVerify("your_encrypted_token_here");
   * if (sessionIdResult.success) {
   *   console.log(sessionIdResult.data); // ユーザー名が表示されます
   * } else {
   *   console.error(sessionIdResult.message); // エラーメッセージが表示されます
   * }
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param content 暗号化されたトークン
   * @returns `APIResult<string>` 復号と検証されたユーザー名を含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  async extractUserWithVerify(
    content?: string | undefined
  ): Promise<APIResult<string>> {
    if (!content) {
      return {
        status: 400,
        success: false,
        code: "ERROR/ARGUMENT_REQUIRED_TOKEN",
        message:
          "トークンが指定されていません。引数に暗号化されたトークンを渡してください。",
      };
    }

    const decryptedValue = this.decrypt(content);
    if (decryptedValue.success) {
      const [sessionId, hmac] = decryptedValue.data.split("|");
      const calculatedHmac = this.calculateHmac(sessionId);
      if (calculatedHmac.success) {
        if (calculatedHmac.data === hmac) {
          return {
            success: true,
            code: "SUCCESS",
            data: sessionId,
          };
        } else {
          return {
            status: 500,
            success: false,
            code: "ERROR/HMAC_MISMATCH",
            message:
              "HMAC の検証に失敗しました。トークンが改ざんされている可能性があります。",
          };
        }
      } else {
        return {
          status: calculatedHmac.status,
          success: false,
          code: "ERROR/INTERNAL_HMAC_ERROR",
          message: calculatedHmac.message,
          error: calculatedHmac.error,
        };
      }
    } else {
      return {
        status: decryptedValue.status,
        success: false,
        code: "ERROR/DECRYPTION_FAILURE",
        message: decryptedValue.message,
        error: decryptedValue.error,
      };
    }
  }

  /**
   * このメソッドは、暗号化されたトークンからユーザー名を復号して取得します。ただし、HMACによる改ざん検知を行わないため、セキュアな認証用途には適していません。
   *
   * ```typescript
   * const userNameResult = sauthbase.use().extractUserUnsafe("your_encrypted_token_here");
   * if (userNameResult.success) {
   *   console.log(userNameResult.data); // ユーザー名が表示されます
   * } else {
   *   console.error(userNameResult.message); // エラーメッセージが表示されます
   * }
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @deprecated この関数は改ざん検知を行わないため、認証用途には使用しないでください。代わりに `extractUserWithVerify()` を使用してください。
   * 暗号化されたトークンからユーザー名を取得する
   * @param content 暗号化されたトークン
   * @returns `APIResult<string>` 検証なしで抽出されたユーザー名を含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  extractUserUnsafe(content?: string | undefined): APIResult<string> {
    if (!content) {
      return {
        status: 400,
        success: false,
        code: "ERROR/ARGUMENT_REQUIRED_TOKEN",
        message:
          "暗号化されたトークンが指定されていません。引数にトークンを渡してください。",
      };
    }
    const decrypted = this.decrypt(content);
    if (decrypted.success) {
      const [username] = decrypted.data.split("|");
      return {
        success: true,
        code: "SUCCESS",
        data: username,
      };
    } else {
      return {
        status: decrypted.status,
        success: false,
        code: "ERROR/DECRYPTION_FAILURE",
        message: decrypted.message,
        error: decrypted.error,
      };
    }
  }

  /**
   * このメソッドは、指定されたユーザー名に基づいてScratchのユーザー情報を取得します。
   * 成功した場合、ユーザー情報を含む`userInfoProps`オブジェクトを返します。
   * 失敗した場合は、エラーメッセージとステータスコードを含むAPI結果オブジェクトを返します。
   *
   * ```typescript
   * const userInfo = await sauthbase.use().getUser("exampleUser");
   * if (userInfo.success) {
   *   console.log(userInfo.data); // ユーザー情報が表示されます
   * } else {
   *   console.error(userInfo.message); // エラーメッセージが表示されます
   * }
   * ```
   *
   * @since [v0.0.1-alpha.1](https://www.npmjs.com/package/sauthbase/v/0.0.1-alpha.1)
   * @param username ユーザー名
   * @returns `APIResult<UserInfoProps>` ユーザー情報を含むAPI結果オブジェクト
   * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/main.ts)
   * @copyright [toakiryu](https://github.com/toakiryu)
   */
  async getUser(
    username?: string | undefined
  ): Promise<APIResult<userInfoProps>> {
    if (!username) {
      return {
        status: 400,
        success: false,
        code: "ERROR/ARGUMENT_REQUIRED_USERNAME",
        message:
          "ユーザー名が指定されていません。引数にユーザー名を渡してください。",
      };
    }
    const response = await getScratchUserInfo(username);
    if (response.success) {
      return {
        success: true,
        code: "SUCCESS",
        data: response.data,
      };
    } else {
      return {
        status: response.status,
        success: false,
        code: response.code,
        message: response.message,
        error: response.error,
      };
    }
  }
}
