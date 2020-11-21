const fs = require("fs");

let all = [];

let fileList = fs.readdirSync("./data/translation-sheet-data");
fileList = fileList.filter(RegExp.prototype.test, /.*\.json$/);

for (let i = 0; i < fileList.length; i++) {
  const content = fs.readFileSync(
    `./data/translation-sheet-data/${fileList[i]}`,
    "utf8"
  );
  all = all.concat(JSON.parse(content));
}

const fixData = JSON.parse(
  fs.readFileSync("./data/translation-fix-data/fix.json", "utf8")
);

const fixPatterns = JSON.parse(
  fs.readFileSync("./data/translation-fix-data/fix_patterns.json", "utf8")
);

all.forEach(translate => {
  delete translate["version"];
  delete translate.locale["EUen"];
  delete translate.locale["EUde"];
  delete translate.locale["EUes"];
  delete translate.locale["USes"];
  delete translate.locale["USfr"];
  delete translate.locale["USfr"];
  delete translate.locale["EUfr"];
  delete translate.locale["EUit"];
  delete translate.locale["EUnl"];
  delete translate.locale["CNzh"];
  delete translate.locale["TWzh"];
  delete translate.locale["KRko"];
  delete translate.locale["EUru"];

  const fixIndex = fixData.incorrect.indexOf(translate.locale["JPja"]);

  if (fixIndex >= 0) {
    translate.locale["JPja"] = fixData.correct[fixIndex];
  }

  const ENname = translate.locale["USen"];
  if (fixPatterns[ENname]) {
    translate.locale["JPja"] = fixPatterns[ENname];
  }
});

fs.writeFileSync("./script/translate-all.json", JSON.stringify(all));
