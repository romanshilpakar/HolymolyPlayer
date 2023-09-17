"use client";

import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useUserAddress from "@/hooks/useUserAddress";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const revalidate = 0;


const Header: React.FC<HeaderProps> = ({
  children,
  className,
}) => {
  const router = useRouter();
  const {userAddress} = useUserAddress();

  const handleConnectWallet = ()=>{
    if(!userAddress){
      toast.error("Please Install Metamask Wallet");
    }else if(userAddress == "Other Network"){
      toast.error("Please Switch to Sepolia Testnet");
    }
  }
 

  return (
    <div
      className={twMerge(`
        h-fit 
        bg-gradient-to-b 
        from-emerald-800 
        p-6
        `,
        className
      )}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button 
            onClick={() => router.back()} 
            className="
              rounded-full 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button 
            onClick={() => router.forward()} 
            className="
              rounded-full 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button 
            onClick={() => router.push('/')} 
            className="
              rounded-full 
              p-2 
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button 
            onClick={() => router.push('/search')} 
            className="
              rounded-full 
              p-2 
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">

          {!userAddress || userAddress === "Other Network" ? (
            <div>
              <Button onClick={handleConnectWallet} className="bg-white px-6 py-2">
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="flex gap-x-4 items-center">
              <Button className="bg-white px-6 py-2">
                {userAddress.length > 10 ? userAddress.slice(0, 10) + "......." : userAddress}
              </Button>
              <Button className="bg-white">
                <FaUserAlt />
              </Button>
            </div>
          )}

        </div>
      </div>
      {children}
    </div>
  );
}

export default Header;