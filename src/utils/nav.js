import itemsJson from "../assets/items.json";
import navs from "./navs.json";

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

function normalizeText(string) {
  let result = string;
  result = kata2Hira(result);
  result = hankaku2Zenkaku(result);
  return result;
}

export { navs };

export function isFilterBySaleType(activeNav) {
  if (activeNav) {
    const showNavs = ["housewares", "walletc", "fashion"];
    for (let i = 0; i < showNavs.length; i++) {
      if (activeNav.indexOf(showNavs[i]) !== -1) return true;
    }
  }
  return false;
}

export function filterItems(args) {
  let items = itemsJson;
  args = Object.assign(
    {
      isSearchMode: false,
      searchText: ""
    },
    args
  );

  let { collected, myCollected, nav, filter, isSearchMode, searchText } = args;

  items = items.filter(item => {
    //
    // 検索
    //
    if (isSearchMode) {
      if (searchText === "") {
        return false;
      }
      const normalizedDisplayName = normalizeText(item.displayName);
      const normalizedSearchText = normalizeText(searchText);
      return normalizedDisplayName.indexOf(normalizedSearchText) !== -1;
    }

    //
    // 取得方法
    //

    // 商店
    if (isFilterBySaleType(nav)) {
      if (filter.saleFilter === "catalog") {
        if (
          item.catalog === "Not for sale" ||
          item.catalog === "Not in catalog"
        )
          return false;
      }
      // DIY
      else if (filter.saleFilter === "diy") {
        if (!item.diy) return false;
      }
      // その他
      else if (filter.saleFilter === "other") {
        if (
          item.diy ||
          item.catalog === "For sale" ||
          item.catalog === true ||
          (item.source && item.source.includes("Recycle box"))
        )
          return false;
      }
      // エイブル
      else if (filter.saleFilter === "able") {
        if (item.source && !item.source.includes("Able Sisters")) {
          return false;
        }
      }
      // シャンク
      else if (filter.saleFilter === "kicks") {
        if (item.source && !item.source.includes("Kicks")) {
          return false;
        }
      }
      // ことの
      else if (filter.saleFilter === "labelle") {
        if (item.source && !item.source.includes("Label")) {
          return false;
        }
      }
      // 日替わり
      else if (filter.saleFilter === "daly") {
        if (
          item.source &&
          !item.source.includes("Nook Shopping Daily Selection")
        ) {
          return false;
        }
      }
      // リサイクルボックス
      else if (filter.saleFilter === "recycle") {
        if (item.source && !item.source.includes("Recycle box")) {
          return false;
        }
      }
    }

    //
    // チェック状態
    //

    if (filter) {
      // 取得のみ
      if (filter.collectedFilter === "1") {
        if (item.uniqueEntryId) {
          if (
            !collected[item.uniqueEntryId] ||
            collected[item.uniqueEntryId] !== "0"
          ) {
            return false;
          }
        } else {
          const collectedData = collected[item.name] || "";
          const length = (collectedData.match(/[0-9]/g) || []).length;
          if (length === 0) return false;
        }
      }
      // 配布可のみ
      else if (
        filter.collectedFilter === "2" ||
        filter.collectedFilter === "5"
      ) {
        if (item.uniqueEntryId) {
          if (
            !collected[item.uniqueEntryId] ||
            collected[item.uniqueEntryId] !== "A"
          ) {
            return false;
          }
        } else {
          const collectedData = collected[item.name] || "";
          const length = (collectedData.match(/[A-J]/g) || []).length;
          if (length === 0) return false;
        }
      }
      // 取得or配布
      else if (filter.collectedFilter === "3") {
        if (item.uniqueEntryId) {
          if (!collected[item.uniqueEntryId]) return false;
        } else {
          const collectedData = collected[item.name] || "";
          const length = (collectedData.match(/[0-9A-J]/g) || []).length;
          if (length === 0) return false;
        }
      }
      // 未取得
      else if (
        filter.collectedFilter === "4" ||
        filter.collectedFilter === "6"
      ) {
        if (item.uniqueEntryId) {
          if (collected[item.uniqueEntryId]) return false;
        } else if (
          collected[item.name] &&
          item.variants.length === collected[item.name].length
        ) {
          return false;
        }
      }

      // もらえる
      if (filter.collectedFilter === "5") {
        if (item.uniqueEntryId) {
          if (myCollected[item.uniqueEntryId]) return false;
        } else if (
          myCollected[item.name] &&
          item.variants.length === myCollected[item.name].length
        ) {
          return false;
        }
      }
      // ゆずれる
      else if (filter.collectedFilter === "6") {
        if (item.uniqueEntryId) {
          if (
            !myCollected[item.uniqueEntryId] ||
            myCollected[item.uniqueEntryId] !== "A"
          )
            return false;
        } else {
          const collectedData = myCollected[item.name] || "";
          const length = (collectedData.match(/[A-J]/g) || []).length;
          if (length === 0) return false;
        }
      }
      // return item.noName;
      // return item.customizeVariants;
    }

    //
    // Nav
    //

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
      return item.sourceSheet === "Music" && item.name.indexOf("Hazure") === -1;
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
    // 季節・イベント (はるのわかたけ)
    else if (nav === "season-spring") {
      return (
        item.seasonEvent === "young spring bamboo" &&
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

    return true;
  });

  // 実機順ソート
  if (!isSearchMode && nav && filter.order === "id") {
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

  return items;
}

export function totalLength(args) {
  const { nav, saleFilter } = args;

  const totalItems = filterItems({
    nav,
    filter: {
      saleFilter: saleFilter
    }
  });
  let result = 0;
  for (let i = 0; i < totalItems.length; i++) {
    if (totalItems[i].variants) {
      result += totalItems[i].variants.length;
    } else {
      result++;
    }
  }
  return result;
}

export function collectedLength(args) {
  const { collected, nav, saleFilter } = args;

  const collectedItems = filterItems({
    collected,
    nav,
    filter: {
      saleFilter: saleFilter,
      collectedFilter: "3"
    }
  });

  let result = 0;
  for (let i = 0; i < collectedItems.length; i++) {
    const item = collectedItems[i];
    if (item.uniqueEntryId) {
      if (collected[item.uniqueEntryId]) result++;
    } else {
      const collectedData = collected[item.name] || "";
      const length = (collectedData.match(/[0-9A-J]/g) || []).length;
      result += length;
    }
  }
  return result;
}

function filterOtherItem(item) {
  return item.sourceSheet !== "Other" && item.name.indexOf("Hazure") === -1;
}

export function allLength() {
  const items = itemsJson.filter(filterOtherItem);

  let result = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].variants) {
      result += items[i].variants.length;
    } else {
      result++;
    }
  }
  return result;
}

export function allCollectedLength(collected) {
  let items = filterItems({ collected, filter: { collectedFilter: "3" } });
  items = items.filter(filterOtherItem);

  let result = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.uniqueEntryId) {
      if (collected[item.uniqueEntryId]) result++;
    } else {
      const collectedData = collected[item.name] || "";
      const length = (collectedData.match(/[0-9A-J]/g) || []).length;
      result += length;
    }
  }
  return result;
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
