export function formatNumberValue(valueInput: number | string): string {
  const value = Number(valueInput);
  if (isNaN(value)) {
    return "-";
  }
  if (value === 0) {
    return "0";
  } else if (value < 0.1) {
    return "<0.1";
  } else if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + "B";
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + "k";
  } else if (value >= 1) {
    return value.toFixed(2);
  } else {
    return value.toFixed(4);
  }
}
