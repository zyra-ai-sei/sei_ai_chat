import { useNavigate } from "react-router-dom"

export const LaunchButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={()=>navigate('/chat')} className='bg-[#3B82F6] rounded-full py-1 md:py-2 px-3 cursor-pointer backdrop-blur-sm hover:bg-[#3575dd] transition-all duration-500 md:px-5 text-white text-[12px] md:text-[16px] font-light'>
        Launch App
    </button>
  )
}
