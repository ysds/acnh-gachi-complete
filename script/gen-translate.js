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

    const rawValue = rowData[1].replace(/\r/g, "");

    const rubiHeader = "\u000e\\0\\0";
    let pos = rawValue.indexOf(rubiHeader);

    let value = "";
    if (pos < 0) {
      // ルビなし
      value = rawValue;
    } else if (pos > 0) {
      // 先頭からルビまでを切り出し
      value = rawValue.substring(0, pos);
    }

    // ルビを削除
    while (pos > -1) {
      const rubiLen = rawValue.charCodeAt(pos + rubiHeader.length) / 2;
      const startIndex = pos + rubiHeader.length + 1 + rubiLen;
      pos = rawValue.indexOf(rubiHeader, pos + 1);
      if (pos > -1) {
        value += rawValue.substring(startIndex, pos);
      } else {
        value += rawValue.substring(startIndex);
      }
    }

    // 強調用の制御文字（？）を削除
    value = value.replace(/\u000e\\0.../g, "");
    // 絵文字を削除（釣り大会、ムシとり大会）
    value = value.replace(/\ue20a/g, "");
    value = value.replace(/\ue20b/g, "");
    // 改行削除
    value = value.replace(/\n/g, "");
    // 全角スペース削除
    value = value.replace(/　/g, "");
    // 島名を置換
    value = value.replace('n"\\0', "○○島");

    if (contentJson[key] === undefined) contentJson[key] = {};
    if (csvKey.indexOf("_0") > -1) {
      contentJson[key].name = value;
    } else {
      contentJson[key].desc = value;
    }
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./data/translation-json/achievements.json", contentJson);
})();
