"use client";

import Image from "next/image";
import PlayButton from "./PlayButton";
import { Music } from "@/types";
import { AiFillHeart } from "react-icons/ai";



interface SongItemProps {
  data: Music;
  onClick: (id: string) => void;
}

const MusicBox: React.FC<SongItemProps> = ({
  data,
  onClick
}) => {
  const Cid = data.imageCID
  const parts = Cid.split("ipfs://");
  const imageCid = parts[1];

  return ( 
    <div
      className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        gap-x-4 
        bg-neutral-400/5 
        hover:bg-neutral-400/10 
        transition 
        p-3
      "
    >
      <div 
        className="
          relative 
          aspect-square 
          w-full
          h-full 
          rounded-md 
          overflow-hidden
        "
      >
        <Image
          className="object-cover"
          src={`https://${process.env.NEXT_PUBLIC_DOMAIN}/ipfs/${imageCid}`}
          fill
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">
          {data.musicName}
        </p>
        <p 
          className="
            text-neutral-400 
            text-sm 
            pb-4 
            w-full 
            truncate
          "
        >
          By {data.author.length > 10 ? data.author.slice(0, 10) + "......." : data.author}
        </p>
        <div className="flex items-center">
        <p className="pr-1">{Number(data.likes)}</p>
        <AiFillHeart style={{ color: '#22c55e' }} />
        <p className="ml-4">{Number(data.price)/ 10 ** 18} ETH</p>  
        </div>

      </div>
      <div 
        className="
          absolute 
          bottom-24 
          right-5
        "
      onClick={() => onClick(data.tokenId.toString())} 

      >
        <PlayButton />
      </div>
    </div>
   );
}
 
export default MusicBox;