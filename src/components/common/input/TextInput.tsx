
const TextInput = ({title, val, onChange, disabled=false, className=""}:{title:string, val:string, onChange:any, disabled?:boolean, className?:string}) => {
  return (
    <div className={`flex flex-col items-start p-3  ${className}`}>
    <label className="mb-1 text-xs text-white/60">{title}</label>
    <input 
      disabled={disabled} 
      type="text" 
      value={val} 
      onChange={(e)=>onChange(e.target.value)} 
      className={`bg-black/20 border border-white/60 rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus:border-white/80 transition-colors w-full ${
        disabled 
          ? 'text-white/40 cursor-not-allowed' 
          : 'text-white/60 focus:text-white'
      }`}
    />
    </div>
  )
}

export default TextInput