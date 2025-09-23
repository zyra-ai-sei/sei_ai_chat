
const TextInput = ({title, val, onChange, disabled=false, className=""}:{title:string, val:string, onChange:any, disabled?:boolean, className?:string}) => {
  return (
    <div className={`flex flex-col items-start p-3  ${className}`}>
    <label htmlFor="">{title}</label>
    <input disabled={disabled} type="text" value={val} onChange={onChange} className={`border border-none rounded-md px-2 py-2 bg-white/10 outline-none ${disabled ? 'text-zinc-600 bg-zinc-300/10' : 'text-white'} w-full`}/>
    </div>
  )
}

export default TextInput