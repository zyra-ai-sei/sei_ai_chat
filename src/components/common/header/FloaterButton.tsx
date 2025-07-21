import Message from "@/assets/common/comment.svg?react"
import Cross from "@/assets/common/crossCurrent.svg?react"
import Whatsapp from "@/assets/common/whatsapp.svg?react"
import Telegram from "@/assets/common/telegrramCurrent.svg?react"
import { useState } from "react";
import { telegramLink, whatsAppLink } from "@/constants/floaterIcon.constant";

const FloaterButton = () => {
    const [isOpened, setIsOpened] = useState(false);
    return (
        <>
            <div onClick={() => { setIsOpened(!isOpened) }} className={`absolute -top-14 right-6 ${isOpened ? 'bg-neutral-greys-200' : 'bg-primary-main-500'} w-[40px] h-[40px] flex items-center justify-center rounded-[13px]`}>
                {
                    isOpened ? (
                        <Cross className="w-[16px] h-[16px] text-white " />

                    ) : (

                        <Message className="w-[16px] h-[16px]" />
                    )
                }
                <a
                    href={telegramLink}
                    target="_blank"
                    onClick={(e) => { e.stopPropagation() }}
                    className={`absolute   w-[40px] h-[40px] flex items-center justify-center rounded-[13px] bg-[#24A1DE] transform transition-all duration-300 ease-linear ${isOpened ? "opacity-100 -translate-y-24 scale-100 pointer-events-auto" : "opacity-0  scale-0 pointer-events-none"}`}
                >
                    <Telegram className="text-white" />
                </a>
                <a
                    href={whatsAppLink}
                    target="_blank"
                    onClick={(e) => { e.stopPropagation() }}
                    className={`absolute   w-[40px] h-[40px] flex items-center justify-center rounded-[13px] bg-[#32CC2A] transform transition-all duration-300 ease-linear ${isOpened ? "opacity-100 -translate-y-12 scale-100 pointer-events-auto" : "opacity-0  scale-0  pointer-events-none"}`}
                >
                    <Whatsapp />
                </a>
            </div>
        </>
    )
}

export default FloaterButton