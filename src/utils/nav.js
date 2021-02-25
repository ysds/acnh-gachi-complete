import itemsJson from "../assets/items.json";
import navs from "./navs.json";
import { typeFilter } from "./filter";

const { sortItemsByName } = require("../../script/sort.js");

const kata2Hira = function(string) {
  return string.replace(/[\u30A1-\u30FA]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
};

const hankaku2Zenkaku = function(string) {
  return string.replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
};

const normalizeText = function(string) {
  let result = string;
  result = kata2Hira(result);
  result = hankaku2Zenkaku(result);
  return result;
};

// たぬきマイレージ：名前順ソート時の島名置換
const replaceIslandName = function(itemName, item, islandName) {
  if (islandName && hasIslandName(item)) {
    // 島名を置換
    return itemName.replace("〓", islandName);
  } else {
    return itemName;
  }
};

// アイテムが「低木」であるかの判定
const isBush = function(item) {
  return (
    item.sourceSheet === "Other" &&
    item.source &&
    item.source.includes("Digging up a fully grown bush")
  );
};

// アイテムが「花」であるかの判定
const isFlower = function(item) {
  return (
    item.sourceSheet === "Other" &&
    item.source &&
    (item.source.includes("Seed bag") ||
      item.source.includes("Breeding") ||
      item.source.includes("5-star town status"))
  );
};

// コンプ率の計算対象アイテムの判定
const filterOtherItem = function(item) {
  if (item.sourceSheet !== "Other") {
    // Otherシート以外：ミュージックの「はずれ01～03」を除外
    return item.name.indexOf("Hazure") === -1;
  } else {
    // Otherシート：花/低木のみコンプ率に含める
    return isFlower(item) || isBush(item);
  }
};

// アイテム名が島名置換対象であるかの判定
const hasIslandName = function(item) {
  return (
    item.name === "(island name) Icons" || item.name === "(island name) Miles!"
  );
};

const calcTotalLength = function(items) {
  let result = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].variants) {
      result += items[i].variants.length;
    } else {
      result++;
    }
  }
  return result;
};

const calcCollectedLength = function(collected, items) {
  let result = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.uniqueEntryId) {
      if (collected[item.uniqueEntryId]) result++;
    } else {
      let collectedData = collected[item.name] || "";
      collectedData = collectedData.substr(0, item.variants.length); // Fix for #34
      const length = (collectedData.match(/[0-9A-J]/g) || []).length;
      result += length;
    }
  }
  return result;
};

// 配布可を提供可にする（0B2 => 012）
const providable2collected = function(text) {
  return String.fromCharCode(
    ...text.split("").map(char => {
      const shift = /[A-J]/.test(char) ? -17 : 0;
      return char.charCodeAt() + shift;
    })
  );
};

export { navs };

