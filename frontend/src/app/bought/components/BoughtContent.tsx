"use client";

import { useEffect, useState } from "react";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import useUserAddress from "@/hooks/useUserAddress";
import { Music } from "@/types";


const BoughtContent= () => {
  const [boughtMusic, setBoughtMusic] = useState<Music[]>([]);
  const {state} = useUserAddress();
  const { contract } = state;
  const onPlay = useOnPlay(boughtMusic);
 

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
    <div className="flex flex-col gap-y-2 w-full p-6">
      {boughtMusic.map((music: any) => (
        <div 
          key={music.tokenId} 
          className="flex items-center gap-x-4 w-full"
        >
          <div className="flex-1">
            <MediaItem
            onClick={(id) => onPlay(id)} 
            data={music} />
          </div>
          <LikeButton musicId={music.tokenId} />
        </div>
      ))}
    </div>
  );
}
 
export default BoughtContent;
