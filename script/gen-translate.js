const fs = require("fs");
const csvParse = require("csv-parse/lib/sync");

let contentJson = {};
let dir;
let fileList;

const getInternalId = function(str) {
  const strArray = str.split("_");
  if (strArray.length === 1) {
    return `Fassion_${parseInt(strArray[0], 10)}`;
  } else {
    return parseInt(strArray[1], 10);
  }
};

//
// Item name
//

dir = "./data/item-name";
fileList = fs.readdirSync(dir);
fileList = fileList.filter(RegExp.prototype.test, /.*\.csv$/);

for (let i = 0; i < fileList.length; i++) {
  const content = fs.readFileSync(`${dir}/${fileList[i]}`);
  const contentArray = csvParse(content, {
    bom: true,
    from_line: 2
  });

  for (let j = 0; j < contentArray.length; j++) {
    const rowData = contentArray[j];
    const key = getInternalId(rowData[0]);
    contentJson[key] = rowData[1];
  }
}

contentJson = JSON.stringify(contentJson, null, 2);
fs.writeFileSync("./script/item-name.json", contentJson);
