export function getArgNames(abi:any, functionName:string|undefined){
   if(!abi || !functionName) return null;
   let args = abi?.find((obj:any)=>(obj?.name == functionName && obj?.type == "function")).inputs.find((obj:any)=>("components" in obj))?.components
   if(args == undefined || args == null){
       args =  abi?.find((obj:any)=>(obj?.name == functionName && obj?.type == "function")).inputs;
   }
   const res = args.map((arg:any)=>arg?.name);
   return res;
}