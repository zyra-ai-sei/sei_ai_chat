import { FixTypeLater } from "@/interface/common.interface";
import { hexlify } from "@ethersproject/bytes";

export function generateAddressSummary(
  address: string | FixTypeLater,
  headChartCount?: number
) {
  if (!address) {
    return "";
  } else {
    const _headChartCount = headChartCount || 3;
    const addressSummary = `${address.substring(0, _headChartCount)}...${address.substring(
      address.length - 4,
      address.length
    )}`;
    return addressSummary;
  }
}

export const encodeFormatData = (data: FixTypeLater) => {
  const hex = hexlify(data).substr(2);
  let str = "0x";
  for (let i = 0; i < 64 - hex.length; i++) {
    str += "0";
  }
  return str + hex;
};

export const prizeArrayFromatter = (
  arr: number[]
): { name: string; icon: string; usdcAmt: string }[] => {
  const awards: { name: string; icon: string; usdcAmt: string }[] = [];
  if (!arr) {
    return awards;
  }

  const icons = ["🥇", "🥈", "🥉"];

  if (arr.length > 0)
    awards.push({ name: "1st", icon: icons[0], usdcAmt: arr[0].toString() });
  if (arr.length > 1)
    awards.push({ name: "2nd", icon: icons[1], usdcAmt: arr[1].toString() });
  if (arr.length > 2)
    awards.push({ name: "3rd", icon: icons[2], usdcAmt: arr[2].toString() });

  let i = 3; // Start from the 4th element
  while (i < arr.length) {
    const start = i;
    const usdcAmt = arr[i];
    while (i < arr.length && arr[i] === usdcAmt) {
      i++;
    }
    const end = i;
    const positionName = `${start + 1}${start + 1 === 1 ? "st" : start + 1 === 2 ? "nd" : start + 1 === 3 ? "rd" : "th"}${end - 1 > start ? ` - ${end}th` : ""}`;
    awards.push({
      name: positionName,
      icon: "🏅",
      usdcAmt: usdcAmt.toString(),
    });
  }

  return awards;
};

export const chaquenPointsFormat = (points: number) => {
  if (points === 0) {
    return 0;
  } else if (!points) {
    return "-";
  } else if (Number?.isInteger(points)) {
    return points;
  } else {
    return points?.toFixed(2);
  }
};

export const calculateContestFeeIndex = (
  count: number,
  index: number,
  totalContest: number
) => {
  if (totalContest < 2) {
    return index;
  }
  if (count === 0) {
    return index;
  } else if (count !== 0 && index === 0) {
    return index + 1;
  } else {
    return index - 1;
  }
};

