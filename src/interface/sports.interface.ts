import { TokenTypeEnum } from "@/enum/utility.enum";

export interface ISportsFilterItem {
  filterName: string;
  isSelected: boolean;
  iconName: string;
  isDisabled: boolean;
}

export interface ITeamFilterItem {
  filterName: string;
  isSelected: boolean;
  isDisabled?: boolean;
  iconName?: string;
}

export interface ICoinFilterItem {
  filterName: TokenTypeEnum;

  iconName: string;
}

export interface ITokenFilterItem {
  filterName: string;
  isSelected: boolean;
  iconName: string;
  filterSubName: string;
  isDisabled?: boolean;
}

export interface ILeagueFilterItem {
  filterName: string;
  filterId: string;
  isSelected: boolean;
  isDisabled?: boolean;
  iconName?: string;
}

export interface IContestFilterItem {
  filterName: string;
  isSelected: boolean;
  isDisabled?: boolean;
  iconName?: string;
}
