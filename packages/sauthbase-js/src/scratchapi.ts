import axios, { AxiosError } from "axios";
import type { APIResult, userInfoProps } from "./types.js";

/**
 * このメソッドは、指定されたユーザー名に基づいてScratchのユーザー情報を取得します。
 * 成功した場合、ユーザー情報を含む`userInfoProps`オブジェクトを返します。
 * 失敗した場合は、エラーメッセージとステータスコードを含むAPI結果オブジェクトを返します。
 *
 * ```typescript
 * const userInfo = await getScratchUserInfo("exampleUser");
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
 * @see [source](https://github.com/scratchcore/sauthbase/blob/main/packages/sauthbase-js/src/scratchapi.ts)
 * @copyright [toakiryu](https://github.com/toakiryu)
 */
export const getScratchUserInfo = async (
  username?: null | undefined | string
): Promise<APIResult<userInfoProps>> => {
  if (!username) {
    return {
      code: "ERROR/ARGUMENT_REQUIRED_USERNAME",
      status: 400,
      success: false,
      message: "引数にユーザー名を渡してください。",
    };
  }
  try {
    const response = await axios(
      `https://api.scratch.mit.edu/users/${username}`
    );
    return {
      code: "SUCCESS",
      success: true,
      data: response.data,
    };
  } catch (error) {
    const err = error as AxiosError;
    if (err.status === 404) {
      return {
        code: "ERROR/USER_NOT_FOUND",
        status: 404,
        success: false,
        message: "ユーザー情報を取得出来ませんでした。",
        error: error,
      };
    }
    return {
      code: "ERROR/REQUEST_FAILED_SCRATCH_API",
      status: 500,
      success: false,
      message: "Scratch API へのリクエストに失敗しました。",
      error: error,
    };
  }
};
