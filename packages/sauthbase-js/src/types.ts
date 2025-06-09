export type APIResult<T> =
  | {
      code: string;
      success: true;
      data: T;
    }
  | {
      code: string;
      success: false;
      status: number;
      message: string;
      error?: unknown;
    };

export interface sauthbaseOptions {
  secretKey: string; // 32バイトのhex文字列 (64文字);
  redirect_url: string;
}

export interface verifySessionProps {
  valid: boolean;
  username: undefined | string;
  redirect: undefined | string;
}

export interface verifySessionResponse {
  token: string;
  payload: verifySessionProps;
}

export interface userInfoProps {
  id: number;
  username: string;
  scratchteam: boolean;
  history: {
    joined: string;
  };
  profile: {
    id: number;
    images: {
      "90x90": string;
      "60x60": string;
      "55x55": string;
      "50x50": string;
      "32x32": string;
    };
    status: string;
    bio: string;
    country: string;
  };
}
