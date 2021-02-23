const fs = require("fs");

//
// Item name
//

(() => {
  const dir = "./data/translation-src/item-name";
  let contentJson = {};
  let fileList = fs.readdirSync(dir);
  fileList = fileList.filter(RegExp.prototype.test, /.*\.json$/);

  for (let i = 0; i < fileList.length; i++) {
    const content = require(`.${dir}/${fileList[i]}`);

    for (const [k, v] of Object.entries(content)) {
      const key = (() => {
        const strArray = k.split("_");
        if (strArray.length === 1) {
          return `Fassion_${parseInt(strArray[0], 10)}`;
        } else {
          return parseInt(strArray[1], 10);
        }
      })();
      contentJson[key] = v;
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

  const content = require(`../data/translation-src/variant-remake/STR_Remake_BodyColor.json`);

  for (const [k, v] of Object.entries(content)) {
    const key = (() => {
      const strArray = k.split("_");
      return `${parseInt(strArray[1], 10)}_${parseInt(strArray[2], 10)}`;
    })();
    contentJson[key] = v.replace(
      // eslint-disable-next-line no-control-regex
      /\u000e[\s\S]*?[\u3041-\u3093\u30A1-\u30F6]+/g,
      ""
    );
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/variant-body.json", contentJson);
})();

//
// BodyTitle
//

(() => {
  let contentJson = {};

  const content = require(`../data/translation-src/variant-remake/STR_Remake_BodyParts.json`);

  for (const [k, v] of Object.entries(content)) {
    const key = (() => {
      const strArray = k.split("_");
      return `${parseInt(strArray[1], 10)}`;
    })();
    contentJson[key] = v.replace(
      // eslint-disable-next-line no-control-regex
      /\u000e[\s\S]*?[\u3041-\u3093\u30A1-\u30F6]+/g,
      ""
    );
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

  const content = require(`../data/translation-src/variant-remake/STR_Remake_FabricColor.json`);

  for (const [k, v] of Object.entries(content)) {
    const key = (() => {
      const strArray = k.split("_");
      return `${parseInt(strArray[1], 10)}`;
    })();
    const value = v.replace(
      // eslint-disable-next-line no-control-regex
      /\u000e[\s\S]*?[\u3041-\u3093\u30A1-\u30F6]+/g,
      ""
    );

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

  const content = require(`../data/translation-src/variant-remake/STR_Remake_FabricParts.json`);

  for (const [k, v] of Object.entries(content)) {
    const key = (() => {
      const strArray = k.split("_");
      return `${parseInt(strArray[1], 10)}`;
    })();
    contentJson[key] = v.replace(
      // eslint-disable-next-line no-control-regex
      /\u000e[\s\S]*?[\u3041-\u3093\u30A1-\u30F6]+/g,
      ""
    );
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
  fileList = fileList.filter(RegExp.prototype.test, /.*\.json$/);

  for (let i = 0; i < fileList.length; i++) {
    const content = require(`.${dir}/${fileList[i]}`);

    for (const [k, v] of Object.entries(content)) {
      const key = (() => {
        const strArray = k.split("_");
        return `${parseInt(strArray[2], 10)}`;
      })();
      contentJson[key] = v;
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
  const content = require("../data/translation-src/reaction/STR_Emoticon.json");
  contentJson = JSON.stringify(content, null, 2);
  fs.writeFileSync("./data/translation-json/reaction.json", contentJson);
})();

//
// NookMilage
//

(() => {
  let contentJson = {};
  const content = require("../data/translation-src/NookMilage_List.json");

  for (const [k, v] of Object.entries(content)) {
    const key = (() => {
      const strArray = k.split("_");
      return `${parseInt(strArray[0], 10)}`;
    })();

    const rawValue = v;

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
    const rubiHeader = "\u000e\u0000\u0000";
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
    value = value.replace(/\u000e\u0000.../g, "");
    // 絵文字を削除（釣り大会、ムシとり大会）
    value = value.replace(/\ue20a/g, "");
    value = value.replace(/\ue20b/g, "");
    // 改行削除
    value = value.replace(/\n/g, "");
    // 全角スペース削除
    value = value.replace(/\u3000/g, "");
    // 島名を置換
    value = value.replace('\u000en"\u0000', "○○島");

    // 読みの島名は〓(代替文字)に置換
    yomi = yomi.replace('\u000en"\u0000', "〓");
    // 読みの「ディーアイワイ」の特殊な長音符を置換
    yomi = yomi.replace(/\ue221/g, "ー");
    // 読みからひらがな・カタカナ・長音符・英数字・〓(島名)以外を削除
    yomi = yomi.replace(
      /[^\u3041-\u3093\u30A1-\u30F6ーA-Za-z0-9Ａ-Ｚａ-ｚ０-９〓]/g,
      ""
    );

    if (contentJson[key] === undefined) contentJson[key] = {};
    if (k.indexOf("_0") > -1) {
      contentJson[key].name = value;
      contentJson[key].yomi = yomi;
    } else {
      contentJson[key].desc = value;
    }
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/achievements.json", contentJson);
})();
