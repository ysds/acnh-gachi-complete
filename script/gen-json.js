const fs = require("fs");
const {
  hiraToKana,
  daku_conv,
  choon_conv,
  tsu_conv,
  array_move
} = require("./utils.js");

// Load Json

let allItems = JSON.parse(
  // fs.readFileSync("./node_modules/@nooksbazaar/acdb/out/items.json", "utf8")
  fs.readFileSync("./data/item-data/items.json", "utf8")
);

allItems = allItems.concat(
  JSON.parse(
    // fs.readFileSync("./node_modules/@nooksbazaar/acdb/out/recipes.json", "utf8")
    fs.readFileSync("./data/item-data/recipes.json", "utf8")
  )
);

allItems = allItems.concat(
  JSON.parse(fs.readFileSync("./data/item-data/creatures.json", "utf8"))
);

const itemNameTranslations = JSON.parse(
  fs.readFileSync(`./script/item-name.json`, "utf8")
);

const bodyTranslations = JSON.parse(
  fs.readFileSync(`./script/variant-body.json`, "utf8")
);

const patternTranslations = JSON.parse(
  fs.readFileSync(`./script/variant-pattern.json`, "utf8")
);

const fassionVariantTranslations = JSON.parse(
  fs.readFileSync(`./script/variant-fassion.json`, "utf8")
);

const sourceTranslation = JSON.parse(
  fs.readFileSync(`./data/translation-fix-data/source.json`, "utf8")
);

const sourceNoteTranslation = JSON.parse(
  fs.readFileSync(`./data/translation-fix-data/sourceNote.json`, "utf8")
);

const seasonEventTranslation = JSON.parse(
  fs.readFileSync(`./data/translation-fix-data/seasonEvent.json`, "utf8")
);

const shadowTranslation = JSON.parse(
  fs.readFileSync(`./data/translation-fix-data/shadow.json`, "utf8")
);

const whereTranslation = JSON.parse(
  fs.readFileSync(`./data/translation-fix-data/where.json`, "utf8")
);

const weatherTranslation = JSON.parse(
  fs.readFileSync(`./data/translation-fix-data/weather.json`, "utf8")
);

const fixData = JSON.parse(
  fs.readFileSync("./data/translation-fix-data/fix.json", "utf8")
);

