export const headerWalletAddressShrinker = (
  address: string,
  initial: number = 6,
  end: number = 4
) => {
  return `${address?.substring(0, initial)}...${address?.substring(
    address?.length - end,
    address?.length
  )}`;
};

export const isValidWalletAddress = (adress: string = "") => {
  return /^0x[a-fA-F0-9]{40}$/g.test(adress);
};
