"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useUploadModal from "@/hooks/useUploadModal";
import useAuthModal from "@/hooks/useAuthModal";
import useUserAddress from "@/hooks/useUserAddress";
import { useEffect, useState } from "react";
import { Music } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";




const Library = () => {
    const uploadModal = useUploadModal();
    const authModal = useAuthModal();
    const {userAddress, state} = useUserAddress();
    const { contract } = state;
    const [myMusic, setMyMusic] = useState<Music[]>([]);
    const onPlay = useOnPlay(myMusic);

    useEffect(() => {
      const getMyMusic = async () => {
        if (contract){
          const mymusic = await contract.getMyMusics();
          setMyMusic(mymusic);
        }    
      };
      contract && getMyMusic();
      
    }, [contract])


    const onClick = () => {
        if (!userAddress) {
          return authModal.onOpen();
        }
        return uploadModal.onOpen();
      }




  return ( 
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">
            Your Musics
          </p>
        </div>
        <AiOutlinePlus 
          onClick={onClick} 
          size={20} 
          className="
            text-neutral-400 
            cursor-pointer 
            hover:text-white 
            transition
          "
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
      {myMusic.map((item) => (
          <MediaItem
            onClick={(id: string) => onPlay(id)} 
            key={item.tokenId} 
            data={item}
          />
        ))}
      </div>
    </div>
   );
}
 
export default Library;