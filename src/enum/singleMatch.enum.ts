export enum SingleMatchContestTypeEnum {
  ALLCONTESTS = "All Contests",
  MYCONTESTS = "My Contests",
  MYTEAMS = "MyTeams",
}

export enum TeamPopupEnum {
  TEAM = "Team",
  SCOREBOARD = "Scoreboard",
}

export enum ContestStatusEnum {
  UPCOMING = "upcoming",
  ONGOING = "live",
  COMPLETED = "completed",
}

export const matchStatusValue: { [key: number]: string } = {
  1: "Scheduled ",
  2: "Completed ",
  3: "Live ",
  4: "Abandoned",
};

export const gameStatusValue: { [key: number]: string } = {
  0: "Live",
  1: "Starts Shortly",
  2: "Toss",
  3: "Live",
  4: "Delayed",
  5: "Drinks Break",
  6: "Innings Break",
  7: "Stumps",
  8: "Lunch Break",
  9: "Tea Break",
  10: "Match Start Delay",
  11: "Rain Delay",
  12: "Dinner",
  13: "Strategic Timeout",
  14: "Technical Issue",
  15: "Bad Light",
  16: "Match Interrupted",
};
