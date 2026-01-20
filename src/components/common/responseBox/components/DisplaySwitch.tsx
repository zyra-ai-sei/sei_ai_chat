

const DisplaySwitch = ({display, setDisplay}:{display:string, setDisplay: (val:string)=>void}) => {

  return (
      <div className={`sticky top-2 left-auto right-auto h-[42px] flex items-center z-50 p-2 mx-auto rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl w-[200px]`}>
        <div className='relative flex justify-between w-full'>
<div 
  className={`
    w-[90px] h-[26px] absolute bottom-0 top-0 m-auto rounded-full bg-white/10
    transition-transform duration-300 ease-in-out
    left-[1px]
    ${display === 'home' ? 'translate-x-0' : 'translate-x-[calc(100%)]'}
  `}
/>

        <button onClick={()=>setDisplay('home')} className={`flex-1 text-center font-light text-white/30 transition-all ${display == 'home' ? 'text-white/50 text-[18px]' : 'text-white/30 text-[16px]'}`}>
          Home
        </button>

        <button onClick={()=>setDisplay('canvas')} className={`flex-1  text-center font-light  text-white/30 transition-all ${display == 'canvas' ? 'text-white/50 text-[18px]' : 'text-white/30 text-[16px]'}`}>
          Canvas
        </button>
        </div>
        
      </div>
  );
};

export default DisplaySwitch;