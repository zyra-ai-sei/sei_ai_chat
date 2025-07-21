import goldIcon from "@/assets/leaderBoard/gold.png";
import silverIcon from "@/assets/leaderBoard/silver.png";
import bronzeIcon from "@/assets/leaderBoard/bronze.png";
import consoleIcon from "@/assets/leaderBoard/console.png";
import { UsdcToken } from "@/constants/token";

export const formatRoundValue = (
  value: number,
  maxDecimalsInp: number = 4,
  isShortRounded?: boolean
) => {
  const decimalCount = (value?.toString()?.split(".")?.[1] || "")?.length;

  let maxDecimals = maxDecimalsInp;

  if (value >= 1) {
    maxDecimals = 2;
  } else if (value >= 0.1) {
    if (isShortRounded) {
      maxDecimals = 2;
    } else {
      maxDecimals = 4;
    }
  } else {
    if (isShortRounded) {
      maxDecimals = 2;
    } else {
      maxDecimals = 4;
    }
  }

  return decimalCount > maxDecimals
    ? value?.toFixed(maxDecimals)
    : value?.toString();
};

// old reward calculation array
// export const calculateTotalRewards = (rewardData: string[][]) => {
//   const expandedArray = [];

//   for (let i = 0; i < rewardData?.length; i++) {
//     const currentRank = Number(rewardData[i][0]);
//     const currentPrize = Number(rewardData[i][1]) / 1e6;
//     const nextRank = rewardData[i + 1]
//       ? Number(rewardData[i + 1][0])
//       : currentRank + 1;

//     if (currentPrize > 0) {
//       for (let rank = currentRank; rank < nextRank; rank++) {
//         expandedArray.push(currentPrize);
//       }
//     }
//   }

//   return formatRoundValue(expandedArray?.reduce((acc, item) => acc + item, 0));
// };

export function calculateTotalRewards(
  mergedRewards: Array<[string, [string, string]]>
): {
  totalRewards: string;
  fixedRewards: string;
  dynamicRewards: string;
  isAssuredRewardDisplay: boolean;
} {
  let totalRewards = 0;
  let fixedRewards = 0;
  let dynamicRewards = 0;

  // Process each rank in the merged rewards
  for (let i = 0; i < mergedRewards.length; i++) {
    const [rank, [fixedReward, dynamicReward]] = mergedRewards[i];

    // Calculate how many positions have this reward
    const nextRankIndex = i + 1 < mergedRewards.length ? i + 1 : -1;
    const currentRankNum = parseInt(rank);
    const nextRankNum =
      nextRankIndex >= 0 ? parseInt(mergedRewards[nextRankIndex][0]) : -1;

    // Calculate the number of positions with this reward amount
    const positionsCount = nextRankNum > 0 ? nextRankNum - currentRankNum : 1;

    // Parse the rewards as BigInt
    const fixedAmount = Number(fixedReward) / 1e6;
    const dynamicAmount = Number(dynamicReward) / 1e6;
    const combinedAmount = fixedAmount + dynamicAmount;

    // Add the total reward for all positions at this reward level
    fixedRewards += fixedAmount * positionsCount;
    dynamicRewards += dynamicAmount * positionsCount;
    totalRewards += combinedAmount * positionsCount;
  }

  return {
    totalRewards: formatRoundValue(totalRewards),
    fixedRewards: formatRoundValue(fixedRewards),
    dynamicRewards: formatRoundValue(dynamicRewards),
    isAssuredRewardDisplay: fixedRewards > 0,
  };
}

export const getRewardIconFromIndex = (index: number) => {
  switch (index) {
    case 0:
      return goldIcon;
    case 1:
      return silverIcon;
    case 2:
      return bronzeIcon;
    case 3:
      return consoleIcon;
    default:
      return consoleIcon;
  }
};

export const getTeamIdCount = (count: number, fee: number) => {
  if (count === 1) {
    return 0;
  }
  if (count > 1 && fee === 0) {
    return 1;
  } else {
    return 0;
  }
};

export const formatUsdcValue = (value: number) => {
  return formatRoundValue(value / 10 ** UsdcToken.decimals);
};

export const formatChaquenPointsBase = (value: number) => {
  return formatRoundValue(value / 10 ** 1e18);
};
