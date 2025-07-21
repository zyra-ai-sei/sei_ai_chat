export interface IClaimStatus {
  eligibleBonuses: {
    bonusType: string;
    bonusAmount: number;
  }[];
  claimedBonuses: {
    userAddress: string;
    status: string;
    bonusType: string;
    bonusAmount: number;
    createdAt: string;
  }[];
}
