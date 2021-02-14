function hiraToKana(str) {
  return str.replace(/[\u3041-\u3096]/g, function(match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

function hanEisuToZenEisu(str) {
  return str.replace(/[A-Za-z0-9]/g, function(match) {
    const chr = match.charCodeAt(0) + 0xfee0;
    return String.fromCharCode(chr);
  });
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

function tsu_conv(str) {
  str = str.replace("ッ", "ツ");
  return str;
}

function yoon_conv(str) {
  str = str.replace("ャ", "ヤ");
  str = str.replace("ュ", "ユ");
  str = str.replace("ョ", "ヨ");
  return str;
}

module.exports = {
  convertForSorting: function(str) {
    str = hiraToKana(str);
    str = hanEisuToZenEisu(str);
    str = tsu_conv(str);
    str = choon_conv(str);
    str = yoon_conv(str);
    str = daku_conv(str);
    return str;
  },
  sortItemsByName: function(items, converter) {
    items.sort(function(a, b) {
      const ca = converter(a);
      const cb = converter(b);
      // 数字で始まるアイテムを先頭に持ってくる（例：１ごうのしゃしん）
      if (ca.match(/^[0-9０-９]/) && !cb.match(/^[0-9０-９]/)) {
        return -1;
      } else if (!ca.match(/^[0-9０-９]/) && cb.match(/^[0-9０-９]/)) {
        return 1;
      } else if (ca == cb) {
        if (a.displayName == b.displayName) {
          return 0;
        } else if (a.displayName > b.displayName) {
          return 1;
        } else {
          return -1;
        }
      } else if (ca > cb) {
        return 1;
      } else {
        return -1;
      }
    });
  }
};
