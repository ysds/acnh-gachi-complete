const fs = require("fs");
const { array_move, numberWithCommas } = require("./utils.js");
const { sortItemsByName } = require("./sort.js");

//
// Load Json
//

let allItems = [].concat(
  require("../data/item-data/items.json"),
  require("../data/item-data/recipes.json"),
  require("../data/item-data/creatures.json"),
  require("../data/item-data/reactions.json"),
  require("../data/item-data/achievements.json"),
  require("../data/item-data/request.json")
);

const translation = {
  itemName: require("../data/translation-json/item-name.json"),
  variantBody: require("../data/translation-json/variant-body.json"),
  variantBodyTitle: require("../data/translation-json/variant-body-title.json"),
  variantPattern: require("../data/translation-json/variant-pattern.json"),
  variantPatternTitle: require("../data/translation-json/variant-pattern-title.json"),
  variantFassion: require("../data/translation-json/variant-fassion.json"),
  reaction: require("../data/translation-json/reaction.json"),
  achievements: require("../data/translation-json/achievements.json"),
  source: require("../data/translation-custom/source.json"),
  sourceNotes: require("../data/translation-custom/sourceNotes.json"),
  seasonEvent: require("../data/translation-custom/seasonEvent.json"),
  shadow: require("../data/translation-custom/shadow.json"),
  whereHow: require("../data/translation-custom/whereHow.json"),
  weather: require("../data/translation-custom/weather.json"),
  npcName: require("../data/translation-src/npc/STR_NNpcName.json"),
  request: require("../data/translation-json/request.json"),
  fixData: require("../data/translation-custom/fix.json"),
};

const removeTranslation = JSON.parse(JSON.stringify(translation));
const newTranslation = JSON.parse(JSON.stringify(translation));
const customTranslations = [
  "sourceNotes",
  "seasonEvent",
  "shadow",
  "whereHow",
  "weather",
];

const customAchievementData = require("../data/item-data-custom/achievements.json");
const customNpcImageData = require("../data/item-data-custom/npc-icon.json");

const oldItems = require("../src/assets/items.json");

// DIY素材辞書
// ※「タンク」と「タンクトップ」などnameが同じアイテムは今のところ素材にならないので考慮しない
const materialsDict = {};
allItems.forEach((item) => {
  let internalId;
  let image;
  if (
    item.sourceSheet === "Recipes" ||
    item.sourceSheet === "Reactions" ||
    item.sourceSheet === "Achievements"
  ) {
    // 素材にならないアイテムは除外
    return;
  } else if (item.clothGroupId) {
    // 「ゴールデンアーマー」などのファッションアイテム
    internalId = "Fassion_" + item.clothGroupId;
    image = item.variants[0].storageImage;
  } else if (item.internalId) {
    // 「ヒラメ」などの生き物
    internalId = item.internalId;
    image = item.iconImage;
  } else if (item.variants && item.variants.length > 0) {
    // 上記以外の素材
    internalId = item.variants[0].internalId;
    image =
      item.variants[0].image ||
      item.variants[0].storageImage ||
      item.variants[0].albumImage ||
      item.variants[0].inventoryImage;
  }
  materialsDict[item.name] = { internalId: internalId, image: image };
});

// 写真に追加する住民データ辞書
const npcDict = {};
[]
  .concat(
    require("../data/npc-data/NmlNpcParam.bcsv.json"),
    require("../data/npc-data/SpNpcParam.bcsv.json")
  )
  .forEach((npc) => {
    // 性格（ノーマル住民のみ）
    let personality = null;
    if (npc.NpcLooks) {
      switch (npc.NpcLooks) {
        case "Boy_active":
          personality = "ハキハキ";
          break;
        case "Boy_normal":
          personality = "ぼんやり";
          break;
        case "Boy_pride":
          personality = "コワイ";
          break;
        case "Boy_snobby":
          personality = "キザ";
          break;
        case "Girl_active":
          personality = "元気";
          break;
        case "Girl_big_sis":
          personality = "アネキ";
          break;
        case "Girl_normal":
          personality = "普通";
          break;
        case "Girl_pride":
          personality = "オトナ";
          break;
        default:
          console.log(`UnknowPpersonality: ${npc.NpcLooks}`);
      }
    }
    // 誕生日
    const birthday = npc.BirthMonth + "月" + npc.BirthMDay + "日";
    npcDict[npc.BromideItemId] = {
      personality: personality,
      birthday: birthday,
    };
  });

