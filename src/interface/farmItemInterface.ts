export interface ITokenFilterItem {
  filterName: string;
  isSelected: boolean;
  iconName?: string;
  isDisabled?: boolean;
}

export interface IChainFilterItem {
  filterName: string;
  isSelected: boolean;
  iconName?: string;
  chainId: number;
  isDisabled?: boolean;
}
