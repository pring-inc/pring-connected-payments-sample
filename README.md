# pringアプリ間連携サンプルアプリ

## 概要

| ディレクトリ | 内容物 | 使用言語・フレームワーク |
| --- | --- | --- |
| `backend` | APIサーバーコード（ビジネスロジックのみ） | TypeScript |
| `frontend` | アプリコード | TypeScript, React Native |

## クライアントシークレットに関する注意点

本サンプルアプリでは、APIサーバーコードをフロントエンドコードに埋め込み、アプリから直接pring APIサーバー（staging環境）と通信を行っています。
そのため、本来サーバー上に機密に保持されるべきクライアントシークレットをアプリのバイナリに直接埋め込んでいるため、リバースエンジニアリングによってクライアントシークレットを抽出できる状態となっています。
本サンプルアプリはあくまで実装例の提示が目的なこと、本番環境での実運用は行わないことの2点を考慮した上で、上記のような簡略化を行いました。
加盟店様の開発されるアプリにおきましては、クライアントシークレットが漏洩することのないよう適切に管理していただくようお願い申し上げます。

## 主要な参照箇所

### APIサーバーコード

- 全APIへのリクエストの共通処理
    - `backend/src/service/pring_payment_client/__common__/models/utility/client.ts`
- アクセストークンが必要なAPIへのリクエスト処理
    - `backend/src/service/pring_payment_client/__common__/functions/request_with_authorization.ts`
- 認可コードやリフレッシュトークンの暗号化処理
    - `backend/src/service/pring_payment_client/__common__/functions/encrypt_string.ts`
- OAuth系APIへのリクエスト処理
    - `backend/src/service/pring_payment_client/authorization/commands/*.ts`
- 決済系APIで使う署名の生成処理
    - `backend/src/service/pring_payment_client/payment/functions/create_signature.ts`
- 支払い要求APIリクエスト処理
    - `backend/src/service/pring_payment_client/payment/commands/create_payment.ts`

### アプリコード

- pringアプリへのリダイレクト処理（認可画面への遷移）
    - `frontend/src/effects/authorize_with_pring.ts`
- pringアプリからのリダイレクト処理（認可コードの受け取り）
    - `frontend/src/effects/handle_pring_callback.ts`

## エミュレータ・シミュレータ用ビルド

### 開発環境

- yarn
- [React Native CLI開発環境](https://reactnative.dev/docs/environment-setup)

### 手順

初回のみ、以下のセットアップを行う。

```
# backendディレクトリにて以下を実行
yarn && yarn build && yarn pack

# frontendディレクトリにて以下を実行
yarn

# frontendディレクトリ直下に、下記を参考に「.env」ファイルを作成する
API_BASE_URL=https://staging.api.pring.app
PRING_APP_CUSTOM_SCHEME=stagingpring
PRING_PAYMENT_BASE_URL=https://staging.api.pring.app
PRING_PAYMENT_CLIENT_ID=（クライアントID）
PRING_PAYMENT_CLIENT_SECRET=（クライアントシークレット）

# iOSシミュレータを使う場合、frontend ディレクトリにて以下を実行
bundle install
# iOSシミュレータを使う場合、frontend/iosディレクトリにて以下を実行
bundle exec pod install
```

セットアップ後、以下のコマンドでエミュレータまたはシミュレータで実行できる。

```
# iOSシミュレータを使う場合
yarn ios

# Androidエミュレータを使う場合
yarn android
```
