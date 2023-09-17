"use client";

import Image from "next/image";
import { Music } from "@/types";
import usePlayer from "@/hooks/usePlayer";

interface MediaItemProps {
  data: Music;
  onClick?: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  onClick,
}) => {
  const player = usePlayer();
  const Cid = data.imageCID
  const parts = Cid.split("ipfs://");
  const imageCid = parts[1];


  const handleClick = () => {
    if (onClick) {
      return onClick(data.tokenId.toString());
    }
  
    return player.setId(data.tokenId.toString());
  };

  return ( 
    <div
    onClick={handleClick}
      className="
        flex 
        items-center 
        gap-x-3 
        cursor-pointer 
        hover:bg-neutral-800/50 
        w-full 
        p-2 
        rounded-md
      "
    >
      <div 
        className="
          relative 
          rounded-md 
          min-h-[48px] 
          min-w-[48px] 
          overflow-hidden
        "
      >
        <Image
          fill
          src={`https://${process.env.NEXT_PUBLIC_DOMAIN}/ipfs/${imageCid}`}
          alt="MediaItem"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{data.musicName}</p>
        <p className="text-neutral-400 text-sm truncate">
          By {data.author.length > 10 ? data.author.slice(0, 10) + "...." : data.author}
        </p>
      </div>
    </div>
  );
}
 
export default MediaItem;
