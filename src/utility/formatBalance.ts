import { formatUnits as format } from "viem";

export function formatBalance(value: bigint | undefined, decimals: number | undefined):string {

if(value == undefined || decimals == undefined){
    return "-";
}

return (format(value,decimals));

}