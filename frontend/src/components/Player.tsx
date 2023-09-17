"use client";

import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";
import { useEffect, useState } from "react";
import { Music } from "@/types";
import useUserAddress from "@/hooks/useUserAddress";

const Player = () => {
  const player = usePlayer();
  const [allmusic, setAllmusic] = useState<Music[]>([]);
  const [music, setmusic] = useState<Music>();
  const [musicUrl, setMusicUrl] = useState<string>("");
  const {userAddress,state} = useUserAddress();
  const { contract } = state;
  const [buyStatus, setBuyStatus] = useState<boolean>(false);


  useEffect(() => {
    const getAllMusic = async () => {
      if (contract){
        const allmusic = await contract.getAllMusic();
        setAllmusic(allmusic);
      }    
    };
    contract && getAllMusic();
    
  }, [contract])

  useEffect(() => {
    const findMatchingMusic = () => {
      if (!allmusic || allmusic.length === 0 || !player.activeId) {
        return;
      }

      const matchingMusic = allmusic.find((music) => music.tokenId.toString() === player.activeId);
      if (matchingMusic) {
        setmusic(matchingMusic);
      }
    };
    findMatchingMusic();
  }, [allmusic, player.activeId]);

  useEffect(() => {
    if (music) {
      const cid = music.audioCID
      const musicCid = cid.replace("ipfs://", "");
      const musicUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/ipfs/${musicCid}`;
      setMusicUrl(musicUrl)

      if(userAddress){
        if (music.owner.toLowerCase() === userAddress.toLowerCase()) {
          setBuyStatus(true);
        }else if(music.author.toLowerCase() === userAddress.toLowerCase()){
          setBuyStatus(true);
        }else{
          setBuyStatus(false);
        }
      }
      
    }
  }, [music])
  


  if (!music || !musicUrl || !player.activeId) {
    return null;
  }

  return (
    <div 
      className="
        fixed 
        bottom-0 
        bg-black 
        w-full 
        py-2 
        h-[80px] 
        px-4
      "
    >
      <PlayerContent key={musicUrl} music={music} musicUrl={musicUrl} buyStatus={buyStatus}/>
    </div>
  );
}

export default Player;
