import { ErrorDecoder } from 'ethers-decode-error'
import { errorAbi } from "@/contract/abi/Error_abi";

export const errorDecoder = ErrorDecoder.create([errorAbi])