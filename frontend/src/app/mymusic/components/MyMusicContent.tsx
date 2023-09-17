"use client";

import { useEffect, useState } from "react";
import useUserAddress from "@/hooks/useUserAddress";
import { Music } from "@/types";
import Library from "@/components/Library";


const MyMusicContent= () => {
  const [boughtMusic, setBoughtMusic] = useState<Music[]>([]);
  const {state} = useUserAddress();
  const { contract } = state;
 

  useEffect(() => {
    const getBoughtdMusic = async () => {
      if (contract){
        const boughtmusic = await contract.getMyBoughtMusics();
        setBoughtMusic(boughtmusic);
      }    
    };
    contract && getBoughtdMusic();
    
  }, [contract])

  if (boughtMusic.length === 0) {
    return (
      <div 
        className="
          flex 
          flex-col 
          gap-y-2 
          w-full px-6 
          text-neutral-400
        "
      >
        No Bought musics.
      </div>
    )
  }
  return ( 
    
    <Library/>

  );
}
 
export default MyMusicContent;
