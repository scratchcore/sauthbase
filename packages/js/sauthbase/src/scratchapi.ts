import axios from "axios";
import type { APIResult, userInfoProps } from "./types.ts";

/**
 * ### ScratchCore / Scratch Auth Base SDK
 * #### ユーザー情報の取得
 * @since v0.0.1
 * @description
 * このメソッドは、指定されたユーザー名に基づいてScratchのユーザー情報を取得します。
 * 成功した場合、ユーザー情報を含む`userInfoProps`オブジェクトを返します。
 * 失敗した場合は、エラーメッセージとステータスコードを含むAPI結果オブジェクトを返します。
 * @param username ユーザー名
 * @returns `APIResult<UserInfoProps>` ユーザー情報を含むAPI結果オブジェクト
 * @example
 * ```typescript
 * const userInfo = await getScratchUserInfo("exampleUser");
 * if (userInfo.success) {
 *   console.log(userInfo.data); // ユーザー情報が表示されます
 * } else {
 *   console.error(userInfo.message); // エラーメッセージが表示されます
 * }
 * ```
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
    if (response.data) {
      return {
        code: "SUCCESS",
        success: true,
        data: response.data,
      };
    } else {
      return {
        code: "ERROR/USER_NOT_FOUND",
        status: 404,
        success: false,
        message: "ユーザー情報を取得出来ませんでした。",
      };
    }
  } catch (error) {
    return {
      code: "ERROR/REQUEST_FAILED_SCRATCH_API",
      status: 500,
      success: false,
      message: "Scratch API へのリクエストに失敗しました。",
      error: error,
    };
  }
};
