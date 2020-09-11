module.exports = {
  hiraToKana: function(str) {
    return str.replace(/[\u3041-\u3096]/g, function(match) {
      const chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  },
  daku_conv: function(str) {
    str = str.normalize("NFD");
    str = str.replace(/[\u3099\u309A]/g, "");
    return str;
  },
  choon_conv: function(str) {
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
  },
  tsu_conv: function(str) {
    str = str.replace("ッ", "ツ");
    return str;
  },
  array_move: function(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.Push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }
};
