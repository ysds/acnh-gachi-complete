const fs = require("fs");
const csvParse = require("csv-parse/lib/sync");

//
// Item name
//

(() => {
  const dir = "./data/item-name";
  let contentJson = {};
  let fileList = fs.readdirSync(dir);
  fileList = fileList.filter(RegExp.prototype.test, /.*\.csv$/);

  for (let i = 0; i < fileList.length; i++) {
    const content = fs.readFileSync(`${dir}/${fileList[i]}`);
    const contentArray = csvParse(content, {
      bom: true,
      from_line: 2
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
      contentJson[key] = rowData[1];
    }
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./script/item-name.json", contentJson);
})();

//
// BodyColor
//

(() => {
  let contentJson = {};

  const content = fs.readFileSync(
    `./data/variant-remake/STR_Remake_BodyColor.csv`
  );
  const contentArray = csvParse(content, {
    bom: true,
    from_line: 2
  });

  for (let j = 0; j < contentArray.length; j++) {
    const rowData = contentArray[j];
    const key = (() => {
      const strArray = rowData[0].split("_");
      return `${parseInt(strArray[1], 10)}_${parseInt(strArray[2], 10)}`;
    })();
    let value = rowData[1].replace(/\r\n/g, "");
    // eslint-disable-next-line no-control-regex
    value = value.replace(/\u000e.*?[\u3041-\u3096]+/g, "");
    contentJson[key] = value;
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./script/variant-body.json", contentJson);
})();

//
// PatternColor
//

(() => {
  let contentJson = {};

  const content = fs.readFileSync(
    `./data/variant-remake/STR_Remake_FabricColor.csv`
  );
  const contentArray = csvParse(content, {
    bom: true,
    from_line: 2
  });

  for (let j = 0; j < contentArray.length; j++) {
    const rowData = contentArray[j];
    const key = (() => {
      const strArray = rowData[0].split("_");
      return `${parseInt(strArray[1], 10)}`;
    })();
    let value = rowData[1].replace(/\r\n/g, "");
    // eslint-disable-next-line no-control-regex
    value = value.replace(/\u000e.*?[\u3041-\u3096]+/g, "");

    if (!contentJson[key]) {
      contentJson[key] = [];
    }
    contentJson[key].push(value);
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./script/variant-pattern.json", contentJson);
})();

//
// Fassion
//

(() => {
  const dir = "./data/variant-fassion";
  let contentJson = {};
  let fileList = fs.readdirSync(dir);
  fileList = fileList.filter(RegExp.prototype.test, /.*\.csv$/);

  for (let i = 0; i < fileList.length; i++) {
    const content = fs.readFileSync(`${dir}/${fileList[i]}`);
    const contentArray = csvParse(content, {
      bom: true,
      from_line: 2
    });

    for (let j = 0; j < contentArray.length; j++) {
      const rowData = contentArray[j];
      const key = (() => {
        const strArray = rowData[0].split("_");
        return `${parseInt(strArray[2], 10)}`;
      })();
      contentJson[key] = rowData[1];
    }
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./script/variant-fassion.json", contentJson);
})();

//
// Reaction
//

(() => {
  let contentJson = {};
  const content = fs.readFileSync("./data/reaction/STR_Emoticon.csv");
  const contentArray = csvParse(content, {
    bom: true,
    from_line: 2
  });

  for (let i = 0; i < contentArray.length; i++) {
    const rowData = contentArray[i];
    contentJson[rowData[0]] = rowData[1];
  }

  contentJson = JSON.stringify(contentJson, null, 2);
  fs.writeFileSync("./script/reaction.json", contentJson);
})();
