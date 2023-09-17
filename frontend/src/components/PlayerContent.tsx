"use client";
//@ts-ignore
import useSound from "use-sound";
import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { Music } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import useUserAddress from "@/hooks/useUserAddress";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import LikeButton from "./LikeButton";





interface PlayerContentProps {
  music: Music;
  musicUrl: string;
  buyStatus: boolean
}

const PlayerContent: React.FC<PlayerContentProps> = ({ 
  music, 
  musicUrl,
  buyStatus
}) => {
  const player = usePlayer();
  const router = useRouter();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const {state} = useUserAddress();
  const { contract } = state;
 

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  }

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  }

  const [play, { pause, sound }] = useSound(
    musicUrl,
    { 
      volume: volume,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3']
    }
  );

  useEffect(() => {
    sound?.play();
    
    return () => {
      sound?.unload();
    }
  }, [sound]);



  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  }

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }

  const handleBuy = async () => {

    try {
    if(!buyStatus){
      if(contract){
        await contract.buyMusic(music.tokenId, { value: music.price });
        toast.success('Music bought successfull!');
      }  
    }
    router.refresh();
  } catch (error:any) {
    toast.error('Failed to buy/resell music. Please try again later.');
    // toast.error('Failed :',error);
  }
  }

  return ( 
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-x-4">
            <MediaItem data={music} />
            <LikeButton musicId={music.tokenId} />

            <button 
            className="
            rounded-lg
              md:p-2
              p-1
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
              text-black

            "
            onClick={handleBuy}
            disabled={buyStatus}
          >
            <p className="text-black font-bold" >{buyStatus ? 'Owned' :'Buy' }</p>
          </button>
          </div>
        </div>



        <div 
          className="
            flex 
            md:hidden 
            col-auto 
            w-full 
            justify-end 
            items-center
          "
          onClick={handlePlay} 

        >
            {/* <AiFillStepBackward
            onClick={onPlayPrevious}
            size={20} 
            className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            "
          /> */}
          <div 
            onClick={handlePlay} 
            className="
              h-8
              w-8
              flex 
              items-center 
              justify-center 
              rounded-full 
              bg-white 
              p-1 
              cursor-pointer
            "
          >
            <Icon size={20} className="text-black" />
          </div>
          {/* <AiFillStepForward
            onClick={onPlayNext}
            size={20} 
            className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            " 
          /> */}
        </div>

        <div 
          className="
            hidden
            h-full
            md:flex 
            justify-center 
            items-center 
            w-full 
            max-w-[722px] 
            gap-x-6
          "
        >
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30} 
            className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            "
          />
          <div 
            onClick={handlePlay} 
            className="
              flex 
              items-center 
              justify-center
              h-10
              w-10 
              rounded-full 
              bg-white 
              p-1 
              cursor-pointer
            "
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30} 
            className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            " 
          />
        </div>

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <VolumeIcon 
              onClick={toggleMute} 
              className="cursor-pointer" 
              size={34} 
            />
            <Slider 
              value={volume} 
              onChange={(value) => setVolume(value)}
            />
          </div>
        </div>

      </div>
   );
}
 
export default PlayerContent;