//
// items データ生成
//

allItems.forEach((item) => {
  //
  // リメイクバリエーションの整理
  //

  // Tools の 日本語リメイク名配列を追加とリメイクバリエーションの削除 (customizeVariants)
  if (item.customize && item.sourceSheet === "Tools/Goods") {
    const customizeVariants = [];
    item.variants.forEach((variant) => {
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
    item.bodyTitle = translation.variantBodyTitle[item.variants[0].internalId];
    if (!translation.variantBodyTitle[item.variants[0].internalId]) {
      console.log(`NoCustomizeVariantTitle: ${item.name}`);
    }
    item.variants.length = 1;
  }

  // Photos の 日本語リメイク名配列を追加とリメイクバリエーションの削除 (customizeVariants)
  // 性格と誕生日もついでに追加
  if (item.sourceSheet === "Photos") {
    // しゃしんはinternalIdの最小値6426(さくらじま)しか翻訳データが無い
    const photoInternalId = "6426";
    const customizeVariants = [];
    for (let i = 0; i < item.variants.length; i++) {
      customizeVariants.push(
        translation.variantBody[photoInternalId + "_" + i]
      );
    }
    item.customizeVariants = customizeVariants;
    item.bodyTitle = translation.variantBodyTitle[photoInternalId];
    item.variants.length = 1;
    const npc = npcDict[item.variants[0].internalId];
    if (npc) {
      item.personality = npc.personality;
      item.birthday = npc.birthday;
    } else {
      console.log(`NoNpcData: ${item.name}`);
    }
  }

  // 家具の日本語リメイク名配列を追加とリメイクバリエーションの削除 (patternVariants)
  if (item.variants && item.patternCustomize) {
    let prevVariation = "";
    let newVariants = item.variants.filter((variant) => {
      const result = prevVariation !== variant.variation;
      prevVariation = variant.variation;
      return result;
    });
    item.patternVariants =
      translation.variantPattern[item.variants[0].internalId];
    if (!translation.variantPattern[item.variants[0].internalId]) {
      console.log(`NoPatternVariant: ${item.name}`);
    }
    item.patternTitle =
      translation.variantPatternTitle[item.variants[0].internalId];
    if (!translation.variantPatternTitle[item.variants[0].internalId]) {
      console.log(`NoPatternVariantTitle: ${item.name}`);
    }
    item.variants = newVariants;
  }

  // 家具の日本語リメイク名配列を追加とリメイクバリエーションの削除 (bodyVariants)
  if (item.variants && item.variants.length > 1 && item.cyrusCustomizePrice) {
    const bodyVariants = [];
    item.variants.forEach((variant) => {
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
    item.bodyTitle = translation.variantBodyTitle[item.variants[0].internalId];
    if (!translation.variantBodyTitle[item.variants[0].internalId]) {
      console.log(`NoBodyVariantTitle: ${item.name}`);
    }
    if (item.variants[0].bodyCustomize) {
      item.bodyCustomize = true;
      if (item.diy || item.catalog === "For sale" || item.catalog === true) {
        item.variants.length = 1;
      }
    }
  }

  //
  // たぬきマイレージデータ生成
  //

  if (item.sourceSheet === "Achievements") {
    // description
    item.achievementDescription =
      translation.achievements[item.internalId].desc;

    // よみがな
    item.yomigana = translation.achievements[item.internalId].yomi;

    // parseInt num
    item.num = parseInt(item.num, 10);

    // Marge custom data
    const customData = customAchievementData[item.internalId];
    item = Object.assign(item, customData);
    if (!customData) {
      console.log(`NoCustomAchievements: ${item.name}`);
    }

    // Gen variants
    delete item["uniqueEntryId"];
    item.variants = [];
    const numOfTiers = parseInt(item.numOfTiers, 10);
    for (let i = 1; i <= numOfTiers; i++) {
      const variant = {};
      variant.vName = numberWithCommas(item[`tier${i}`]);
      variant.stampImage = item[`tier${i}Icon`];
      variant.uniqueEntryId = i;
      item.variants.push(variant);
    }
  }

  //
  // データ整理
  //

  // Version fix
  if (item.name.match(/midwinter sweater|sunflower crown/g)) {
    item.versionAdded = "1.6.0";
  }

  // 重複データの共通データ化
  if (item.variants) {
    const copyKeys = ["source", "buy", "sell"];
    const variant = item.variants[0];
    copyKeys.forEach((key) => {
      if (variant[key]) {
        item[key] = variant[key];
      }
    });
  }

  // 未使用の variant の uniqueEntryId を単純化（ファイルサイズ削減のため）
  // v-for の key のために index を付与
  if (item.variants) {
    item.variants.forEach((variant, index) => {
      if (variant.uniqueEntryId) {
        item.variants[index].uniqueEntryId = index;
      }
    });
  }

  // 特殊レシピの serialId の設定
  if (
    item.name === "bridge construction kit" ||
    item.name === "campsite construction kit"
  ) {
    item.serialId = item.serialId + 20000;
  }

  //
  // 翻訳
  //

  // Add displayName
  let itemName;
  if (item.sourceSheet === "Recipes") {
    const items = allItems.filter((craftedItem) => {
      return craftedItem.name === item.name;
    });
    itemName = items[0].displayName;
  } else if (item.sourceSheet === "Paradise Planning") {
    itemName = translation.npcName[item.filename];
  } else if (item.sourceSheet === "Reactions") {
    itemName = translation.reaction[item.iconFilename];
  } else if (item.sourceSheet === "Achievements") {
    itemName = translation.achievements[item.internalId].name;
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
  }

  // Source
  if (item.source) {
    item.sourceJa = [];
    item.source.forEach((source) => {
      if (source !== "" && translation.source[source] === undefined) {
        newTranslation.source[source] = "";
      } else {
        item.sourceJa.push(translation.source[source]);
        delete removeTranslation.source[source];
      }
    });
  }

  // Materials(DIY素材)
  if (item.materials) {
    const materialsJa = [];
    for (const [k, v] of Object.entries(item.materials)) {
      let materialName;
      let image;
      if (materialsDict[k] && materialsDict[k].internalId) {
        materialName = translation.itemName[materialsDict[k].internalId];
        if (!materialName) {
          console.log(`NoMaterialName: ${k}`);
          continue;
        }
        image = materialsDict[k].image;
      } else {
        if (k.endsWith("Bells")) {
          // 「おさつのやま」などのベル素材
          materialName = k.split(" ")[0] + "ベル";
          image = materialsDict["Bell bag"].image;
        } else if (k.endsWith("turnips")) {
          // 「せんまいづけのたる」などのカブ素材
          materialName = k.split(" ")[0] + "カブ";
          image = materialsDict["turnips"].image;
        } else {
          console.log(`NoInternalId: ${k}`);
          continue;
        }
      }
      materialsJa.push({ name: materialName, image: image, num: v });
    }
    item.materialsJa = materialsJa;
    // 作成後アイテムにも設定
    allItems.forEach((craftedItem) => {
      if (
        craftedItem.diy &&
        item.craftedItemInternalId === craftedItem.variants[0].internalId
      ) {
        craftedItem.materialsJa = materialsJa;
      }
    });
  }

  // customTranslations
  customTranslations.forEach((key) => {
    const value = item[key];
    if (value) {
      let ja = translation[key][value];
      if (typeof ja === "object") {
        ja = translation[key][value].text;
      }
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
        item.variants[index].vName =
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
        item.variants[index].vName =
          translation.variantBody[variantId] || variant.variation;

        if (!translation.variantBody[variantId]) {
          console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
        }
      } else if (
        variant.genuine === undefined &&
        item.displayName !== "おとしもの" &&
        item.displayName !== "なんだっけ？" &&
        item.displayName !== "おとどけもの" &&
        item.sourceSheet !== "Achievements"
      ) {
        console.log(`NoVariant: ${item.displayName} : ${variant.variation}`);
      }
    });
  }

  //
  // ハピパラプランニングデータ生成
  //

  // 画像に住民アイコン画像を設定
  if (item.sourceSheet === "Paradise Planning") {
    const variant = {
      uniqueEntryId: 0,
      image: customNpcImageData[item.name],
      request: translation.request[item.request],
    };
    item.variants = [variant];
    // 追加バージョンを設定
    if (!item.versionAdded) {
      item.versionAdded = "2.0.0";
    }
  }

  // 本物/偽物 ＆ Egg balloon を Egg balloons に統合
  if (item.variants) {
    item.variants.forEach((variant, i) => {
      if (variant.genuine === true) item.variants[i].genuine = "本物";
      if (variant.genuine === false) item.variants[i].genuine = "偽物";
      if (variant.source && variant.source[0] === "Egg balloon")
        item.variants[i].source[0] = "Egg balloons";
    });
  }

  //
  // タンク（家具）の同名問題の対処
  //

  if (item.name === "tank" && item.sourceSheet === "Housewares") {
    item.name = "tankHousewares";
  }

  //
  // Remove keys
  //

  // false and null keys
  Object.keys(item).forEach((key) => {
    if (item[key] === false || item[key] === null) {
      delete item[key];
    }
  });
});

//
// 特殊アイテムの削除
//

const removeItems = require("../data/item-data-custom/removeItems.json");
allItems = allItems.filter(
  (item) => !(removeItems[item.name] && item.sourceSheet !== "Recipes")
);

// 一部特殊アイテムを「収納できない」に格納

const unStoragableItems = require("../data/item-data-custom/unStoragableItems.json");
allItems.forEach((item)=> {
  if (unStoragableItems[item.name]) {
    item.sourceSheet = "Un-Storagable"
    item.displayName = unStoragableItems[item.name]
  }
})

//
// どのカテゴリにも属さないアイテムの抽出
//

const { navsFlat } = require("../src/utils/navs");

let uncategorizedItems = allItems;

Object.values(navsFlat).forEach((nav) => {
  if (
    (!nav.id.match(/special|season|nookpoints|hhp|versions/) &&
      nav.filter !== undefined) ||
    nav.id === "hhp-request"
  ) {
    uncategorizedItems = uncategorizedItems.filter((item) => {
      return !nav.filter(item);
    });
  }
});

if (uncategorizedItems.length > 0) {
  console.log(`Uncategorized Items: ${uncategorizedItems.length}`);
  uncategorizedItems.forEach((item) => {
    console.log(item.name);
  });
}

//
// Remove Unused Keys
//
allItems.forEach((item) => {
  delete item["achievementCriteria"];
  delete item["cardColor"];
  delete item["catchDifficulty"];
  delete item["catchPhrase"];
  delete item["ceilingType"];
  delete item["clothGroupId"];
  delete item["colors"];
  delete item["craftedItemInternalId"];
  delete item["critterpediaFilename"];
  delete item["critterpediaImage"];
  delete item["curtainColor"];
  delete item["curtainType"];
  delete item["customizationKitCost"];
  delete item["description"];
  delete item["diyIconFilename"];
  delete item["doorDeco"];
  delete item["fossilGroup"];
  delete item["furnitureFilename"];
  delete item["furnitureImage"];
  delete item["gender"];
  delete item["hhaBasePoints"];
  delete item["hhaCategory"];
  delete item["iconFilename"];
  delete item["interact"];
  delete item["internalCategory"];
  delete item["internalId"];
  delete item["internalName"];
  delete item["kitType"];
  delete item["LandMaking"];
  delete item["lightingType"];
  delete item["mannequinPiece"];
  delete item["mannequinSeason"];
  delete item["materials"];
  delete item["milesPrice"];
  delete item["movementSpeed"];
  delete item["museum"];
  delete item["numOfTiers"];
  delete item["outdoor"];
  delete item["paneType"];
  delete item["primaryShape"];
  delete item["recipesToUnlock"];
  delete item["seasonalAvailability"];
  delete item["seasonality"];
  delete item["seasonEventExclusive"];
  delete item["secondaryShape"];
  delete item["sequential"];
  delete item["set"];
  delete item["size"];
  delete item["sizeCategory"];
  delete item["sortOrder"];
  delete item["sourceNotes"];
  delete item["spawnRates"];
  delete item["speakerType"];
  delete item["specialSell"];
  delete item["stackSize"];
  delete item["style"];
  delete item["style1"];
  delete item["style2"];
  delete item["surface"];
  delete item["totalCatchesToUnlock"];
  delete item["unlocked"];
  delete item["unlockNotes"];
  delete item["uses"];
  delete item["versionUnlocked"];
  delete item["vfx"];
  delete item["vfxType"];
  delete item["villagerEquippable"];
  delete item["villagerGender"];
  delete item["vision"];
  delete item["windowColor"];
  delete item["windowType"];
  delete item["furnitureNameList"];
  delete item["furnitureList"];
  delete item["filename"];
  delete item["thoughtBubble"];
  delete item["song"];
  delete item["request"];

  if (item.sourceSheet !== "Other") {
    delete item["tag"];
  }

  for (let i = 1; i < 7; i++) {
    delete item[`tier${i}`];
    delete item[`tier${i}Reward`];
    delete item[`tier${i}Modifier`];
    delete item[`tier${i}Noun`];
    delete item[`tier${i}Icon`];
  }

  if (item.variants) {
    item.variants.forEach((variant) => {
      delete variant["bodyCustomize"];
      delete variant["bodyTitle"];
      delete variant["buy"];
      delete variant["closetImage"];
      delete variant["colors"];
      delete variant["filename"];
      delete variant["framedImage"];
      delete variant["internalId"];
      delete variant["labelThemes"];
      delete variant["pattern"];
      delete variant["sell"];
      delete variant["source"];
      delete variant["themes"];
      delete variant["variantId"];
      delete variant["variation"];
    });
  }
});

//
// Sort keys
//

allItems = allItems.map(function (item) {
  const keys = Object.keys(item);
  array_move(keys, keys.indexOf("displayName"), 2);
  array_move(keys, keys.indexOf("source"), 3);
  array_move(keys, keys.indexOf("buy"), 4);
  array_move(keys, keys.indexOf("sell"), 5);
  const newItem = {};
  keys.forEach((x) => {
    newItem[x] = item[x];
  });
  return newItem;
});

//
// Sort items
//

sortItemsByName(allItems);

//
// Rename check
//

const renamedItems = oldItems.filter((item) => {
  const name = item.name;
  const find = allItems.find((newItem) => newItem.name === name);
  const isRenamed = find ? false : true;

  return isRenamed;
});

if (renamedItems.length > 0) {
  console.log("Renamed Items:");
  console.log(renamedItems);
}

//
// Write file
//

allItems = JSON.stringify(allItems, null, 2);

allItems = allItems.replace(/https:\/\/acnhcdn.com\/latest\//g, "");
allItems = allItems.replace(/https:\/\/acnhcdn.com\/1.2.0\//g, "");
allItems = allItems.replace(/https:\/\/acnhapi.com\/latest\//g, "");

fs.writeFileSync("./src/assets/items.json", allItems);

//
// Update custom translation files
//

customTranslations.push("source");
customTranslations.forEach((translationKey) => {
  let output = newTranslation[translationKey];

  Object.keys(removeTranslation[translationKey]).forEach(function (key) {
    delete output[key];
  });

  if (translationKey === "sourceNotes") {
    output = Object.keys(output)
      .sort()
      .reduce(function (result, key) {
        result[key] = output[key];
        return result;
      }, {});
  }

  fs.writeFileSync(
    `./data/translation-custom/${translationKey}.json`,
    JSON.stringify(output, null, 2)
  );
});
