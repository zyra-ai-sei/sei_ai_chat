export type PlayerProps = {
  id: number;
  credits: number;
  fullName: string;
  name: string;
  format: string;
  isForeignPlayer: boolean;
  points: number;
  type: string;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isMain: boolean;
  isSubs: boolean;
  team: string;
  isPlaying: boolean;
  isSubstitute: boolean;
};

export interface TeamProps {
  tid: number;
  title: string;
  abbr: string;
  altName: string;
  type: string;
  thumbUrl: string;
  logoUrl: string;
  country: string;
  sex: string;
}

export interface IMatchTypeStatsData {
  strike: string;
  average: string;
}
export interface IplayerStatsData {
  id: number;
  title: string;
  short_name: string;
  name: string;
  birthdate: string;
  country: string;
  nationality: string;
  playing_role: string;
  fantasy_player_rating: number;
  is_foreign: boolean;
  batting_style: string;
  bowling_style: string;
  stats: {
    batting: {
      [key: string]: IMatchTypeStatsData;
    };
    bowling: {
      [key: string]: IMatchTypeStatsData;
    };
  };
}
