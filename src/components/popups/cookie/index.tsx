import { useEffect, useState } from 'react'
import "./index.scss"
import useLocalStorage from '@/hooks/useLocalStorage';
import { LocalStorageIdEnum } from '@/enum/utility.enum';
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

    if (!isCenterAlignPopupOpen || window.location.pathname === '/') {
        return null;
    }

    return (
        <div className="fixed z-50 bottom-0 left-0 right-0 flex justify-center p-4 pointer-events-none">
            <section 
                className="pointer-events-auto w-full max-w-[520px] rounded-2xl border border-white/10 bg-[#15141A]/95 backdrop-blur-xl shadow-[0_-4px_40px_rgba(0,0,0,0.5)] p-6 font-['Figtree',sans-serif]"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                            <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
                            <circle cx="15" cy="9" r="1" fill="currentColor"/>
                            <circle cx="11" cy="15" r="1.5" fill="currentColor"/>
                            <circle cx="16" cy="14" r="1" fill="currentColor"/>
                        </svg>
                    </div>
                    <h5 className="text-white font-semibold text-base">We use Cookies</h5>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                    We use cookies to ensure the best possible experience. By using Zyra, you agree with our{" "}
                    <a href="/cookie-policy" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">
                        Cookie Policy
                    </a>.
                </p>

                {/* Customize section */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${customize ? 'max-h-[300px] mb-5' : 'max-h-0'}`}>
                    <div className="space-y-3 pb-1">
                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/5 border border-white/5">
                            <div>
                                <p className="text-white text-sm font-medium">Necessary</p>
                                <p className="text-gray-500 text-xs mt-0.5">Required for core functionality</p>
                            </div>
                            <Switch 
                                checked={true} 
                                disabled 
                                className="cookie-switch"
                            />
                        </div>
                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/5 border border-white/5">
                            <div>
                                <p className="text-white text-sm font-medium">Functional</p>
                                <p className="text-gray-500 text-xs mt-0.5">Enhanced features & personalization</p>
                            </div>
                            <Switch 
                                checked={isFunctionalCookies} 
                                onChange={setFunctionalCookies}
                                className="cookie-switch"
                            />
                        </div>
                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/5 border border-white/5">
                            <div>
                                <p className="text-white text-sm font-medium">Performance</p>
                                <p className="text-gray-500 text-xs mt-0.5">Analytics & usage insights</p>
                            </div>
                            <Switch 
                                checked={isPerformanceCookies} 
                                onChange={setPerformanceCookies}
                                className="cookie-switch"
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                {!customize ? (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCookieButton}
                            className="flex-1 px-4 py-2.5 rounded-full bg-white text-[#0D0C11] text-sm font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Accept All
                        </button>
                        <button
                            onClick={() => setCustomize(true)}
                            className="flex-1 px-4 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                        >
                            Customize
                        </button>
                        <button
                            onClick={handleNecessaryCookies}
                            className="px-4 py-2.5 rounded-full text-gray-500 text-sm hover:text-gray-300 transition-colors"
                        >
                            Reject
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSelectedCookies}
                            className="flex-1 px-4 py-2.5 rounded-full bg-white text-[#0D0C11] text-sm font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Save Preferences
                        </button>
                        <button
                            onClick={handleNecessaryCookies}
                            className="px-4 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                        >
                            Necessary Only
                        </button>
                    </div>
                )}
            </section>
        </div>
    )
}

export default CookiePopup