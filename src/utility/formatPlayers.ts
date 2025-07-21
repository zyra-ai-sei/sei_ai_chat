import { PlayerFormatEnum } from "@/enum/playerFormat.enum";
import { PlayerProps } from "@/interface/player.interface";

export const formatPlayers = ({
  activePlayerFormat,
  isMobileView,
  mobileStep,
  filteredPlayerList,
  searchInputValue,
}: {
  activePlayerFormat: string;
  isMobileView: boolean | undefined;
  mobileStep: number;
  filteredPlayerList: PlayerProps[];
  searchInputValue: string;
}) => {
  let filteredPlayersInitial: PlayerProps[];

  if (mobileStep === 3 && isMobileView) {
    switch (activePlayerFormat) {
      case "WK":
        filteredPlayersInitial = filteredPlayerList.filter(
          (player) => player.format === PlayerFormatEnum.WK && !player.isMain
        );
        break;
      case "AR":
        filteredPlayersInitial = filteredPlayerList.filter(
          (player) => player.format === PlayerFormatEnum.AR && !player.isMain
        );
        break;
      case "BAT":
        filteredPlayersInitial = filteredPlayerList.filter(
          (player) => player.format === PlayerFormatEnum.BAT && !player.isMain
        );
        break;
      case "BOWL":
        filteredPlayersInitial = filteredPlayerList.filter(
          (player) => player.format === PlayerFormatEnum.BOWL && !player.isMain
        );
        break;
      default:
        filteredPlayersInitial = [];
    }
  } else {
    switch (activePlayerFormat) {
      case "WK":
        filteredPlayersInitial = filteredPlayerList.filter(
          (player) => player.format === PlayerFormatEnum.WK
        );
        break;
      case "AR":
        filteredPlayersInitial = filteredPlayerList.filter(
          (player) => player.format === PlayerFormatEnum.AR
        );
        break;
      case "BAT":
        filteredPlayersInitial = filteredPlayerList.filter(
          (player) => player.format === PlayerFormatEnum.BAT
        );
        break;
      case "BOWL":
        filteredPlayersInitial = filteredPlayerList.filter(
          (player) => player.format === PlayerFormatEnum.BOWL
        );
        break;
      default:
        filteredPlayersInitial = [];
    }
  }
  const trimmedSearchValue = searchInputValue?.trim();

  if (!trimmedSearchValue) {
    return filteredPlayersInitial;
  } else {
    return filteredPlayersInitial.filter((player) =>
      player.fullName.toLowerCase().includes(trimmedSearchValue.toLowerCase())
    );
  }
};
