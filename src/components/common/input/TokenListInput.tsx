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
import { Token } from "@/redux/tokenData/reducer";

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
  // Your token selection logic here
  const tokenList = useAppSelector((state) => state.tokenData.list);

  const [currentToken, setCurrentToken] = useState<null|Token>(null);

  useEffect(()=>{
    const token = tokenList.find((token)=>(token?.address == val))
    if(token)
    setCurrentToken(token)
  },[val])
  
  return (
    <div className={`flex flex-col p-3 ${className} `}>
      <label>{title}</label>
      <Select>
        <SelectTrigger className="w-full border-none bg-zinc-800">
          <SelectValue placeholder={currentToken?.symbol} />
        </SelectTrigger>
        <SelectContent className="border-none text-zinc-500 bg-zinc-800">
          <SelectGroup >
            <SelectLabel>Tokens</SelectLabel>
            {
              tokenList?.map((token)=>(
                <SelectItem onClick={()=>(onChange(token?.address))} value={token?.address} className="hover:bg-zinc-800 focus:bg-zinc-600 bg-zinc-800">{token?.symbol}</SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TokenListInput;
