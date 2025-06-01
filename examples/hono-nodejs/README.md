# ScratchCore AuthBase SDK / examples `hono-nodejs`

## エンドポイント

### `/login`

このエンドポイントでは、Scratch Auth が提供している認証サービスへリダイレクトを行います。

### `/auth`

ユーザーセッションの認証エンドポイント

このエンドポイントは、Scratch Auth 認証サービスから渡されたユーザーセッションを検証します。

成功した場合暗号化されたトークンが生成されます。

### `verify`

暗号化されたトークンの検証
