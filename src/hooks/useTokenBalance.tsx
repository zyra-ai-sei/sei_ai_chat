import { Address, erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

type useTokenBalanceParameters = {
    address: Address,
    token: Address,
    chainId: number|undefined
}

export const useTokenBalance = ({address,token,chainId}:useTokenBalanceParameters) => {
        const result = useReadContracts({ 
            allowFailure: true, 
            contracts: [ 
              { 
                address: token, 
                abi: erc20Abi, 
                functionName: 'balanceOf', 
                chainId: chainId,
                args: [address as Address], 
              }, 
              { 
                address: token, 
                abi: erc20Abi, 
                functionName: 'decimals', 
              }, 
              { 
                address: token, 
                abi: erc20Abi, 
                functionName: 'symbol', 
              }, 
            ],

          })
        
  return (
   {data:  {
    value:result?.data?.[0]?.result,
    decimals: result?.data?.[1]?.result,
    symbol: result?.data?.[2]?.result
  },
isFetched:result?.isFetched
}
  )
}

