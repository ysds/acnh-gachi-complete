const fs = require("fs");
const {
  hiraToKana,
  hanEisuToZenEisu,
  daku_conv,
  choon_conv,
  tsu_conv,
  array_move
} = require("./utils.js");

//
// Load Json
//

let allItems = [].concat(
  require("../data/item-data/items.json"),
  require("../data/item-data/recipes.json"),
  require("../data/item-data/creatures.json"),
  require("../data/item-data/reactions.json")
);

const translation = {
  itemName: require("../data/translation-json/item-name.json"),
  variantBody: require("../data/translation-json/variant-body.json"),
  variantPattern: require("../data/translation-json/variant-pattern.json"),
  variantFassion: require("../data/translation-json/variant-fassion.json"),
  reaction: require("../data/translation-json/reaction.json"),
  source: require("../data/translation-custom/source.json"),
  sourceNotes: require("../data/translation-custom/sourceNotes.json"),
  seasonEvent: require("../data/translation-custom/seasonEvent.json"),
  shadow: require("../data/translation-custom/shadow.json"),
  whereHow: require("../data/translation-custom/whereHow.json"),
  weather: require("../data/translation-custom/weather.json"),
  fixData: require("../data/translation-custom/fix.json")
};

const removeTranslation = JSON.parse(JSON.stringify(translation));
const newTranslation = JSON.parse(JSON.stringify(translation));
const customTranslations = [
  "sourceNotes",
  "seasonEvent",
  "shadow",
  "whereHow",
  "weather"
];

//
// Each items
//

allItems.forEach(item => {
  // Remove photos & tools variant and add translation
  if (item.customize && item.sourceSheet === "Tools") {
    const customizeVariants = [];
    item.variants.forEach(variant => {
      const variantIdArray = variant.variantId.slice("_");
      const variantId = `${variant.internalId}_${variantIdArray[0]}`;
      customizeVariants.push(
        translation.variantBody[variantId] || variant.variation
      );
      if (!translation.variantBody[variantId]) {
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
      item.patternVariants =
        translation.variantPattern[item.variants[0].internalId];
      if (!translation.variantPattern[item.variants[0].internalId]) {
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
        bodyVariants.push(
          translation.variantBody[variantId] || variant.variation
        );
        if (!translation.variantBody[variantId]) {
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
  } else if (item.sourceSheet === "Reactions") {
    itemName = translation.reaction[item.iconFilename];
  } else if (item.clothGroupId) {
    itemName = translation.itemName[`Fassion_${item.clothGroupId}`];
  } else if (item.variants) {
    itemName = translation.itemName[item.variants[0].internalId];
  } else {
    itemName = translation.itemName[item.internalId];
  }
  if (translation.fixData[item.name]) {
    itemName = translation.fixData[item.name];
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
      item.sourceJa.push(translation.source[source]);
      if (source !== "" && translation.source[source] === undefined) {
        console.log(`NoSource: ${item.name}: ${source}`);
      }
    });
  } else if (item.variants && item.variants[0].source) {
    item.variants[0].sourceJa = [];
    item.variants[0].source.forEach(source => {
      item.variants[0].sourceJa.push(translation.source[source] ?? source);
      if (source !== "" && translation.source[source] === undefined) {
        console.log(`NoSource: ${item.name}: ${source}`);
      }
    });
  }

  customTranslations.forEach(key => {
    const value = item[key];
    if (value) {
      const ja = translation[key][value];
      if (ja !== undefined) {
        if (ja !== "") {
          item[`${key}Ja`] = ja;
        }
        delete removeTranslation[key][value];
      } else {
        item[`${key}Ja`] = value;
        newTranslation[key][value] = "";
      }
    }
  });

  // Add variation displayName
  if (item.clothGroupId && item.variants.length > 1) {
    item.variants.forEach((variant, index) => {
      if (variant.internalId) {
        const internalId = variant.internalId;
        item.variants[index].variationDisplayName =
          translation.variantFassion[internalId] || variant.variation;

        if (!translation.variantFassion[internalId]) {
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
          translation.variantBody[variantId] || variant.variation;

        if (!translation.variantBody[variantId]) {
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
      delete variant["variation"];
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

function conversion(str) {
  str = hiraToKana(str);
  str = hanEisuToZenEisu(str);
  str = tsu_conv(str);
  str = choon_conv(str);
  str = daku_conv(str);
  return str;
}

// 日本語ソート
allItems.sort(function(a, b) {
  const ca = conversion(a.displayName);
  const cb = conversion(b.displayName);
  if (ca == cb) return 0;
  if (ca > cb) {
    return 1;
  } else {
    return -1;
  }
});

// 数字で始まるアイテムを先頭に持ってくる（例：１ごうのしゃしん）
allItems.sort(function(a, b) {
  const isAlfabetA = a.displayName.slice(0, 1).match(/[^0-9０-９]/gi);
  const isAlfabetB = b.displayName.slice(0, 1).match(/[^0-9０-９]/gi);
  if (!isAlfabetA && isAlfabetB) {
    return -1;
  }
  if (isAlfabetA && !isAlfabetB) {
    return 1;
  }
  return 0;
});

//
// Write file
//

fs.writeFileSync("./src/assets/items.json", JSON.stringify(allItems, null, 2));

// Update custom translation files
customTranslations.forEach(translationKey => {
  const unordered = newTranslation[translationKey];

  Object.keys(removeTranslation[translationKey]).forEach(function(key) {
    delete unordered[key];
  });

  const ordered = Object.keys(unordered)
    .sort()
    .reduce(function(result, key) {
      result[key] = unordered[key];
      return result;
    }, {});

  fs.writeFileSync(
    `./data/translation-custom/${translationKey}.json`,
    JSON.stringify(ordered, null, 2)
  );
});
