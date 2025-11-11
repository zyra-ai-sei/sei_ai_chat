import { createAsyncThunk } from "@reduxjs/toolkit";
import {Token, tokenDataSlice} from "./reducer";
import { IRootState } from "../store";
import { axiosInstance } from "@/services/axios";

export const {
    addToken,
    clearCustomTokens: clearTokens
} = tokenDataSlice.actions

interface AddCutomTokenOptions {
    address: string;
    onSuccessCb?: ()=>void;
    onFailureCb?: ()=>void;
}

interface ClearCustomTokensOptions {
       onSuccessCb?: ()=>void;
    onFailureCb?: ()=>void; 
}

export const addCustomToken = createAsyncThunk<
void,
AddCutomTokenOptions,
{state: IRootState}
>(
    "addCustomToken",
    async({onFailureCb, onSuccessCb, address}, {dispatch}) => {
        try{
            const response = await axiosInstance.get(`token/info/${address}`);
            const data:Token = response?.data?.data?.data;
            if(data){
                dispatch(addToken(data));
                if(onSuccessCb){
                    onSuccessCb();
                }
            }
            if(onFailureCb){
                onFailureCb()
            }
        } catch(err){
            if(onFailureCb){
                onFailureCb();
            }
        }
    }
)

export const clearCustomTokens = createAsyncThunk<
void,
ClearCustomTokensOptions,
{state:IRootState}
>(
 "clearCustomTokens", 
 async({onSuccessCb, onFailureCb},{dispatch}) => {
    try{
        dispatch(clearTokens());
        if(onSuccessCb){
            onSuccessCb;
        }
    } catch(err){
        if(onFailureCb){
            onFailureCb();
        }
    }
 }
)