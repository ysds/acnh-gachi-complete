export function percentage(value, totalValue) {
  if (totalValue === 0) {
    return "0.0%";
  } else {
    const percentage = (Math.floor((value / totalValue) * 1000) / 1000) * 100;
    return `${percentage.toFixed(1)}%`;
  }
}
