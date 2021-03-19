function kana_conv(str) {
  return str.replace(/[\u3041-\u3096]/g, function(match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

function zen_han_conv(str) {
  str = str.replace(/[０-９]/g, function(match) {
    const chr = match.charCodeAt(0) - 0xfee0;
    return String.fromCharCode(chr);
  });
  str = str.replace(/[A-Za-z]/g, function(match) {
    const chr = match.charCodeAt(0) + 0xfee0;
    return String.fromCharCode(chr);
  });
  return str.toUpperCase();
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

function sutegana_conv(str) {
  str = str.replace(/ァ/g, "ア");
  str = str.replace(/ィ/g, "イ");
  str = str.replace(/ゥ/g, "ウ");
  str = str.replace(/ェ/g, "エ");
  str = str.replace(/ォ/g, "オ");
  str = str.replace(/ッ/g, "ツ");
  str = str.replace(/ャ/g, "ヤ");
  str = str.replace(/ュ/g, "ユ");
  str = str.replace(/ョ/g, "ヨ");
  str = str.replace(/ヮ/g, "ワ");
  str = str.replace(/ヵ/g, "カ");
  str = str.replace(/ヶ/g, "ケ");
  return str;
}

function symbol_conv(str) {
  if (str.length >= 2) {
    return (
      str.substring(0, 1) +
      str.substring(1).replace(/[^\u0020-\u007Dァ-ヶＡ-Ｚａ-ｚ]/g, "")
    );
  } else {
    return str;
  }
}

function convertForSorting(str) {
  // ひらがな⇒カタカナ
  str = kana_conv(str);
  // 数字⇒半角、アルファベット⇒全角大文字
  str = zen_han_conv(str);
  // 長音変換（ポスター⇒ポスタア）
  str = choon_conv(str);
  // 捨て仮名変換（ッ⇒ツ）
  str = sutegana_conv(str);
  // 濁点削除（ブドウ⇒フトウ）
  str = daku_conv(str);
  // 先頭以外の全角記号削除
  str = symbol_conv(str);
  return str;
}

module.exports = {
  sortItemsByName: function(items, converter) {
    const reSymbol = /[^\u0020-\u007D〓ァ-ヶＡ-Ｚａ-ｚ]/;
    items.sort(function(a, b) {
      // 変換前
      const oa = a.yomigana || a.displayName;
      const ob = b.yomigana || b.displayName;
      // 変換後
      const ca = convertForSorting(converter ? converter(oa, a) : oa);
      const cb = convertForSorting(converter ? converter(ob, b) : ob);
      // 1文字単位で判定
      // 島名読み仮名の〓以外の全角記号は最後尾へ
      for (let i = 0; i < ca.length; ) {
        if (i === cb.length) {
          return 1;
        }
        const sa = ca.substring(i, i + 1);
        const sb = cb.substring(i, i + 1);
        if (sa.match(/[0-9]/) && sb.match(/[0-9]/)) {
          // 数字同士は連続した数字の大小で比較
          // 例「12つぶのぶどう」と「１ごうのしゃしん」なら12と1を比較
          const na = parseInt(ca.substring(i).match(/[0-9]+/g)[0], 10);
          const nb = parseInt(cb.substring(i).match(/[0-9]+/g)[0], 10);
          if (na > nb) {
            return 1;
          } else if (na < nb) {
            return -1;
          } else {
            i += na.toString(10).length;
          }
        } else if (reSymbol.test(sa) && !reSymbol.test(sb)) {
          return 1;
        } else if (!reSymbol.test(sa) && reSymbol.test(sb)) {
          return -1;
        } else if (sa > sb) {
          return 1;
        } else if (sa < sb) {
          return -1;
        } else {
          i++;
        }
      }
      if (ca.length < cb.length) {
        return -1;
      }
      // 変換前の値で比較
      if (oa === ob) {
        return 0;
      } else if (oa > ob) {
        return 1;
      } else {
        return -1;
      }
    });
  }
};
