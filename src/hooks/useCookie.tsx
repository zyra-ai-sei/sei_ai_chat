import { useState, useEffect } from "react";
import Cookies from "js-cookie";

type CookieOptions = Cookies.CookieAttributes;

const useCookie = <T extends object>(
  cookieName: string,
  defaultValue: T
): {
  cookieValue: T | null;
  setCookie: (value: T, options?: CookieOptions) => void;
  removeCookie: (options?: CookieOptions) => void;
} => {
  const [cookieValue, setCookieValue] = useState<T | null>(() => {
    const cookie = Cookies.get(cookieName);
    
    try{
      return cookie ? JSON.parse(cookie) : defaultValue;
    } catch(err){
      return cookie ? JSON.parse(JSON.stringify(cookie)) : defaultValue
    }
  });

  const setCookie = (value: T, options: CookieOptions = {}): void => {
    Cookies.set(cookieName, JSON.stringify(value), {
      expires: 365,
      ...options,
    });
    setCookieValue(value);
  };

  const removeCookie = (options: CookieOptions = {}): void => {
    Cookies.remove(cookieName, options);
    setCookieValue(null);
  };

  useEffect(() => {
    const updateCookieValue = () => {
      const  cookie = Cookies.get(cookieName);
     try{
       setCookieValue(cookie ? JSON.parse(cookie) : defaultValue);
      }catch(err){
        setCookieValue(cookie ? JSON.parse(JSON.stringify(cookie)) : defaultValue)
      }
    };

    const cookieUpdateInterval = setInterval(updateCookieValue, 1000);

    return () => clearInterval(cookieUpdateInterval);
  }, [cookieName, defaultValue]);

  return { cookieValue, setCookie, removeCookie };
};

export default useCookie;
