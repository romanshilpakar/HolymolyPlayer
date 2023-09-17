"use client";

import useOnPlay from "@/hooks/useOnPlay";
import { Music } from "@/types";
import MusicBox from "@/components/MusicBox";

interface SearchContentProps {
  searchedMusic: Music[];
}

const SearchContent = ({ searchedMusic }: SearchContentProps) => {
  const onPlay = useOnPlay(searchedMusic);


  if (searchedMusic.length === 0) {
    return (
      <div 
        className="
          flex 
          flex-col 
          gap-y-2 
          w-full 
          px-6 
          text-neutral-400
        "
      >
        No musics found.
      </div>
    )
  }

  return ( 
    <div className="
    grid 
    grid-cols-2 
    sm:grid-cols-3 
    md:grid-cols-3 
    lg:grid-cols-4 
    xl:grid-cols-5 
    2xl:grid-cols-8 
    gap-4 
    mt-4
    ml-4
    ">
      {searchedMusic.map((music: Music) => (
          <>
            <MusicBox
              onClick={(id: string) => onPlay(id)} 
              key={music.tokenId} 
              data={music}
            />
          </>

        
      ))}
    </div>
  );
}
 
export default SearchContent;