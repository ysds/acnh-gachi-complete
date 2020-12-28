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

1. [ACNH Item Spreadsheet (JSON format)](https://github.com/acdb-team/google-sheets-to-json) リポジトリをクローンし、セットアップにしたがって最新のデータを取得する
2. 取得した最新データで `data/item-data` 内の JSON ファイルを上書きする
3. [acnh-message](https://github.com/alexislours/acnh-message) から最新のメッセージデータを取得し、`data/translation-src` 内の該当ファイルを上書きする
4. `npm run gen` を実行して `src/assets/items.json` を最新化する
5. 情報ソースに変更がある場合、`npm run gen` によって翻訳データ (`data/translation-custom` 内の JSON ファイル) が自動的に更新されるので、未翻訳の箇所を翻訳して上書き、再度 `npm run gen` を実行する
