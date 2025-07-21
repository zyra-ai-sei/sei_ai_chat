const League_abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccessControlBadConfirmation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "neededRole",
        type: "bytes32",
      },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
    ],
    name: "ContestDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "DelegateCallFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "invalidAddress",
        type: "address",
      },
    ],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidConfigurationIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCurrentScores",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFeePercentage",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMatchTime",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidNewPlayers",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidParamsLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
    ],
    name: "MatchAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "MatchAlreadyStarted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
    ],
    name: "MatchDoesNotExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
    ],
    name: "MatchResultNotUploaded",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxTeamsCreated",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "NoRewards",
    type: "error",
  },
  {
    inputs: [],
    name: "NotImplementedYet",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "playerId",
        type: "uint256",
      },
    ],
    name: "PlayerAlreadyInTeam",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "playerId",
        type: "uint256",
      },
    ],
    name: "PlayerNotInMatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "playerId",
        type: "uint256",
      },
    ],
    name: "PlayerNotInTeam",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
    ],
    name: "ResultsAlreadyUploaded",
    type: "error",
  },
  {
    inputs: [],
    name: "TeamAlreadyCreated",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
    ],
    name: "TeamAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
    ],
    name: "TeamDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
    ],
    name: "TeamNotCreated",
    type: "error",
  },
  {
    inputs: [],
    name: "TeamsCannotBeSame",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
    ],
    name: "UnauthorizedTeamAccess",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contestTemplate",
        type: "address",
      },
    ],
    name: "UnregisteredContestTemplate",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
    ],
    name: "ChaquenPointsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "entryFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "validatorIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contestTemplate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxTeams",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "feeReceiver",
        type: "address",
      },
    ],
    name: "ContestCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamA",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamB",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct MatchInputData",
        name: "matchData",
        type: "tuple",
      },
    ],
    name: "MatchAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamA",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamB",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct MatchInputData",
        name: "matchData",
        type: "tuple",
      },
    ],
    name: "MatchInfoUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
    ],
    name: "MatchRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum MatchOutcome",
        name: "matchOutcome",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "playerIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "int256[]",
        name: "playerScores",
        type: "int256[]",
      },
    ],
    name: "MatchResultUploaded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "playerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "playerCredits",
        type: "uint8",
      },
    ],
    name: "PlayerCreditsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isForeignPlayer",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "playerCredit",
            type: "uint8",
          },
          {
            internalType: "enum PlayerType",
            name: "playerType",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct PlayerInputData",
        name: "playerInputData",
        type: "tuple",
      },
    ],
    name: "PlayerDetailsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isForeignPlayer",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "playerCredit",
            type: "uint8",
          },
          {
            internalType: "enum PlayerType",
            name: "playerType",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct PlayerInputData[]",
        name: "teamData",
        type: "tuple[]",
      },
    ],
    name: "PlayersAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "playedIds",
        type: "uint256[]",
      },
    ],
    name: "PlayersRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "captainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "viceCaptainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "playerIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "substitutes",
            type: "uint256[]",
          },
        ],
        indexed: false,
        internalType: "struct UserTeamInputData",
        name: "team",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    name: "TeamCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isForeignPlayer",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "playerCredit",
            type: "uint8",
          },
          {
            internalType: "enum PlayerType",
            name: "playerType",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct PlayerInputData[]",
        name: "teamData",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "teamMetadata",
        type: "bytes",
      },
    ],
    name: "TeamRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "teamId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "captainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "viceCaptainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "playerIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "substitutes",
            type: "uint256[]",
          },
        ],
        indexed: false,
        internalType: "struct UserTeamInputData",
        name: "team",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    name: "TeamUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensRecovered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "teamIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "rewards",
        type: "uint256[]",
      },
    ],
    name: "TopNResultsUploaded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "contestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "UserContestCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "validator",
        type: "address",
      },
    ],
    name: "ValidatorAdded",
    type: "event",
  },
  {
    inputs: [],
    name: "CAPTAIN_POINTS",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_MAX_TEAMS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MODERATOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MULTIPLIER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PLAYER_POINTS",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PRECISION",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VICE_CAPTAIN_POINTS",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamA",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamB",
            type: "uint256",
          },
        ],
        internalType: "struct MatchInputData[]",
        name: "_matches",
        type: "tuple[]",
      },
    ],
    name: "addMatches",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_teamIds",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isForeignPlayer",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "playerCredit",
            type: "uint8",
          },
          {
            internalType: "enum PlayerType",
            name: "playerType",
            type: "uint8",
          },
        ],
        internalType: "struct PlayerInputData[][]",
        name: "_teamDataArray",
        type: "tuple[][]",
      },
    ],
    name: "addPlayers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_validator",
        type: "address",
      },
    ],
    name: "addValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "claimRewardsTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contestId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_teamId",
        type: "uint256",
      },
      {
        internalType: "int256[]",
        name: "_currentScores",
        type: "int256[]",
      },
    ],
    name: "computeRealTimeScore",
    outputs: [
      {
        internalType: "int256",
        name: "score",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contestId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_teamId",
        type: "uint256",
      },
    ],
    name: "computeScores",
    outputs: [
      {
        internalType: "int256",
        name: "score",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contestTemplateManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contests",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "entryFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "validatorIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTeams",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "contestTemplate",
            type: "address",
          },
        ],
        internalType: "struct CreateContestInputData[]",
        name: "_contestData",
        type: "tuple[]",
      },
    ],
    name: "createContests",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contestId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "captainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "viceCaptainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "playerIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "substitutes",
            type: "uint256[]",
          },
        ],
        internalType: "struct UserTeamInputData",
        name: "_team",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_metadata",
        type: "bytes",
      },
    ],
    name: "createTeamAndJoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_entryFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxTeams",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_feeReceiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_contestTemplate",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "captainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "viceCaptainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "playerIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "substitutes",
            type: "uint256[]",
          },
        ],
        internalType: "struct UserTeamInputData",
        name: "_team",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_metadata",
        type: "bytes",
      },
    ],
    name: "createUserContestAndJoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ecdsaOwnershipRegistryModule",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contestId",
        type: "uint256",
      },
    ],
    name: "getContestData",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "resultsUploaded",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalTeams",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTeams",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "validatorAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "contestTemplate",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "entryFee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "feeReceiver",
            type: "address",
          },
        ],
        internalType: "struct ContestInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
    ],
    name: "getMatchData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamA",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamB",
            type: "uint256",
          },
        ],
        internalType: "struct MatchData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
    ],
    name: "getMatchOutcome",
    outputs: [
      {
        internalType: "enum MatchOutcome",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_playerId",
        type: "uint256",
      },
    ],
    name: "getMatchPlayerScores",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_playerId",
        type: "uint256",
      },
    ],
    name: "getPlayerData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "teamId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamPosition",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isForeignPlayer",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "playerCredit",
            type: "uint8",
          },
          {
            internalType: "enum PlayerType",
            name: "playerType",
            type: "uint8",
          },
        ],
        internalType: "struct PlayerData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProxyAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_teamId",
        type: "uint256",
      },
    ],
    name: "getTeamPlayers",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contestId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserTeamCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contestId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_teamId",
        type: "uint256",
      },
    ],
    name: "getUserTeamData",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "userTeamNo",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "captainId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "viceCaptainId",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "playerIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "substitutes",
            type: "uint256[]",
          },
        ],
        internalType: "struct UserTeamData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_leagueId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_ecdsaOwnershipRegistryModule",
        type: "address",
      },
      {
        internalType: "address",
        name: "_protocolFeeReceiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_contestTemplateManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "leagueId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFeeReceiver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "recoverTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_teamIds",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isForeignPlayer",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "playerCredit",
            type: "uint8",
          },
          {
            internalType: "enum PlayerType",
            name: "playerType",
            type: "uint8",
          },
        ],
        internalType: "struct PlayerInputData[][]",
        name: "_teamDataArray",
        type: "tuple[][]",
      },
      {
        internalType: "bytes[]",
        name: "_teamMetadataArray",
        type: "bytes[]",
      },
    ],
    name: "registerTeams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
    ],
    name: "removeMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_teamIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[][]",
        name: "_playerIdsArray",
        type: "uint256[][]",
      },
    ],
    name: "removePlayers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "removeTeam",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "callerConfirmation",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamA",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "teamB",
            type: "uint256",
          },
        ],
        internalType: "struct MatchInputData",
        name: "_match",
        type: "tuple",
      },
    ],
    name: "updateMatchInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_playerIds",
        type: "uint256[]",
      },
      {
        internalType: "uint8[]",
        name: "_playerCredits",
        type: "uint8[]",
      },
    ],
    name: "updatePlayerCredits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isForeignPlayer",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "playerCredit",
            type: "uint8",
          },
          {
            internalType: "enum PlayerType",
            name: "playerType",
            type: "uint8",
          },
        ],
        internalType: "struct PlayerInputData[]",
        name: "_playersInputData",
        type: "tuple[]",
      },
    ],
    name: "updatePlayerDetails",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contestId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_teamId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "captainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "viceCaptainIndex",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "playerIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "substitutes",
            type: "uint256[]",
          },
        ],
        internalType: "struct UserTeamInputData",
        name: "_team",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_metadata",
        type: "bytes",
      },
    ],
    name: "updateUserTeam",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
      {
        internalType: "enum MatchOutcome",
        name: "_matchOutcome",
        type: "uint8",
      },
      {
        internalType: "uint256[]",
        name: "_playerIds",
        type: "uint256[]",
      },
      {
        internalType: "int256[]",
        name: "_playerScores",
        type: "int256[]",
      },
    ],
    name: "uploadMatchResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_contestId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_teamIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_rewards",
        type: "uint256[]",
      },
    ],
    name: "uploadTopNResults",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "validators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export default League_abi;
