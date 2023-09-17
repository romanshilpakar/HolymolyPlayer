"use client";

import { useEffect, useState } from "react";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import useUserAddress from "@/hooks/useUserAddress";
import { Music } from "@/types";


const LikedContent= () => {
  const [likedMusic, setLikedMusic] = useState<Music[]>([]);
  const {state} = useUserAddress();
  const { contract } = state;
  const onPlay = useOnPlay(likedMusic);
 

  useEffect(() => {
    const getLikedMusic = async () => {
      if (contract){
        const likedmusic = await contract.getLikedMusicByUser();
        setLikedMusic(likedmusic);
      }    
    };
    contract && getLikedMusic();
    
  }, [contract])

  if (likedMusic.length === 0) {
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
        No liked musics.
      </div>
    )
  }
  return ( 
    <div className="flex flex-col gap-y-2 w-full p-6">
      {likedMusic.map((music: any) => (
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
 
export default LikedContent;
