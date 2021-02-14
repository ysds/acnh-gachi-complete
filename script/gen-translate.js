const fs = require("fs");
const csvParse = require("csv-parse/lib/sync");

//
// Item name
//

(() => {
  const dir = "./data/translation-src/item-name";
  let contentJson = {};
  let fileList = fs.readdirSync(dir);
  fileList = fileList.filter(RegExp.prototype.test, /.*\.csv$/);

  for (let i = 0; i < fileList.length; i++) {
    const content = fs.readFileSync(`${dir}/${fileList[i]}`);
    const contentArray = csvParse(content, {
      from_line: 2,
      delimiter: ";",
      quote: false
    });

    for (let j = 0; j < contentArray.length; j++) {
      const rowData = contentArray[j];
      const key = (() => {
        const strArray = rowData[0].split("_");
        if (strArray.length === 1) {
          return `Fassion_${parseInt(strArray[0], 10)}`;
        } else {
          return parseInt(strArray[1], 10);
        }
      })();
      contentJson[key] = rowData[12] || rowData[1];
    }
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/item-name.json", contentJson);
})();

//
// BodyColor
//

(() => {
  let contentJson = {};

  const content = fs.readFileSync(
    `./data/translation-src/variant-remake/STR_Remake_BodyColor.csv`
  );
  const contentArray = csvParse(content, {
    from_line: 2,
    delimiter: ";",
    quote: false
  });

  for (let j = 0; j < contentArray.length; j++) {
    const rowData = contentArray[j];
    const key = (() => {
      const strArray = rowData[0].split("_");
      return `${parseInt(strArray[1], 10)}_${parseInt(strArray[2], 10)}`;
    })();
    let value = rowData[12].replace(/\r\n/g, "");
    // eslint-disable-next-line no-control-regex
    value = value.replace(/\u000e.*?[\u3041-\u3096]+/g, "");
    contentJson[key] = value;
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/variant-body.json", contentJson);
})();

//
// BodyTitle
//

(() => {
  let contentJson = {};

  const content = fs.readFileSync(
    `./data/translation-src/variant-remake/STR_Remake_BodyParts.csv`
  );
  const contentArray = csvParse(content, {
    from_line: 2,
    delimiter: ";",
    quote: false
  });

  for (let j = 0; j < contentArray.length; j++) {
    const rowData = contentArray[j];
    const key = (() => {
      const strArray = rowData[0].split("_");
      return `${parseInt(strArray[1], 10)}`;
    })();
    let value = rowData[12].replace(/\r\n/g, "");
    // eslint-disable-next-line no-control-regex
    value = value.replace(/\u000e.*?[\u3041-\u3096]+/g, "");
    contentJson[key] = value;
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync(
    "./data/translation-json/variant-body-title.json",
    contentJson
  );
})();

//
// PatternColor
//

(() => {
  let contentJson = {};

  const content = fs.readFileSync(
    `./data/translation-src/variant-remake/STR_Remake_FabricColor.csv`
  );
  const contentArray = csvParse(content, {
    from_line: 2,
    delimiter: ";",
    quote: false
  });

  for (let j = 0; j < contentArray.length; j++) {
    const rowData = contentArray[j];
    const key = (() => {
      const strArray = rowData[0].split("_");
      return `${parseInt(strArray[1], 10)}`;
    })();
    let value = rowData[12].replace(/\r\n/g, "");
    // eslint-disable-next-line no-control-regex
    value = value.replace(/\u000e.*?[\u3041-\u3096]+/g, "");

    if (!contentJson[key]) {
      contentJson[key] = [];
    }
    contentJson[key].push(value);
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/variant-pattern.json", contentJson);
})();

//
// PatternTitle
//

(() => {
  let contentJson = {};

  const content = fs.readFileSync(
    `./data/translation-src/variant-remake/STR_Remake_FabricParts.csv`
  );
  const contentArray = csvParse(content, {
    from_line: 2,
    delimiter: ";",
    quote: false
  });

  for (let j = 0; j < contentArray.length; j++) {
    const rowData = contentArray[j];
    const key = (() => {
      const strArray = rowData[0].split("_");
      return `${parseInt(strArray[1], 10)}`;
    })();
    let value = rowData[12].replace(/\r\n/g, "");
    // eslint-disable-next-line no-control-regex
    value = value.replace(/\u000e.*?[\u3041-\u3096]+/g, "");

    contentJson[key] = value;
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync(
    "./data/translation-json/variant-pattern-title.json",
    contentJson
  );
})();

//
// Fassion
//

(() => {
  const dir = "./data/translation-src/variant-fassion";
  let contentJson = {};
  let fileList = fs.readdirSync(dir);
  fileList = fileList.filter(RegExp.prototype.test, /.*\.csv$/);

  for (let i = 0; i < fileList.length; i++) {
    const content = fs.readFileSync(`${dir}/${fileList[i]}`);
    const contentArray = csvParse(content, {
      from_line: 2,
      delimiter: ";",
      quote: false
    });

    for (let j = 0; j < contentArray.length; j++) {
      const rowData = contentArray[j];
      const key = (() => {
        const strArray = rowData[0].split("_");
        return `${parseInt(strArray[2], 10)}`;
      })();
      contentJson[key] = rowData[12];
    }
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/variant-fassion.json", contentJson);
})();

//
// Reaction
//

(() => {
  let contentJson = {};
  const content = fs.readFileSync(
    "./data/translation-src/reaction/STR_Emoticon.csv"
  );
  const contentArray = csvParse(content, {
    from_line: 2,
    delimiter: ";",
    quote: false
  });

  for (let i = 0; i < contentArray.length; i++) {
    const rowData = contentArray[i];
    contentJson[rowData[0]] = rowData[12];
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/reaction.json", contentJson);
})();

//
// NookMilage
//

(() => {
  let contentJson = {};
  const content = fs.readFileSync("./data/translation-src/NookMilage_List.csv");
  const contentArray = csvParse(content, {
    bom: true,
    from_line: 2
  });

  for (let i = 0; i < contentArray.length; i++) {
    const rowData = contentArray[i];
    const csvKey = rowData[0];
    const key = (() => {
      const strArray = rowData[0].split("_");
      return `${parseInt(strArray[0], 10)}`;
    })();

    // \r(\u000d)はオリジナルのメッセージファイル(MSBTファイル)に存在しないため削除する
    // MSBT→CSV変換時に改行コード変換(\n→\r\n)されているのが原因と思われる
    const rawValue = rowData[1].replace(/\r/g, "");

    // ルビ制御タグの構造
    // 参考: https://github.com/Kinnay/Nintendo-File-Formats/wiki/MSBT-File-Format
    //
    // オフセット:サイズ:説明
    // 0x0:2:Control charactor (ルビは\u000e固定)
    // 0x2:2:Command type (ルビは\u0000固定)
    // 0x4:2:Subcommand type (ルビは\u0000固定)
    // 0x6:2:Size of parameters (UTF-16でのバイト数)
    // 0x8:n:Parameters
    //
    // Parametersの構造
    // オフセット:サイズ:文字:説明
    // 0x0:2:ルビ対象文字列(漢字文字列)のUTF-16でのバイト数
    // 0x2:2:ルビ文字列(ひらがな文字列)のUTF-16でのバイト数
    // 0x4:n-4:ルビ文字列
    const rubiHeader = "\u000e\\0\\0";
    let pos = rawValue.indexOf(rubiHeader);

    // オリジナル文字列からルビ文字列(ひらがな文字列)を削除した文字列
    let value = "";
    if (pos < 0) {
      // ルビなし
      value = rawValue;
    } else if (pos > 0) {
      // 先頭からルビまでを切り出し
      value = rawValue.substring(0, pos);
    }

    // 名前順ソート用読み文字列(オリジナル文字列からルビ対象文字列(漢字)を削除した文字列)
    let yomi = value;

    // ルビを削除
    while (pos > -1) {
      // Parametersの文字数
      const paramLen = rawValue.charCodeAt(pos + rubiHeader.length) / 2;
      // ルビ対象文字列(漢字文字列)の文字数
      const kanjiLen = rawValue.charCodeAt(pos + rubiHeader.length + 1) / 2;
      // ルビ文字列(ひらがな文字列)の文字数
      const rubiLen = rawValue.charCodeAt(pos + rubiHeader.length + 2) / 2;
      // value用の切り出し開始位置
      const startIndex = pos + rubiHeader.length + 1 + paramLen;
      // yomiValue用の切り出し開始位置
      const yomiStartIndex = pos + rubiHeader.length + 3;

      yomi += rawValue.substring(yomiStartIndex, yomiStartIndex + rubiLen);

      pos = rawValue.indexOf(rubiHeader, pos + 1);
      if (pos > -1) {
        value += rawValue.substring(startIndex, pos);
        yomi += rawValue.substring(startIndex + kanjiLen, pos);
      } else {
        value += rawValue.substring(startIndex);
        yomi += rawValue.substring(startIndex + kanjiLen);
      }
    }

    // ルビ以外の制御用タグを削除
    // eslint-disable-next-line no-control-regex
    value = value.replace(/\u000e\\0.../g, "");
    // 絵文字を削除（釣り大会、ムシとり大会）
    value = value.replace(/\ue20a/g, "");
    value = value.replace(/\ue20b/g, "");
    // 改行削除
    value = value.replace(/\n/g, "");
    // 全角スペース削除
    value = value.replace(/\u3000/g, "");
    // 島名を置換
    value = value.replace('\u000en"\\0', "○○島");

    // 読みの島名は〓(代替文字)に置換
    yomi = yomi.replace('\u000en"\\0', "〓");
    // 読みの「ディーアイワイ」の特殊な長音符を置換
    yomi = yomi.replace(/\ue221/g, "ー");
    // 読みからひらがな・カタカナ・長音符・英数字・〓(島名)以外を削除
    yomi = yomi.replace(
      /[^\u3041-\u3093\u30A1-\u30F6ーA-Za-z0-9Ａ-Ｚａ-ｚ０-９〓]/g,
      ""
    );

    if (contentJson[key] === undefined) contentJson[key] = {};
    if (csvKey.indexOf("_0") > -1) {
      contentJson[key].name = value;
      contentJson[key].yomi = yomi;
    } else {
      contentJson[key].desc = value;
    }
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/achievements.json", contentJson);
})();
