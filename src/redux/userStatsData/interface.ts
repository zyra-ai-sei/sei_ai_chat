import { IChaquenPointsData } from "../chaquenPoints/interface";

export interface IUserStatsData {
  totalWinnings: number;
  matchesPlayed: number;
  medals: number[];
  createdAt: string;
  name: string;
  tgVerified: boolean;
  chaquenPoints: IChaquenPointsData;
}

export interface IUserStatsReducer {
  isLoading: boolean;
  error: string;
  data: IUserStatsData;
}
