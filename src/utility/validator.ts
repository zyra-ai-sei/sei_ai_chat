import { IMyContest } from "@/redux/myContests/interface";
import { IMyBet } from "@/redux/predictMatch/interface";


export const isEmail = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export const headerWalletAddressShrinker = (
  address: string,
  initial: number = 6,
  end: number = 4
) => {
  return `${address?.substring(0, initial)}...${address?.substring(address?.length - end, address?.length)}`;
};

export function isSafari() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("safari") && !ua.includes("chrome");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function areArraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1?.length !== arr2?.length) {
    return false;
  }

  return arr1?.every((obj, index) => {
    const obj2 = arr2?.[index];

    return JSON.stringify(obj) === JSON.stringify(obj2);
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBet(item: any): item is IMyBet {
  return "isBet" in item && item.isBet === true;
}

export function myBetsAndMyContestCombine(
  myContests: IMyContest[],
  myBets: IMyBet[]
) {
  let combinedArray: (IMyBet | IMyContest)[] = [];
  if (myContests && myBets) {
    combinedArray = [...myBets, ...myContests];

    combinedArray?.sort(
      (itemA, itemB) => Number(itemB?.timeStamp) - Number(itemA?.timeStamp)
    );
    return combinedArray;
  } else {
    combinedArray = [];
    return combinedArray;
  }
}
