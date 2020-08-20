const fs = require("fs");

// Load Json

let content = JSON.parse(
  // fs.readFileSync("./node_modules/@nooksbazaar/acdb/out/items.json", "utf8")
  fs.readFileSync("./json/item-data/items.json", "utf8")
);

content = content.concat(
  JSON.parse(
    // fs.readFileSync("./node_modules/@nooksbazaar/acdb/out/recipes.json", "utf8")
    fs.readFileSync("./json/item-data/recipes.json", "utf8")
  )
);

const allTranslations = JSON.parse(
  fs.readFileSync(`./script/translate-all.json`, "utf8")
);

const sourceTranslation = JSON.parse(
  fs.readFileSync(`./json/translation-fix-data/source.json`, "utf8")
);

const sourceNoteTranslation = JSON.parse(
  fs.readFileSync(`./json/translation-fix-data/sourceNote.json`, "utf8")
);

// Remove "Other" items

content = content.filter(item => {
  let result = true;
  if (item.sourceSheet === "Other") result = false;
  return result;
});

// Each items
content.forEach(item => {
  // Remove photo variant
  if (item.sourceSheet === "Photos") {
    item.variants = item.variants.slice(0, 1);
  }

  if (item.variants) {
    // Remove pattern variant
    let prevVariation = "";
    let newVariants = item.variants.filter(variant => {
      const result = prevVariation !== variant.variation;
      prevVariation = variant.variation;
      return result;
    });
    item.variants = newVariants;

    // Remove remake variant
    let prevBodyCustomize = false;
    newVariants = item.variants.filter(variant => {
      if (variant.bodyCustomize) {
        const result = prevBodyCustomize !== variant.bodyCustomize;
        prevBodyCustomize = true;
        return result;
      } else {
        prevBodyCustomize = false;
        return true;
      }
    });
    item.variants = newVariants;

    // Add variants displayName (furniture)
    let translateObjects = allTranslations.filter(obj => {
      if (obj.furniture_name) {
        return obj.furniture_name.toLowerCase() === item.name.toLowerCase();
      }
      return false;
    });

    if (translateObjects.length > 0) {
      item.variants.forEach((variant, index) => {
        if (variant.variation && typeof variant.variation === "string") {
          item.variants[index].variationDisplayName =
            translateObjects[index].locale.JPja;
        }
      });
    }
  }

  // Add displayName
  const translateObj = allTranslations.filter(obj => {
    return obj.locale.USen.toLowerCase() === item.name.toLowerCase();
  });
  if (translateObj.length) {
    item.displayName = translateObj[0].locale.JPja;
  } else {
    item.displayName = item.name;
  }

  if (item.displayName === "uchiwa fan") item.displayName = "うちわ";

  //
  // 翻訳
  //

  // Source
  if (item.source) {
    item.sourceJa = [];
    item.source.forEach(source => {
      item.sourceJa.push(sourceTranslation[source] || source);
    });
  } else if (item.variants && item.variants[0].source) {
    item.variants[0].sourceJa = [];
    item.variants[0].source.forEach(source => {
      item.variants[0].sourceJa.push(sourceTranslation[source] || source);
    });
  }
  // SourceNotes
  if (item.sourceNotes) {
    item.sourceNotesJa =
      sourceNoteTranslation[item.sourceNotes] || item.sourceNotes;
  }
});

//
// Sort items
//

// localeCompare
content.sort(function(a, b) {
  return a.displayName.localeCompare(b.displayName);
});

// 日本語ソート
function hiraToKana(str) {
  return str.replace(/[\u3041-\u3096]/g, function(match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}
function daku_conv(str) {
  str = str.normalize("NFD");
  str = str.replace(/[\u3099\u309A]/g, "");
  return str;
}
function choon_conv(str) {
  let a = str.substr(0, 1);
  for (var i = 1; i < str.length; i++) {
    let t = str.substr(i, 1);
    if (t == "ー") {
      const mae = str.substr(i - 1, 1);
      if (mae.match(/[アカサタナハマヤラワガザダバパァャ]/)) {
        t = "ア";
      } else if (mae.match(/[イキシチニヒミリギジヂビピィ]/)) {
        t = "イ";
      } else if (mae.match(/[ウクスツヌフムユルグズヅブプゥュ]/)) {
        t = "ウ";
      } else if (mae.match(/[エケセテネヘメレゲゼデベペェ]/)) {
        t = "エ";
      } else if (mae.match(/[オコソトノホモヨロゴゾドボポォョ]/)) {
        t = "オ";
      }
    }
    a += t;
  }

  return a;
}
function conversion(str) {
  str = choon_conv(str);
  str = hiraToKana(str);
  str = daku_conv(str);
  return str;
}
content.sort(function(c, d) {
  const a = c.displayName;
  const b = d.displayName;
  if (a == b) {
    return 0;
  }
  let ca = conversion(a);
  let cb = conversion(b);
  if (ca == cb) {
    ca = a;
    cb = b;
  }
  if (ca > cb) {
    return 1;
  } else {
    return -1;
  }
});

// アルファベットを日本語の後ろに
content.sort(function(a, b) {
  const isAlfabetA = a.displayName.slice(0, 1).match(/[^a-zA-Z]/gi);
  const isAlfabetB = b.displayName.slice(0, 1).match(/[^a-zA-Z]/gi);
  if (!isAlfabetA && isAlfabetB) {
    return 1;
  }
  if (isAlfabetA && !isAlfabetB) {
    return -1;
  }
  return 0;
});

// Write file
fs.writeFileSync("./src/assets/items.json", JSON.stringify(content));
