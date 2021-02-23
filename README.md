# あつ森ガチコンプ

このアプリは、あつ森のアイテムの取得状況を管理できるウェブアプリです。来訪者やシーズンイベントなどでも絞り込むことができるため、周回にも活用いただけます。

## セットアップ
```
npm install
```

### 開発サーバの起動
```
npm run serve
```

### ビルド
```
npm run build
```

## アイテムデータの最新化

### 1. アイテム情報の取得

1. [ACNH Item Spreadsheet (JSON format)](https://github.com/acdb-team/google-sheets-to-json) リポジトリをクローンし、セットアップにしたがって最新のデータを取得する
2. 取得した最新データで `data/item-data` フォルダー内の各 JSON ファイルを上書きする

### 2. 翻訳情報の取得

* Discord の ACNH Spreadsheet [#Resources](https://discord.com/channels/701573691426996324/701577157503352983) で公開されているMSBTアーカイブファイル（msbt.zip）を取得し、適当なディレクトリに保存する
* `npm run translate[ -- 1で保存したmsbt.zipのパス]` を実行して翻訳データを最新化する

### 3. `items.json` のビルド

* `npm run gen` を実行して `src/assets/items.json` を最新化する
* アイテム情報や翻訳情報に変更がある場合、`npm run gen` によってカスタム翻訳データ (`data/translation-custom` 内の JSON ファイル) が自動的に更新されるので、未翻訳の箇所を翻訳し、再度 `npm run gen` を実行する
