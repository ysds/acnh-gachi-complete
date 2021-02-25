import seasonEventData from "../../data/translation-custom/seasonEvent.json";

const typeFilters = [
  {
    id: "all",
    label: "すべて",
    btnLabel: "フィルタ",
    show: ["housewares", "walletc", "fashion", "flowers"]
  },
  {
    id: "catalog",
    label: "カタログ",
    show: ["housewares", "walletc", "fashion"],
    filter: function(item) {
      return item.catalog === "For sale" || item.catalog === "Not for sale";
    }
  },
  {
    id: "catalog-buyable",
    label: "カタログ（購入可）",
    show: ["housewares", "walletc", "fashion"],
    filter: function(item) {
      return item.catalog === "For sale";
    }
  },
  {
    id: "diy",
    label: "カタログ（DIY）",
    show: ["housewares", "walletc", "fashion"],
    filter: function(item) {
      return item.diy;
    }
  },
  {
    id: "not-for-sale",
    label: "カタログ（DIYを除く非売品）",
    show: ["housewares", "walletc", "fashion"],
    filter: function(item) {
      return !item.diy && item.catalog !== "For sale";
    }
  },
  {
    id: "catalog-not-in-catalog",
    label: "カタログ掲載なし",
    show: ["housewares", "walletc", "fashion"],
    filter: function(item) {
      return item.catalog === "Not in catalog";
    }
  },
  {
    id: "able",
    label: "エイブル",
    show: ["fashion"],
    filter: function(item) {
      return item.source && item.source.includes("Able Sisters");
    }
  },
  {
    id: "kicks",
    label: "シャンク",
    show: ["fashion"],
    filter: function(item) {
      return item.source && item.source.includes("Kicks");
    }
  },
  {
    id: "labelle",
    label: "ことの",
    show: ["fashion"],
    filter: function(item) {
      return item.source && item.source.includes("Label");
    }
  },
  {
    id: "daly",
    label: "たぬきショッピング（日替わり）",
    show: ["fashion"],
    filter: function(item) {
      return (
        item.source && item.source.includes("Nook Shopping Daily Selection")
      );
    }
  },
  {
    id: "recycle",
    label: "リサイクルボックス",
    show: ["fashion"],
    filter: function(item) {
      return item.source && item.source.includes("Recycle box");
    }
  },
  {
    id: "seed",
    label: "種袋",
    show: ["flowers"],
    filter: function(item) {
      return item.source && item.source.includes("Seed bag");
    }
  },
  {
    id: "breeding",
    label: "交配",
    show: ["flowers"],
    filter: function(item) {
      return item.source && item.source.includes("Breeding");
    }
  },
  {
    id: "flower-reward",
    label: "その他",
    show: ["flowers"],
    filter: function(item) {
      return item.source && item.source.includes("5-star town status");
    }
  }
];

const seasonEvents = [
  "Spring shopping",
  "Summer shopping",
  "Fall shopping",
  "Winter shopping",
  "Setsubun (Able Sisters)",
  "Festivale (ready days); Festivale",
  "Shamrock Day (Able Sisters)",
  "Fireworks Show",
  "Halloween (ready days); Halloween",
  "Festive shopping",
  "Toy Day (ready days phase 2); Toy Day; Toy Day (day after)"
];

seasonEvents.forEach((value, index) => {
  typeFilters.push({
    id: `fashion-${index}`,
    label: seasonEventData[value] || value,
    show: ["fashion"],
    filter: function(item) {
      return (
        item.seasonEvent &&
        item.seasonEvent.includes(value) &&
        item.catalog === "For sale"
      );
    }
  });
});

export { typeFilters };

export const collectedFilters = [
  {
    id: "0",
    label: "すべて",
    btnLabel: "状態"
  },
  {
    id: "1",
    label: '<span class="tg tg-gr">取得済</span>'
  },
  {
    id: "2",
    label: '<span class="tg tg-bl">配布可</span>'
  },
  {
    id: "3",
    label: '<span class="tg tg-gr">取</span>＋<span class="tg tg-bl">配</span>'
  },
  {
    id: "4",
    label: "未取得"
  }
];

export function typeFilter(item, filterValue) {
  const matchedFilter = typeFilters.filter(
    filter => filter.id === filterValue
  )[0];
  if (matchedFilter && matchedFilter.filter) {
    return matchedFilter.filter(item);
  }
  return true;
}

// nav に応じて利用可能なフィルター項目配列を返す
export function getTypeFilterItems(nav) {
  if (nav && nav !== "housewares-nookmiles") {
    return typeFilters.filter(obj => {
      const regex = new RegExp(`.*(${obj.show.join(["|"])}).*`, "g");
      return nav.match(regex);
    });
  }
  return [];
}

// 指定された nav で指定された filter が利用可能かどうか
export function isAvailableFilter(nav, filter) {
  const filters = getTypeFilterItems(nav);
  const matchedFilters = filters.filter(obj => obj.id === filter);
  return matchedFilters.length === 0;
}
