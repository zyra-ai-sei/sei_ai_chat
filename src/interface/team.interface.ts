export interface Team {
  team_id: number;
  name: string;
  short_name: string;
  logo_url: string;
  thumb_url: string;
  scores_full: string;
  scores: string;
  overs: string;
}

export interface IOverallLeaderboardItem {
  user: string;
  userName: string;
  rank: number;
  oldRank: number;
  points: number;
}
