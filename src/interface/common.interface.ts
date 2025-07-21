import { GameplayTypeEnum } from "@/enum/singleContest.enum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixTypeLater = unknown | any;

export interface IUserInvitesApiResponse {
  userAddress: string;
  name: string;
  createdAt?: string;
  bonusAmount: number;
  bonusStatus: "pending" | "paid";
  bonusType: "invitee" | "invitee_firstContest";
}

export interface IContestConfig {
  items: {
    address: string;
    protocolCommissionPercentage: string;
    creatorCommissionPercentage: string;
    maxTeams: number;
    minTeams: number;
    minEntryFee: string;
    maxEntryFee: string;
    metadata: { name: GameplayTypeEnum; description: string };
  }[];
}
