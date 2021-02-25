export function percentage(value, totalValue) {
  if (totalValue === 0) {
    return "0.0%";
  } else {
    const percentage = (Math.floor((value / totalValue) * 1000) / 1000) * 100;
    return `${percentage.toFixed(1)}%`;
  }
}

export function zen_han_conv(str) {
  str = str.replace(/[０-９Ａ-Ｚａ-ｚ]/g, function(match) {
    const chr = match.charCodeAt(0) - 0xfee0;
    return String.fromCharCode(chr);
  });
  str = str.replace(/（/g, "(");
  str = str.replace(/）/g, ")");
  str = str.replace(/~/g, "～");
  return str;
}
