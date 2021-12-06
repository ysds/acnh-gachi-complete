import itemsJson from "../assets/items.json";
import { navsFlat } from "./navs";
import { typeFilter } from "./filter";
import { hasIslandName, toDisplayItemName } from "./utils";

const { sortItemsByName } = require("../../script/sort.js");

const kata2Hira = function (string) {
  return string.replace(/[\u30A1-\u30FA]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
};

const hankaku2Zenkaku = function (string) {
  return string.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );
};

const normalizeText = function (string) {
  let result = string;
  result = kata2Hira(result);
  result = hankaku2Zenkaku(result);
  return result;
};

// たぬきマイレージ：名前順ソート時の島名置換
const replaceIslandName = function (itemName, item, islandName) {
  if (islandName && hasIslandName(item)) {
    // 島名を置換
    return itemName.replace("〓", islandName);
  } else {
    return itemName;
  }
};

const calcTotalLength = function (items) {
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

const calcCollectedLength = function (collected, items, isProvidableOnly) {
  let result = 0;
  const regex = isProvidableOnly ? /[A-J]/g : /[0-9A-J]/g;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.uniqueEntryId) {
      if (collected[item.uniqueEntryId]) result++;
    } else {
      let collectedData = collected[item.name] || "";
      collectedData = collectedData.substr(0, item.variants.length); // Fix for #34
      const length = (collectedData.match(regex) || []).length;
      result += length;
    }
  }
  return result;
};

// 配布可を提供可にする（0B2 => 012）
const providable2collected = function (text) {
  return String.fromCharCode(
    ...text.split("").map((char) => {
      const shift = /[A-J]/.test(char) ? -17 : 0;
      return char.charCodeAt() + shift;
    })
  );
};

// コンプ率の計算対象アイテムの判定
const filterOtherItem = function (item) {
  return !item.isHidden;
};

export function filterItems(args) {
  let items = itemsJson;
  let {
    collected = {},
    myCollected = {},
    nav,
    filter,
    isSearchMode = false,
    searchText = "",
    adFilters = {},
    islandName,
    updateMatchedVariants = false,
    wishlist = [],
  } = args;

  //
  // 取得フィルター
  //

  const filterVal = isSearchMode ? adFilters.collected : filter.collectedFilter;
  if (filterVal !== null && filterVal !== "0") {
    items = items.filter((item) => {
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
  } else {
    items.forEach((item) => {
      if (updateMatchedVariants) {
        item.matchedVariants = undefined;
      }
    });
  }

  //
  // 検索
  //
  if (isSearchMode) {
    const normalizedSearchText = normalizeText(searchText);
    const filterFuncs = Object.values(adFilters).filter((filter) => filter);

    if (searchText === "" && filterFuncs.length === 0) {
      return [];
    } else {
      if (filterFuncs.length > 0) {
        filterFuncs.forEach((filter) => {
          items = items.filter((item) => {
            if (typeof filter === "function") {
              return filter(item);
            } else {
              return true;
            }
          });
        });
        // 隠しアイテムを隠す
        items = items.filter((item) => !item.isHidden);
      }

      if (searchText !== "") {
        items = items.filter((item) => {
          const normalizedDisplayName = normalizeText(
            toDisplayItemName(item, islandName)
          );
          return normalizedDisplayName.indexOf(normalizedSearchText) !== -1;
        });
      }

      // 島名を含む場合は名前順でソート
      if (islandName && items.some((item) => hasIslandName(item))) {
        sortItemsByName(items, (itemName, item) => {
          return replaceIslandName(itemName, item, islandName);
        });
      }
    }
  } else {
    if (filter) {
      // バージョンフィルター
      if (filter.version && !nav.includes("version")) {
        if (filter.version === 2) {
          items = items.filter((item) => item.versionAdded === "2.0.0");
        } else if (filter.version === 1) {
          items = items.filter((item) => item.versionAdded !== "2.0.0");
        }
      }

      // 分類フィルター
      items = items.filter((item) => typeFilter(item, filter.typeFilter));

      // 隠しアイテムを隠す
      items = items.filter((item) => !item.isHidden);
    }

    //
    // Nav
    //

    if (nav) {
      items = items.filter((item) => {
        if (nav !== "exchange") {
          return navsFlat[nav].filter(item);
        } else if (filter.exchangeType === "wishlist") {
          const itemKey = item.uniqueEntryId || item.name;
          let isMatch = false;

          if (item.variants) {
            let defaultMatchedVariants = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            defaultMatchedVariants.length = item.variants.length;
            let matchedVariants =
              item.matchedVariants || defaultMatchedVariants;

            item.variants.forEach((variant, index) => {
              const entryId = `${itemKey}_${index}`;
              const isInList = wishlist.includes(entryId);

              if (isInList) {
                isMatch = true;
              } else if (updateMatchedVariants) {
                matchedVariants = matchedVariants.filter(
                  (value) => value !== index
                );
              }
            });

            if (updateMatchedVariants) {
              item.matchedVariants = matchedVariants;
            }
          } else {
            isMatch = wishlist.includes(itemKey);
          }

          return isMatch;
        }

        return true;
      });
    }

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
        items.sort(function (itemA, itemB) {
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
        items.sort(function (itemA, itemB) {
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
      // レシピ
      else if (nav === "recipes") {
        items.sort(function (itemA, itemB) {
          const ca = itemA.serialId;
          const cb = itemB.serialId;
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
  const { nav, typeFilter, version } = args;
  const items = filterItems({
    nav,
    filter: {
      typeFilter: typeFilter,
      version: version,
    },
  });

  return calcTotalLength(items);
}

export function allTotalLength() {
  const items = itemsJson.filter(filterOtherItem);

  return calcTotalLength(items);
}

export function collectedLength(args) {
  const { collected, nav, typeFilter, version } = args;
  const collectedItems = filterItems({
    collected,
    nav,
    filter: {
      typeFilter: typeFilter,
      collectedFilter: "3",
      version: version,
    },
  });

  return calcCollectedLength(collected, collectedItems);
}

export function allCollectedLength(collected) {
  let collectedItems = filterItems({
    collected,
    filter: { collectedFilter: "3" },
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
      collectedFilter: "2",
    },
  });

  return calcCollectedLength(collected, collectedItems, true);
}
