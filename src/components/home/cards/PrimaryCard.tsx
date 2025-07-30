
const PrimaryCard = ({index,title,content}:{index:string, title:string, content:string}) => {
  return (
    <div className='flex p-3 bg-red-200 w-fit max-w-[283px] gap-[20px] rounded-[20px] min-h-[217px] bg-gradient-to-br from-[#15161F] to-[#0D0F19]'>
        
        <h1 className='text-[min(8vw,40px)] text-[#57585D] font-semibold'>
            {index}
        </h1>
        <div className='flex flex-col'>
            <h1 className='text-[min(6vw,24px)] text-white'>
                {title}
            </h1>
            <p className='line-clamp-3 text-[#64748B]'>
              {content}
            </p>
        </div>
    </div>
  )
}

export default PrimaryCard