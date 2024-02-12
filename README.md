# google-calendar-secretary-ai

LINE Bot + Open AI + Googleカレンダー

のGoogleカレンダー登録チャットボット

## 初期設定

1. .env.expample をもとに.env ファイルを作成&設定

## デプロイ

ローカル起動コマンド

```bash
$ yarn local-start
```

```bash
$ ngrok http port番号
```

実行環境

```bash
node 18
```

## カレンダーの設定

### 1. プロジェクト作成

Google Cloud Consoleにアクセスし、プロジェクトを作成する。

URL: https://console.cloud.google.com/welcome/new

そのプロジェクトで、Google Calendar APIを有効化する。


### 2. 認証情報の取得

プロジェクトを選択したら、認証情報を生成し、OAuth 2.0 クライアントID, クライアントシークレットを作成する
.envの"GOOGLE_OAUTH_CLIENT_ID"にクライアントIDをセット
.envの"GOOGLE_OAUTH_SECRET"にクライアントシークレットをセット

.envのAPP_URLには、ngrokで生成したURLをセット（一応、http://localhost:3000 でも動きます）

### 3. アプリケーションの認証情報のリダイレクトURLに下記を追加

ngrokで生成したURL/callback

ex. 
https://caca-240b-c010-450-b123-1234-c123-5e86-3bef.ngrok-free.app/callback
