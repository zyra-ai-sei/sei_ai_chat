import Button from '@/components/common/button'

import { useEffect, useState } from 'react'
import CookieIcon from '@/assets/common/cookie.svg?react';
import "./index.scss"
import useLocalStorage from '@/hooks/useLocalStorage';
import { LocalStorageIdEnum } from '@/enum/utility.enum';
import SecondaryButton from '@/components/common/button/secondaryButton';
import { useAppSelector } from '@/hooks/useRedux';
import { Switch } from 'antd';

interface CookiesProps {
    isCenterAlignPopupOpen: boolean,
    setIsCenterAlignPopupOpen: (arg: boolean) => void,
}

const CookiePopup = ({ setIsCenterAlignPopupOpen, isCenterAlignPopupOpen }: CookiesProps) => {
    // eslint-disable-next-line
    const [_, setCookie]: [object | null, Function] = useLocalStorage(LocalStorageIdEnum.COOKIE_DATA, null)
    const [isFunctionalCookies, setFunctionalCookies] = useState(false);
    const [isPerformanceCookies, setPerformanceCookies] = useState(true);
    const [customize, setCustomize] = useState(false);

    const isMobile = useAppSelector((state) => state?.globalData?.isMobile);

    const handleCookieButton = () => {
        setCookie({
            necessary: true,
            functional: true,
            performance: true
        })
        setIsCenterAlignPopupOpen(false);
    }

    const handleSelectedCookies = () => {
        setCookie({
            necessary: true,
            functional: isFunctionalCookies,
            performance: isPerformanceCookies
        })
        setIsCenterAlignPopupOpen(false);
    }

    const handleNecessaryCookies = () => {
        setCookie({
            necessary: true,
            functional: false,
            performance: false
        })
        setIsCenterAlignPopupOpen(false);
    }

    useEffect(() => {
        if (!isMobile) {
            handleNecessaryCookies()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile])

    if (!isCenterAlignPopupOpen) {
        return null; // Skip rendering entirely
      }

    return (
        <div  style={{ fontFamily: "'Schibsted Grotesk', sans-serif" }} className="fixed z-10 flex justify-center w-full overflow-hidden bottom-1 joinBackground">
            <section className="h-fit w-full joinBackground max-w-[907px] rounded-[10px] shadow1 px-[24px] py-[16px] flex flex-col  md:flex-row items-start  md:justify-between ">
                <div className="mt-[16px] md:mt-[0px]">
                    <div className='flex items-center gap-2'>
                        <CookieIcon className="h-[32px] w-[32px] text-neutral-greys-950" />
                        <h5 className="typo-h5-semiBold text-neutral-greys-950">We use Cookies</h5>
                    </div>
                    <p className="text-neutral-greys-500 typo-b2-regular max-w-[447px] mt-[8px]">
                        We use cookies to ensure the best possible experience. By using Chaquen, you agree with our
                        <a target='_blank' href={"/privacyPolicy"} className='text-primary-main-400'>{" "}Cookie Policy</a>.
                    </p>
                </div>
                <div className={`${customize ? 'h-0 overflow-hidden' : 'h-8'} flex items-start gap-x-[16px] mt-[32px] md:mt-[0px]`}>
                    <Button
                        title="Accept"
                        onClick={handleCookieButton}
                    />

                    <SecondaryButton
                        title="Customise"
                        onClick={() => setCustomize?.(true)}
                    />
                </div>
                <div className={`pt-4 text-white w-full transition-all duration-300 ${customize ? 'h-[240px]' : 'h-0 overflow-hidden'} flex flex-col gap-[16px] size-4`}>
                    <div className='flex items-center justify-between'>
                        <h1>Necessary cookies</h1>
                        <Switch checked={true} onChange={() => { }} defaultChecked={true} />
                    </div>
                    <div className='flex items-center justify-between'>
                        <h1>Functional cookies</h1>
                        <Switch checked={isFunctionalCookies} onChange={setFunctionalCookies} />
                    </div>
                    <div className='flex items-center justify-between'>
                        <h1>Performance cookies</h1>
                        <Switch checked={isPerformanceCookies} onChange={setPerformanceCookies} defaultChecked={true} />
                    </div>

                    <Button
                        onClick={handleSelectedCookies}
                        title={"Allow selected cookies"} />
                    <SecondaryButton
                        onClick={handleNecessaryCookies}
                        title={"Allow necessary cookies only"} />

                </div>
            </section>
        </div>)
}

export default CookiePopup