export function filterItems(args) {
  let items = itemsJson;
  let {
    collected = {},
    myCollected = {},
    nav,
    filter,
    isSearchMode = false,
    searchText = "",
    islandName,
    updateMatchedVariants = false
  } = args;

  //
  // 検索
  //
  if (isSearchMode) {
    const normalizedSearchText = normalizeText(searchText);
    items = items.filter(item => {
      if (searchText === "") {
        return false;
      }
      const normalizedDisplayName = normalizeText(
        toDisplayItemName(item, islandName)
      );
      return normalizedDisplayName.indexOf(normalizedSearchText) !== -1;
    });
    // 島名を含む場合は名前順でソート
    if (islandName && items.some(item => hasIslandName(item))) {
      sortItemsByName(items, (itemName, item) => {
        return replaceIslandName(itemName, item, islandName);
      });
    }
  } else {
    if (filter) {
      //
      // 分類フィルター
      //

      items = items.filter(item => typeFilter(item, filter.typeFilter));

      //
      // 取得フィルター
      //

      items = items.filter(item => {
        const filterVal = filter.collectedFilter;
        const itemKey = item.uniqueEntryId || item.name;
        const itemLength = item.variants ? item.variants.length : 1;
        let collectedData = collected[itemKey] || "";
        let myCollectedData = myCollected[itemKey] || "";

        let isMatch = true;
        // 条件に一致したバリエーションの index の配列
        // すべてマッチする場合やバリエーションがない場合は undefined
        let matchedVariants;

        // 取得のみ
        if (filterVal === "1") {
          isMatch = /[0-9]/g.test(collectedData);
          if (updateMatchedVariants && isMatch && item.variants) {
            matchedVariants = collectedData.match(/[0-9]/g);
          }
        }
        // 配布可のみ
        else if (filterVal === "2") {
          const regex = /[A-J]/g;
          isMatch = regex.test(collectedData);
          if (updateMatchedVariants && isMatch && item.variants) {
            let providableIndexes = providable2collected(
              collectedData.replace(/[0-9]/g, "")
            );
            matchedVariants = providableIndexes.match(/[0-9]/g);
          }
        }
        // 取得or配布
        else if (filterVal === "3") {
          isMatch = /[0-9A-J]/g.test(collectedData);
          if (updateMatchedVariants && isMatch && item.variants) {
            let bothIndexes = providable2collected(collectedData);
            matchedVariants = bothIndexes.match(/[0-9]/g);
          }
        }
        // 未取得
        else if (filterVal === "4") {
          isMatch = collectedData.length < itemLength;
          if (updateMatchedVariants && isMatch && item.variants) {
            const allIndexes = "0123456789".substring(0, itemLength);
            let bothIndexes = providable2collected(collectedData);
            const regexp = new RegExp(`[^${bothIndexes}]`, "g");
            matchedVariants = allIndexes.match(regexp);
          }
        }
        // もらえる
        else if (filterVal === "5") {
          isMatch =
            /[A-J]/g.test(collectedData) && myCollectedData.length < itemLength;
          if (updateMatchedVariants && isMatch && item.variants) {
            const providableIndexes = providable2collected(
              collectedData.replace(/[0-9]/g, "")
            );

            const allIndexes = "0123456789".substring(0, itemLength);
            let bothIndexes = providable2collected(myCollectedData);
            let regexp = new RegExp(`[${bothIndexes}]`, "g");
            const unCollectedIndex = allIndexes.replace(regexp, "");

            regexp = new RegExp(`[${providableIndexes}]`, "g");
            matchedVariants = unCollectedIndex.match(regexp);
            if (matchedVariants === null) {
              isMatch = false;
            }
          }
        }
        // ゆずれる
        else if (filterVal === "6") {
          isMatch =
            collectedData.length < itemLength && /[A-J]/g.test(myCollectedData);
          if (updateMatchedVariants && isMatch && item.variants) {
            const providableIndexes = providable2collected(
              myCollectedData.replace(/[0-9]/g, "")
            );

            const allIndexes = "0123456789".substring(0, itemLength);
            let bothIndexes = providable2collected(collectedData);
            let regexp = new RegExp(`[${bothIndexes}]`, "g");
            const unCollectedIndex = allIndexes.replace(regexp, "");

            regexp = new RegExp(`[${providableIndexes}]`, "g");
            matchedVariants = unCollectedIndex.match(regexp);
            if (matchedVariants === null) {
              isMatch = false;
            }
          }
        }

        if (updateMatchedVariants) {
          item.matchedVariants = matchedVariants;
        }
        return isMatch;
      });
    }

    //
    // Nav
    //

    items = items.filter(item => {
      // 家具（すべて）
      if (nav === "housewares-all") {
        return item.sourceSheet.match(
          /Housewares|Miscellaneous|Wall-mounted|Art/g
        );
      }
      // 家具（家具）
      else if (nav === "housewares") {
        return (
          item.sourceSheet === "Housewares" ||
          (item.sourceSheet === "Art" && item.category === "Housewares")
        );
      }
      // 家具（小物）
      else if (nav === "housewares-miscellaneous") {
        return (
          item.sourceSheet === "Miscellaneous" ||
          (item.sourceSheet === "Art" && item.category === "Miscellaneous")
        );
      }
      // 家具（壁かけ）
      else if (nav === "housewares-wallmounted") {
        return (
          item.sourceSheet === "Wall-mounted" ||
          (item.sourceSheet === "Art" && item.category === "Wall-mounted")
        );
      }
      // 家具（マイル家具）
      else if (nav === "housewares-nookmiles") {
        return (
          item.sourceSheet === "Housewares" &&
          item.source &&
          item.source.includes("Nook Miles Redemption")
        );
      }
      // 壁紙
      else if (nav === "walletc-wall") {
        return item.sourceSheet === "Wallpaper";
      }
      // 床板
      else if (nav === "walletc-floors") {
        return item.sourceSheet === "Floors";
      }
      // ラグ
      else if (nav === "walletc-rugs") {
        return item.sourceSheet === "Rugs";
      }
      // ラグ
      else if (nav === "walletc-fencing") {
        return item.sourceSheet === "Fencing";
      }
      // ファッション (すべて)
      else if (nav === "fashion-all") {
        return item.sourceSheet.match(
          /Tops|Bottoms|Dress-Up|Headwear|Accessories|Socks|Shoes|Bags|Umbrellas|Clothing Other/g
        );
      }
      // ファッション (Tops)
      else if (nav === "fashion-tops") {
        return item.sourceSheet === "Tops";
      }
      // ファッション (Bottoms)
      else if (nav === "fashion-bottoms") {
        return item.sourceSheet === "Bottoms";
      }
      // ファッション (Dress)
      else if (nav === "fashion-dress") {
        return item.sourceSheet === "Dress-Up";
      }
      // ファッション (Headwear)
      else if (nav === "fashion-headwear") {
        return item.sourceSheet === "Headwear";
      }
      // ファッション (Accessories)
      else if (nav === "fashion-accessories") {
        return item.sourceSheet === "Accessories";
      }
      // ファッション (Socks)
      else if (nav === "fashion-socks") {
        return item.sourceSheet === "Socks";
      }
      // ファッション (Shoes)
      else if (nav === "fashion-shoes") {
        return item.sourceSheet === "Shoes";
      }
      // ファッション (Bags)
      else if (nav === "fashion-bags") {
        return item.sourceSheet === "Bags";
      }
      // ファッション (Umbrellas)
      else if (nav === "fashion-umbrellas") {
        return item.sourceSheet === "Umbrellas";
      }
      // ファッション (Clothing Other')
      else if (nav === "fashion-other") {
        return item.sourceSheet === "Clothing Other";
      }
      // かせき
      else if (nav === "fossils") {
        return item.sourceSheet === "Fossils";
      }
      // 曲
      else if (nav === "music") {
        return (
          item.sourceSheet === "Music" && item.name.indexOf("Hazure") === -1
        );
      }
      // 写真
      else if (nav === "photos") {
        return item.sourceSheet === "Photos";
      }
      // ポスター
      else if (nav === "posters") {
        return item.sourceSheet === "Posters";
      }
      // レシピ
      else if (nav === "recipes") {
        return item.sourceSheet === "Recipes";
      }
      // 道具 (すべて)
      else if (nav === "tools-all") {
        return item.sourceSheet === "Tools";
      }
      // 道具 (ステッキ)
      else if (nav === "tools-wand") {
        return item.sourceSheet === "Tools" && item.name.indexOf("wand") >= 0;
      }
      // 生き物 (虫)
      else if (nav === "creatures-insects") {
        return item.sourceSheet === "Insects";
      }
      // 生き物 (魚)
      else if (nav === "creatures-fish") {
        return item.sourceSheet === "Fish";
      }
      // 生き物 (海の幸)
      else if (nav === "creatures-sea") {
        return item.sourceSheet === "Sea Creatures";
      }
      // 来訪者 (ジャスティン)
      else if (nav === "special-fishmodels") {
        return (
          item.source &&
          item.source.includes("C.J.") &&
          item.seasonEvent !== "Fishing Tourney"
        );
      }
      // 来訪者 (レックス)
      else if (nav === "special-bugmodels") {
        return (
          item.source &&
          item.source.includes("Flick") &&
          item.seasonEvent !== "Bug-Off"
        );
      }
      // 来訪者 (つねきち)
      else if (nav === "special-art") {
        return item.sourceSheet === "Art";
      }
      // 来訪者 (ローラン)
      else if (nav === "special-saharah") {
        return (
          item.source &&
          item.source.includes("Saharah") &&
          item.sourceSheet !== "Other"
        );
      }
      // 来訪者 (ことの)
      else if (nav === "special-labelle") {
        return (
          item.source &&
          item.source.includes("Label") &&
          item.sourceSheet !== "Other"
        );
      }
      // 来訪者 (シャンク)
      else if (nav === "special-kicks") {
        return item.source && item.source.includes("Kicks");
      }
      // 来訪者 (フーコ)
      else if (nav === "special-celeste") {
        return item.source && item.source.includes("Celeste");
      }
      // 来訪者 (ジョニー)
      else if (nav === "special-gulliver") {
        return item.source && item.source.includes("Gulliver");
      }
      // 来訪者 (海賊ジョニー)
      else if (nav === "special-gullivarrr") {
        return item.source && item.source.includes("Gullivarrr");
      }
      // 来訪者 (ラコスケ)
      else if (nav === "special-pascal") {
        return (
          (item.series === "mermaid" && !item.variants) ||
          (!item.diy &&
            item.source &&
            item.source.includes("Pascal") &&
            item.sourceSheet !== "Other") ||
          (item.source && item.source.includes("Pascal"))
        );
      }
      // 季節・イベント (たぬきショッピング)
      else if (nav === "season-nook") {
        return (
          item.source && item.source.join(",").match(/Nook Shopping Seasonal/gi)
        );
      }
      // 季節・イベント (魚釣り大会)
      else if (nav === "season-fish") {
        return item.seasonEvent === "Fishing Tourney";
      }
      // 季節・イベント (虫取り大会)
      else if (nav === "season-bug") {
        return item.seasonEvent === "Bug-Off";
      }
      // 季節・イベント (花火大会)
      else if (nav === "season-fireworks") {
        return item.seasonEvent === "Fireworks Show";
      }
      // 季節・イベント (カーニバル)
      else if (nav === "season-festivale") {
        return (
          item.seasonEvent &&
          item.seasonEvent.includes("Festivale") &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (はるのわかたけ)
      else if (nav === "season-spring") {
        return (
          item.seasonEvent === "young spring bamboo" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント （シャムロックデー)
      else if (nav === "season-shamrock") {
        return (
          item.seasonEvent &&
          item.seasonEvent.includes("Shamrock Day") &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (さくら)
      else if (nav === "season-sakura") {
        return (
          item.seasonEvent === "cherry-blossom petals" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (イースター)
      else if (nav === "season-easter") {
        return (
          item.seasonEvent &&
          item.seasonEvent.includes("Bunny Day") &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (メーデー)
      else if (nav === "season-mayday") {
        return item.seasonEvent === "May Day" && item.sourceSheet !== "Tools";
      }
      // 季節・イベント (国際ミュージアムデー)
      else if (nav === "season-museum") {
        return item.seasonEvent === "International Museum Day";
      }
      // 季節・イベント (ジューンブライト)
      else if (nav === "season-wedding") {
        return (
          item.seasonEvent === "Wedding Season" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (なつのかいがら)
      else if (nav === "season-summer") {
        return (
          item.seasonEvent === "summer shells" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (どんぐり/まつぼっくり)
      else if (nav === "season-fall") {
        return (
          item.seasonEvent === "acorns and pine cones" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (ハロウィン)
      else if (nav === "season-halloween") {
        return item.seasonEvent && item.seasonEvent.includes("Halloween");
      }
      // 季節・イベント (きのこ)
      else if (nav === "season-mushroom") {
        return (
          item.seasonEvent === "mushrooms" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (もみじ)
      else if (nav === "season-maple") {
        return (
          item.seasonEvent === "maple leaves" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (サンクスギビングデー)
      else if (nav === "season-turkey") {
        return item.seasonEvent && item.seasonEvent.includes("Turkey Day");
      }
      // 季節・イベント (クリスマス)
      else if (nav === "season-toy") {
        return (
          item.seasonEvent &&
          item.seasonEvent.includes("Toy Day") &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (ゆきのけっしょう)
      else if (nav === "season-winter") {
        return (
          item.seasonEvent === "snowflakes" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (オーナメント)
      else if (nav === "season-festive") {
        return (
          item.seasonEvent === "ornaments" &&
          !item.diy &&
          item.sourceSheet !== "Other"
        );
      }
      // 季節・イベント (カウントダウン)
      else if (nav === "season-countdown") {
        return item.seasonEvent === "Countdown";
      }
      // 季節・イベント (誕生日)
      else if (nav === "season-birthday") {
        return item.seasonEvent === "Birthday";
      }
      // 季節・イベント (ははシリーズ)
      else if (nav === "season-mother") {
        return item.source && item.source.includes("Mom");
      }
      // リアクション
      else if (nav === "reactions") {
        return item.sourceSheet === "Reactions";
      }
      // 花
      else if (nav === "plants-flowers") {
        return isFlower(item);
      }
      // 低木
      else if (nav === "plants-bushes") {
        return isBush(item);
      }
      // たぬきマイレージ
      else if (nav === "achievements") {
        return item.sourceSheet === "Achievements";
      }
      // バージョン 1.4.0
      else if (nav === "versions-140") {
        return item.versionAdded === "1.4.0";
      }
      // バージョン 1.5.0
      else if (nav === "versions-150") {
        return item.versionAdded === "1.5.0";
      }
      // バージョン 1.6.0
      else if (nav === "versions-160") {
        return item.versionAdded === "1.6.0";
      }
      // バージョン 1.7.0
      else if (nav === "versions-170") {
        return item.versionAdded === "1.7.0";
      }
      // バージョン 1.8.0
      else if (nav === "versions-180") {
        return item.versionAdded === "1.8.0";
      }

      return true;
    });

    //
    // 実機順ソート
    //

    if (nav && filter.order === "id") {
      // いきもの、リアクション、たぬきマイレージ
      if (
        nav.indexOf("creatures") > -1 ||
        nav === "reactions" ||
        nav === "achievements"
      ) {
        items.sort(function(itemA, itemB) {
          const ca = itemA.num;
          const cb = itemB.num;
          if (ca > cb) {
            return 1;
          }
          if (ca < cb) {
            return -1;
          }
          return 0;
        });
      }
      // マイル家具
      else if (nav === "housewares-nookmiles") {
        items.sort(function(itemA, itemB) {
          const ca = itemA.exchangePrice;
          const cb = itemB.exchangePrice;
          if (ca > cb) {
            return 1;
          }
          if (ca < cb) {
            return -1;
          }
          return 0;
        });
      }
    }

    //
    // 名前順ソート(たぬきマイレージのみ)
    //

    if (nav === "achievements" && filter.order === "name") {
      sortItemsByName(items, (itemName, item) => {
        return replaceIslandName(itemName, item, islandName);
      });
    }
  }

  return items;
}

export function totalLength(args) {
  const { nav, typeFilter } = args;
  const items = filterItems({
    nav,
    filter: {
      typeFilter: typeFilter
    }
  });

  return calcTotalLength(items);
}

export function allTotalLength() {
  const items = itemsJson.filter(filterOtherItem);

  return calcTotalLength(items);
}

export function collectedLength(args) {
  const { collected, nav, typeFilter } = args;
  const collectedItems = filterItems({
    collected,
    nav,
    filter: {
      typeFilter: typeFilter,
      collectedFilter: "3"
    }
  });

  return calcCollectedLength(collected, collectedItems);
}

export function allCollectedLength(collected) {
  let collectedItems = filterItems({
    collected,
    filter: { collectedFilter: "3" }
  });
  collectedItems = collectedItems.filter(filterOtherItem);

  return calcCollectedLength(collected, collectedItems);
}

export function providableLength(args) {
  const { collected, nav, typeFilter } = args;
  const collectedItems = filterItems({
    collected,
    nav,
    filter: {
      typeFilter: typeFilter,
      collectedFilter: "2"
    }
  });

  return calcCollectedLength(collected, collectedItems);
}

export function getNavText(nav) {
  let navText = "";
  navs.forEach(link => {
    if (link.id === nav) navText = link.text;
    if (link.subnavs) {
      link.subnavs.forEach(sublink => {
        if (sublink.id === nav) navText = sublink.text;
      });
    }
  });
  return navText;
}

export function toDisplayItemName(item, islandName) {
  // 島名を置換
  if (islandName && hasIslandName(item)) {
    return item.displayName.replace("○○", islandName);
  } else {
    return item.displayName;
  }
}
