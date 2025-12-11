import { useAppSelector } from "@/hooks/useRedux";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Token, selectTokensByChain } from "@/redux/tokenData/reducer";
import { useChainId } from "wagmi";

const TokenListInput = ({
  title,
  val,
  onChange,
  className = "",
}: {
  title: string;
  val: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  // Get current chain ID from wagmi
  const chainId = useChainId();
  // Get tokens for the current chain
  const tokenList = useAppSelector(selectTokensByChain(chainId));

  const [currentToken, setCurrentToken] = useState<null|Token>(null);

  useEffect(()=>{
    const token = tokenList.find((token)=>(token?.address == val))
    if(token)
    setCurrentToken(token)
  },[val])
  
  return (
    <div className={`flex flex-col gap-2 p-3 ${className} `}>
      <label className="text-[11px] uppercase tracking-[0.35em] text-white/40">{title}</label>
      <Select>
        <SelectTrigger className="w-full rounded-2xl border border-white/15 bg-[#05060f]/60 px-4 py-3 text-sm font-medium text-white/80 outline-none transition focus:border-white/50 focus:bg-[#090b18]/70">
          <SelectValue placeholder={currentToken?.symbol} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-white/20 bg-[#0a0d14] text-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <SelectGroup>
            <SelectLabel className="text-white/50">Tokens</SelectLabel>
            {
              tokenList?.map((token)=>(
                <SelectItem onClick={()=>(onChange(token?.address))} value={token?.address} className="text-white/80 hover:bg-white/10 focus:bg-white/15 focus:text-white">{token?.symbol}</SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TokenListInput;
