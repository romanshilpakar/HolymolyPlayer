"use client"
import SearchInput from "@/components/SearchInput";
import Header from "@/components/Header";
import SearchContent from "./components/SearchContent";
import { Music } from "@/types";
import { useEffect, useState } from "react";
import useUserAddress from "@/hooks/useUserAddress";


export const revalidate = 0;

interface SearchProps {
  searchParams: { title: string }
};

const Search =  ({ searchParams }: SearchProps) => {
  const [allmusic, setAllmusic] = useState<Music[]>([]);
  const [searchedMusic, setSearchedMusic] = useState<Music[]>([]);
  const {state} = useUserAddress();
  const { contract } = state;

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
    const filteredMusic = allmusic.filter((music) =>
      music.musicName.toLowerCase().includes(searchParams.title.toLowerCase())
    );
    setSearchedMusic(filteredMusic);
  }, [allmusic, searchParams.title]);

  return (
    <div 
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Search
          </h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent searchedMusic={searchedMusic} />
    </div>
  );
}

export default Search;