// Each items
allItems.forEach(item => {
  // Remove photos & tools variant and add translation
  if (item.customize && item.sourceSheet === "Tools") {
    const customizeVariants = [];
    item.variants.forEach(variant => {
      const variantIdArray = variant.variantId.slice("_");
      const variantId = `${variant.internalId}_${variantIdArray[0]}`;
      customizeVariants.push(bodyTranslations[variantId] || variant.variation);
      if (!bodyTranslations[variantId]) {
        console.log(`NoCustomizeVariant: ${item.name} : ${variant.variation}`);
      }
    });
    item.customizeVariants = customizeVariants;
    item.variants.length = 1;
  }
  if (item.sourceSheet === "Photos") {
    item.customizeVariants = [
      "ナチュラルウッド",
      "ダークウッド",
      "パステル",
      "ホワイト",
      "ポップ",
      "カラフル",
      "シルバー",
      "ゴールド"
    ];
    item.variants.length = 1;
  }

  if (item.variants) {
    // Remove pattern variant and add pattern translation
    if (item.patternCustomize) {
      let prevVariation = "";
      let newVariants = item.variants.filter(variant => {
        const result = prevVariation !== variant.variation;
        prevVariation = variant.variation;
        return result;
      });
      item.patternVariants = patternTranslations[item.variants[0].internalId];
      if (!patternTranslations[item.variants[0].internalId]) {
        console.log(`NoPatternVariant: ${item.name}`);
      }
      item.variants = newVariants;
    }

    // Remove body variant and Add bodyVariants translation
    if (item.variants[0].bodyCustomize) {
      const bodyVariants = [];
      item.variants.forEach(variant => {
        const variantIdArray = variant.variantId.slice("_");
        const variantId = `${variant.internalId}_${variantIdArray[0]}`;
        bodyVariants.push(bodyTranslations[variantId] || variant.variation);
        if (!bodyTranslations[variantId]) {
          console.log(`NoBodyVariant: ${item.name} : ${variant.variation}`);
        }
      });
      item.bodyVariants = bodyVariants;
      item.bodyCustomize = true;
      if (item.diy || item.catalog === "For sale" || item.catalog === true) {
        item.variants.length = 1;
      }
    }
  }

  //
  // Version fix
  //

  if (item.name.match(/midwinter sweater|sunflower crown/g)) {
    item.versionAdded = "1.6.0";
  }

  //
  // 翻訳
  //

  // Add displayName
  let itemName;
  if (item.sourceSheet === "Recipes") {
    const items = allItems.filter(craftedItem => {
      return craftedItem.name === item.name;
    });
    itemName = items[0].displayName;
  } else if (item.clothGroupId) {
    itemName = itemNameTranslations[`Fassion_${item.clothGroupId}`];
  } else if (item.variants) {
    itemName = itemNameTranslations[item.variants[0].internalId];
  } else {
    itemName = itemNameTranslations[item.internalId];
  }
  if (fixData[item.name]) {
    itemName = fixData[item.name];
  }
  if (itemName) {
    item.displayName = itemName;
  } else {
    item.displayName = item.name;
    console.log(`NoName: ${item.name}`);
    item.noName = true;
  }

  // Source
  if (item.source) {
    item.sourceJa = [];
    item.source.forEach(source => {
      item.sourceJa.push(sourceTranslation[source]);
      if (source !== "" && sourceTranslation[source] === undefined) {
        console.log(`NoSource: ${item.name}: ${source}`);
      }
    });
  } else if (item.variants && item.variants[0].source) {
    item.variants[0].sourceJa = [];
    item.variants[0].source.forEach(source => {
      item.variants[0].sourceJa.push(sourceTranslation[source] ?? source);
      if (source !== "" && sourceTranslation[source] === undefined) {
        console.log(`NoSource: ${item.name}: ${source}`);
      }
    });
  }
  // SourceNotes
  if (item.sourceNotes) {
    if (sourceNoteTranslation[item.sourceNotes]) {
      item.sourceNotesJa = sourceNoteTranslation[item.sourceNotes];
    }
    if (sourceNoteTranslation[item.sourceNotes] === undefined) {
      console.log(`NoSourceNote: ${item.sourceNotes}`);
    }
  }
  // seasonEvent
  if (item.seasonEvent) {
    item.seasonEventJa =
      seasonEventTranslation[item.seasonEvent] ?? item.seasonEvent;
    if (seasonEventTranslation[item.seasonEvent] === undefined) {
      console.log(`NoSeasonEvent: ${item.seasonEvent}`);
    }
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
  if (item.clothGroupId && item.variants.length > 1) {
    item.variants.forEach((variant, index) => {
      if (variant.internalId) {
        const internalId = variant.internalId;
        item.variants[index].variationDisplayName =
          fassionVariantTranslations[internalId] || variant.variation;

        if (!fassionVariantTranslations[internalId]) {
          console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
        }
      } else {
        console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
      }
    });
  } else if (item.variants && item.variants.length > 1) {
    item.variants.forEach((variant, index) => {
      if (variant.variantId) {
        const variantIdArray = variant.variantId.slice("_");
        const variantId = `${variant.internalId}_${variantIdArray[0]}`;
        item.variants[index].variationDisplayName =
          bodyTranslations[variantId] || variant.variation;

        if (!bodyTranslations[variantId]) {
          console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
        }
      } else if (
        variant.genuine === undefined &&
        item.displayName !== "おとしもの" &&
        item.displayName !== "なんだっけ？"
      ) {
        console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
      }
    });
  }

  //
  // Remove unused keys
  //

  // Housewares
  delete item["seasonEventExclusive"];
  delete item["mannequinSeason"];
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
  delete item["unlockNotes"];
  delete item["unlocked"];
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
      delete variant["themes"];
      delete variant["bodyCustomize"];
      delete variant["pattern"];
    });
  }
});

//
// Sort displayName key
//
allItems = allItems.map(function(item) {
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
allItems.sort(function(a, b) {
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
allItems.sort(function(c, d) {
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
allItems.sort(function(a, b) {
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
fs.writeFileSync("./src/assets/items.json", JSON.stringify(allItems, null, 2));

// Get All source
// let sources = "";
// allItems.forEach(item => {
//   if (item.source) sources += `¥n${item.source}`;
//   if (item.variants) {
//     item.variants.forEach(variant => {
//       if (variant.source) sources += `¥n${variant.source}`;
//     });
//   }
// });

// fs.writeFileSync("./sources.txt", sources);
