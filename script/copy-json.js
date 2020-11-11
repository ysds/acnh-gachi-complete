const fs = require("fs");
const {
  hiraToKana,
  daku_conv,
  choon_conv,
  tsu_conv,
  array_move
} = require("./utils.js");

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

content = content.concat(
  JSON.parse(fs.readFileSync("./json/item-data/creatures.json", "utf8"))
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

const shadowTranslation = JSON.parse(
  fs.readFileSync(`./json/translation-fix-data/shadow.json`, "utf8")
);

const whereTranslation = JSON.parse(
  fs.readFileSync(`./json/translation-fix-data/where.json`, "utf8")
);

const weatherTranslation = JSON.parse(
  fs.readFileSync(`./json/translation-fix-data/weather.json`, "utf8")
);

// Each items
content.forEach(item => {
  // Remove photos and tools variant
  if (item.customize) {
    item.customizeVariants = [];
    item.variants.forEach(variant => {
      item.customizeVariants.push(variant.variation);
    });
    item.variants.length = 1;
  }

  if (item.variants) {
    // Remove pattern variant
    if (item.patternCustomize) {
      let prevVariation = "";
      let newVariants = item.variants.filter(variant => {
        // Create patternVariants key
        if (item.patternVariants && variant.pattern !== null) {
          if (!item.patternVariants.includes(variant.pattern)) {
            item.patternVariants.push(variant.pattern);
          }
        } else {
          item.patternVariants = [
            variant.pattern === null ? "None" : variant.pattern
          ];
        }

        const result = prevVariation !== variant.variation;
        prevVariation = variant.variation;
        return result;
      });
      item.variants = newVariants;
    }

    // Remove body variant
    if (item.variants[0].bodyCustomize) {
      item.variants.forEach(variant => {
        if (item.bodyVariants && variant.variation !== null) {
          item.bodyVariants.push(variant.variation);
        } else {
          item.bodyVariants = [
            variant.variation === null ? "None" : variant.variation
          ];
        }
      });
      item.bodyCustomize = true;
      if (item.diy || item.catalog === "For sale" || item.catalog === true) {
        item.variants.length = 1;
      }
    }
  }

  // Add displayName
  const translateObj = allTranslations.filter(obj => {
    if (typeof obj.locale.USen === "string") {
      return obj.locale.USen.toLowerCase() === item.name.toLowerCase();
    } else {
      return null;
    }
  });
  if (translateObj.length) {
    item.displayName = translateObj[0].locale.JPja;
  } else {
    item.displayName = item.name;
  }

  if (item.displayName === "uchiwa fan") item.displayName = "うちわ";
  if (item.displayName === "わ") item.displayName = "ゆびわ";

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
  // Shadow
  if (item.shadow) {
    item.shadowJa = shadowTranslation[item.shadow] || item.shadow;
  }
  // Where
  if (item.whereHow) {
    item.whereHowJa = whereTranslation[item.whereHow] || item.whereHow;
  }
  // Whether
  if (item.weather) {
    item.weatherJa = weatherTranslation[item.weather] || item.weather;
  }
  // Add variation displayName
  const furnitureTranslations = allTranslations.filter(obj => {
    if (obj.furniture_name) {
      return obj.furniture_name.toLowerCase() === item.name.toLowerCase();
    }
    return false;
  });
  if (item.variants) {
    item.variants.forEach((variant, index) => {
      item.variants[index].variationDisplayName = variant.variation;
      furnitureTranslations.forEach(translate => {
        if (
          variant.variation &&
          typeof translate.locale.USen === "string" &&
          translate.locale.USen.toLowerCase() ===
            variant.variation.toLowerCase()
        ) {
          item.variants[index].variationDisplayName = translate.locale.JPja;
        }
      });
    });
    // 二回目
    item.variants.forEach((variant, index) => {
      allTranslations.forEach(translate => {
        if (
          variant.variationDisplayName &&
          typeof translate.locale.USen === "string" &&
          typeof variant.variationDisplayName === "string" &&
          translate.locale.USen.toLowerCase() ===
            variant.variationDisplayName.toLowerCase()
        ) {
          item.variants[index].variationDisplayName = translate.locale.JPja;
        }
      });
      if (item.name === "jockey uniform" && variant.variation === "Ring") {
        item.variants[index].variationDisplayName = "わ";
      }
      if (item.name === "essay set" && variant.variation === "Blank") {
        item.variants[index].variationDisplayName = "白紙";
      }
    });
  }
  // Body variants
  if (item.bodyCustomize) {
    let newBodyVariants = [];
    item.bodyVariants.forEach(variantString => {
      const translations = furnitureTranslations.filter(translate => {
        return (
          translate.locale.USen.toLowerCase() === variantString.toLowerCase()
        );
      });
      if (translations.length > 0) {
        newBodyVariants.push(translations[0].locale.JPja);
      } else {
        newBodyVariants.push(variantString);
      }
    });
    item.bodyVariants = newBodyVariants;

    // 二回目
    newBodyVariants = [];
    item.bodyVariants.forEach(variantString => {
      const translations = allTranslations.filter(translate => {
        return (
          typeof translate.locale.USen === "string" &&
          translate.locale.USen.toLowerCase() === variantString.toLowerCase()
        );
      });
      if (translations.length > 0) {
        newBodyVariants.push(translations[0].locale.JPja);
      } else {
        newBodyVariants.push(variantString);
      }
    });
    item.bodyVariants = newBodyVariants;
  }

  // Pattern variants
  if (item.patternCustomize) {
    let newPatternVariants = [];
    item.patternVariants.forEach(variantString => {
      const translations = furnitureTranslations.filter(translate => {
        return translate.locale.USen === variantString;
      });
      if (translations.length > 0) {
        newPatternVariants.push(translations[0].locale.JPja);
      } else {
        newPatternVariants.push(variantString);
      }
    });
    item.patternVariants = newPatternVariants;

    // 二回目
    newPatternVariants = [];
    item.patternVariants.forEach(variantString => {
      const translations = allTranslations.filter(translate => {
        return (
          typeof translate.locale.USen === "string" &&
          translate.locale.USen === variantString
        );
      });
      if (translations.length > 0) {
        newPatternVariants.push(translations[0].locale.JPja);
      } else {
        newPatternVariants.push(variantString);
      }
    });
    item.patternVariants = newPatternVariants;
  }

  // Customize variants
  if (item.customize) {
    let newCustomizeVariants = [];
    item.customizeVariants.forEach(variantString => {
      const translations = furnitureTranslations.filter(translate => {
        return translate.locale.USen === variantString;
      });
      if (translations.length > 0) {
        newCustomizeVariants.push(translations[0].locale.JPja);
      } else {
        newCustomizeVariants.push(variantString);
      }
    });
    item.customizeVariants = newCustomizeVariants;

    // 二回目
    newCustomizeVariants = [];
    item.customizeVariants.forEach(variantString => {
      const translations = allTranslations.filter(translate => {
        return (
          typeof translate.locale.USen === "string" &&
          translate.locale.USen === variantString
        );
      });
      if (translations.length > 0) {
        newCustomizeVariants.push(translations[0].locale.JPja);
      } else if (variantString === "Yellow & orange") {
        newCustomizeVariants.push("イエロー×オレンジ");
      } else if (variantString === "Orange & blue") {
        newCustomizeVariants.push("オレンジ×ブルー");
      } else if (variantString === "Gray & green") {
        newCustomizeVariants.push("グレー×グリーン");
      } else {
        newCustomizeVariants.push(variantString);
      }
    });
    item.customizeVariants = newCustomizeVariants;
  }

  //
  // Remove unused keys
  //

  // Housewares
  delete item["patternTitle"];
  delete item["size"];
  delete item["surface"];
  delete item["milesPrice"];
  delete item["hhaBasePoints"];
  delete item["hhaCategory"];
  delete item["interact"];
  delete item["tag"];
  delete item["outdoor"];
  delete item["speakerType"];
  delete item["lightingType"];
  delete item["set"];
  delete item["customizationKitCost"];
  delete item["versionUnlocked"];
  // Wall-mounted
  delete item["doorDeco"];
  // Wallpaper
  delete item["vfx"];
  delete item["vfxType"];
  delete item["windowType"];
  delete item["windowColor"];
  delete item["paneType"];
  delete item["curtainType"];
  delete item["curtainColor"];
  delete item["ceilingType"];
  // Rugs
  delete item["sizeCategory"];
  // ファッション
  delete item["seasonalAvailability"];
  delete item["mannequinPiece"];
  delete item["style"];
  delete item["sortOrder"];
  delete item["villagerEquippable"];
  delete item["clothGroupId"];
  delete item["primaryShape"];
  delete item["secondaryShape"];
  // かせき
  delete item["description"];
  delete item["museum"];
  // レシピ
  delete item["recipesToUnlock"];
  delete item["craftedItemInternalId"];
  delete item["cardColor"];
  delete item["serialId"];
  delete item["internalId"];
  delete item["materials"];
  // Insects
  delete item["num"];
  delete item["critterpediaImage"];
  delete item["furnitureImage"];
  delete item["totalCatchesToUnlock"];
  delete item["spawnRates"];
  delete item["catchPhrase"];
  delete item["iconFilename"];
  delete item["critterpediaFilename"];
  delete item["furnitureFilename"];
  delete item["colors"];
  delete item["specialSell"];
  // Fish
  delete item["catchDifficulty"];
  delete item["vision"];
  // Sea Creatures
  delete item["movementSpeed"];
  // Tools
  delete item["uses"];
  delete item["stackSize"];

  if (item.variants) {
    item.variants.forEach(variant => {
      delete variant["filename"];
      delete variant["variantId"];
      delete variant["colors"];
      delete variant["bodyTitle"];
      delete variant["internalId"];
      delete variant["closetImage"];
      delete variant["labelThemes"];
      delete variant["framedImage"];
      delete variant["inventoryImage"];
      delete variant["themes"];
      delete variant["bodyCustomize"];
      delete variant["pattern"];
    });
  }
});

//
// Sort displayName key
//
content = content.map(function(item) {
  const keys = Object.keys(item);
  array_move(keys, keys.indexOf("displayName"), 2);
  const newItem = {};
  keys.forEach(x => {
    newItem[x] = item[x];
  });
  return newItem;
});

//
// Sort items
//

// localeCompare
content.sort(function(a, b) {
  return a.displayName.localeCompare(b.displayName);
});

// 日本語ソート
function conversion(str) {
  str = tsu_conv(str);
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

// Get All source
// let sources = "";
// content.forEach(item => {
//   if (item.source) sources += `¥n${item.source}`;
//   if (item.variants) {
//     item.variants.forEach(variant => {
//       if (variant.source) sources += `¥n${variant.source}`;
//     });
//   }
// });

// fs.writeFileSync("./sources.txt", sources);
