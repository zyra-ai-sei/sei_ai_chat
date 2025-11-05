import Logo from "@/assets/header/logo.svg?react";
import Settings from "@/assets/header/settings.svg?react";
import Wallet from "@/assets/header/wallet.svg?react"
import { Link, useLocation } from "react-router-dom";
const Navbar = () => {
    const location = useLocation();
    
  const routes = [
      {
        name: "Chat",
        url: "/chat",
      },
    {
      name: "Dashboard",
      url: "/dashboard",
    },
    {
      name: "Transactions",
      url: "/transactions",
    },
  ];
  return (
    <div className="h-[64px] border-b-2 border-primary-border px-[24px] pt-[12px] gap-[100px] flex items-center justify-between">
      <h1 className="flex items-center gap-2 pb-[12px] shadow-">
        <Logo className="h-[40px] w-[40px]" />
        <h1 className="font-bold text-[34px] text-white">Zyra</h1>
      </h1>
      <ul className="flex items-end h-full gap-4 text-[20px] w-full ">
        {routes.map((route, index) => (
          <Link key={index} className={` ${location.pathname === route.url ? 'text-text-primary border-b border-b-text-secondary' : 'text-text-secondary'} pb-[12px] px-8`} to={route.url}>
            {route.name}
          </Link>
        ))}
      </ul>
      <div className="flex gap-3 pb-[12px]">
        <Wallet className="p-2 box-content text-[#fff] border-2 border-primary-border rounded-full size-[24px] "/>
        <Settings className="p-2 box-content text-[#fff] border-2 border-primary-border rounded-full size-[24px]"/>
      </div>
    </div>
  );
};

export default Navbar;
