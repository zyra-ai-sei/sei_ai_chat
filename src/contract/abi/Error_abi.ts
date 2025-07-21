export const errorAbi = [
    {
        "inputs": [],
        "name": "ContestAlreadyStarted",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidCaptainViceCaptain",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidCurrentScores",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidInput",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidPlayerCount",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "playerType",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "count",
            "type": "uint256"
          }
        ],
        "name": "InvalidPlayerTypeCount",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "MaxTeamsCreated",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "MaxUserCreditExceeded",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NoRewards",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotEnoughBattingPlayers",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotEnoughBowlingPlayers",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "playerId",
            "type": "uint256"
          }
        ],
        "name": "PlayerAlreadyInTeam",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "playerId",
            "type": "uint256"
          }
        ],
        "name": "PlayerNotInMatch",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "TeamAlreadyCreated",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "TeamNotCreated",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "TooManyPlayersInTeamA",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "TooManyPlayersInTeamB",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "Unauthorized",
        "type": "error"
      },
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "AccessControlBadConfirmation",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "neededRole",
            "type": "bytes32"
          }
        ],
        "name": "AccessControlUnauthorizedAccount",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "ERC1167FailedCreateClone",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "EndTimeNotReached",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "invalidAddress",
            "type": "address"
          }
        ],
        "name": "InvalidAddress",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidCurrentScores",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidMatchTime",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidNewPlayers",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidParamsLength",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
          }
        ],
        "name": "MatchAlreadyExists",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "MatchAlreadyStarted",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
          }
        ],
        "name": "MatchDoesNotExists",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotImplementedYet",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "teamId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "playerId",
            "type": "uint256"
          }
        ],
        "name": "PlayerAlreadyInTeam",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "matchId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "playerId",
            "type": "uint256"
          }
        ],
        "name": "PlayerNotInMatch",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "teamId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "playerId",
            "type": "uint256"
          }
        ],
        "name": "PlayerNotInTeam",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "teamId",
            "type": "uint256"
          }
        ],
        "name": "TeamAlreadyExists",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "teamId",
            "type": "uint256"
          }
        ],
        "name": "TeamDoesNotExist",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "TeamsCannotBeSame",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "AccessControlBadConfirmation",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "neededRole",
            "type": "bytes32"
          }
        ],
        "name": "AccessControlUnauthorizedAccount",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "allowance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
      },
      {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
      }
]