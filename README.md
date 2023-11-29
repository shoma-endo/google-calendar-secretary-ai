# line-bot-typescript-template

LINE Bot + TypeScript + Firebase Functions のテンプレート
オウム返しボットです。

## 初期設定

1. .firebaserc ファイルを設定
2. .env.expample をもとに.env ファイルを作成&設定

## デプロイ

1.下記コマンドを実行
```
npm install
```

2.プロジェクト作成
Google Cloud Consoleにアクセスし、プロジェクトを作成する。

URL: https://console.cloud.google.com/welcome/new

そのプロジェクトで、Google Calendar APIを有効化する。


3.認証情報の取得
プロジェクトを選択したら、認証情報を生成し、OAuth 2.0 クライアントIDを作成する
OAuth 2.0 クライアントIDをダウンロードして、後で使用するために保存
