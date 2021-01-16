export const saleFilters = [
  {
    id: "all",
    label: "すべて",
    btnLabel: "フィルタ",
    show: ["housewares", "walletc", "fashion", "flowers"]
  },
  { id: "catalog", label: "お店&カタログ", show: ["housewares", "walletc"] },
  { id: "able", label: "エイブル", show: ["fashion"] },
  { id: "kicks", label: "シャンク", show: ["fashion"] },
  { id: "labelle", label: "ことの", show: ["fashion"] },
  { id: "daly", label: "日替わり", show: ["fashion"] },
  { id: "recycle", label: "リサイクルボックス", show: ["fashion"] },
  { id: "seed", label: "種袋", show: ["flowers"] },
  { id: "breeding", label: "交配", show: ["flowers"] },
  { id: "diy", label: "DIY", show: ["housewares", "walletc", "fashion"] },
  {
    id: "other",
    label: "その他",
    show: ["housewares", "walletc", "fashion", "flowers"]
  }
];

export const collectedFilters = [
  {
    id: "0",
    label: "すべて",
    btnLabel: "状態 "
  },
  {
    id: "1",
    label: '<span class="tg tg-gr">取得済</span> '
  },
  {
    id: "2",
    label: '<span class="tg tg-bl">配布可</span> '
  },
  {
    id: "3",
    label: '<span class="tg tg-gr">取</span>＋<span class="tg tg-bl">配</span> '
  },
  {
    id: "4",
    label: "未取得 "
  }
];

// nav に応じて利用可能なフィルター項目配列を返す
export function getSaleFilterItems(nav) {
  if (nav) {
    return saleFilters.filter(obj => {
      const regex = new RegExp(`.*(${obj.show.join(["|"])}).*`, "g");
      return nav.match(regex);
    });
  } else {
    return [];
  }
}

// 指定された nav で指定された filter が利用可能かどうか
export function isAvailableFilter(nav, filter) {
  const filters = getSaleFilterItems(nav);
  const matchedFilters = filters.filter(obj => obj.id === filter);
  return matchedFilters.length === 0;
}
