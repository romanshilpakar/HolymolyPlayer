"use client"
import useUserAddress from "@/hooks/useUserAddress";
import { useEffect, useState } from "react";
import useOnPlay from "@/hooks/useOnPlay";
import MusicBox from "@/components/MusicBox";
import { Music } from "@/types";


const Allmusic = () => {
    const [allmusic, setAllmusic] = useState<Music[]>([]);
    const {state} = useUserAddress();
    const { contract } = state;
    const onPlay = useOnPlay(allmusic);

    useEffect(() => {
        const getAllMusic = async () => {
          if (contract){
            const allmusic = await contract.getAllMusic();
            setAllmusic(allmusic);
          }    
        };
        contract && getAllMusic();
        
      }, [contract])

     
      

      if (allmusic.length === 0) {
        return (
          <div className="mt-4 text-neutral-400">
            No musics available.
          </div>
        )
      }

  return (
   
    <div 
    className="
      grid 
      grid-cols-2 
      sm:grid-cols-3 
      md:grid-cols-3 
      lg:grid-cols-4 
      xl:grid-cols-5 
      2xl:grid-cols-8 
      gap-4 
      mt-4
    "
  >
    {allmusic.map((item) => (
      <MusicBox
        onClick={(id: string) => onPlay(id)} 
        key={item.tokenId} 
        data={item}
      />
    ))}
  </div>
  )
}

export default Allmusic