export const getTeamCreationRules = (
  match_format: string,
  isForeignPlayer?: boolean
) => {
  switch (match_format) {
    case "Test":
      return {
        totalCredits: 100,
        showForeignPlayer: isForeignPlayer || false,
        regularTeamSize: 11,
        maxSubstitutePlayerSize: 2,
        maxPlayerPerTeam: 6,
        maxPlayerPerType: 8,

        minBowlers: 2,
        maxBowlers: 8,
        minBatters: 0,
        maxBatters: 5,
        minWicketKeepers: 1,
        maxWicketKeepers: 6,
        minAllRounders: 0,
        maxAllRounders: 8,
        minBattersWicketKeepersAllRounders: 5,
        minBowlersAllRounders: 4,
        maxForeignPlayers: 11,
      };

    case "ODI":
      return {
        totalCredits: 100,
        showForeignPlayer: false,
        regularTeamSize: 11,
        maxSubstitutePlayerSize: 2,
        maxPlayerPerTeam: 6,
        maxPlayerPerType: 8,

        minBowlers: 2,
        maxBowlers: 6,
        minBatters: 0,
        maxBatters: 5,
        minWicketKeepers: 1,
        maxWicketKeepers: 6,
        minAllRounders: 0,
        maxAllRounders: 8,
        minBattersWicketKeepersAllRounders: 5,
        minBowlersAllRounders: 5,
        maxForeignPlayers: 11,
      };
    case "T20I":
      return {
        totalCredits: 100,
        showForeignPlayer: false,
        regularTeamSize: 11,
        maxSubstitutePlayerSize: 2,
        maxPlayerPerTeam: 7,
        maxPlayerPerType: 8,

        minBowlers: 2,
        maxBowlers: 6,
        minBatters: 0,
        maxBatters: 5,
        minWicketKeepers: 1,
        maxWicketKeepers: 6,
        minAllRounders: 0,
        maxAllRounders: 8,
        minBattersWicketKeepersAllRounders: 5,
        minBowlersAllRounders: 5,
        maxForeignPlayers: 11,
      };
    default:
      return {
        totalCredits: 100,
        showForeignPlayer: false,
        regularTeamSize: 11,
        maxSubstitutePlayerSize: 2,
        maxPlayerPerTeam: 7,
        maxPlayerPerType: 8,

        minBowlers: 2,
        maxBowlers: 8,
        minBatters: 0,
        maxBatters: 5,
        minWicketKeepers: 1,
        maxWicketKeepers: 6,
        minAllRounders: 0,
        maxAllRounders: 8,
        minBattersWicketKeepersAllRounders: 5,
        minBowlersAllRounders: 5,
        maxForeignPlayers: 11,
      };
  }
};
