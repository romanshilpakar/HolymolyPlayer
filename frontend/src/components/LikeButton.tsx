"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuthModal from "@/hooks/useAuthModal";
import useUserAddress from "@/hooks/useUserAddress";
import { Music } from "@/types";



interface LikeButtonProps {
  musicId?: number;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  musicId
}) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likedMusic, setLikedMusic] = useState<Music[]>([]);
  const {userAddress, state} = useUserAddress();
  const { contract } = state;


  useEffect(() => {
    if (!userAddress) {
      return;
    } 
    const getLikedMusic = async () => {
      if (contract){
        const likedmusic = await contract.getLikedMusicByUser();
        setLikedMusic(likedmusic);
      }    
    };
    contract && getLikedMusic();
    
  }, [contract , userAddress])

  useEffect(() => {
    if (!userAddress || !likedMusic.length) {
      // If the user is not logged in or the likedMusic array is empty, set isLiked to false
      setIsLiked(false);
      return;
    }
    // Check if the music with the given musicId is present in the likedMusic array
    const isMusicLiked = likedMusic.some((music) => music.tokenId === musicId);
  
    // Update the isLiked state based on whether the music is liked or not
    setIsLiked(isMusicLiked);
  }, [likedMusic, userAddress, musicId]);
  


  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!userAddress) {
      return authModal.onOpen();
    }

    try {
    if(!isLiked){
      if(contract){
        await contract.likeMusic(musicId);
        setIsLiked(true)
        toast.success('Liked successfully!');
      }  
    }else{
      if(contract){
        await contract.unlikeMusic(musicId);
        setIsLiked(false)
        toast.success('Unliked successfully!');
      } 
    }
    router.refresh();
  } catch (error:any) {
    console.error('Error occurred while liking/unliking music:', error.message);
    toast.error('Failed to like/unlike music. Please try again later.');
  }
  }

  return (
    <button 
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
      onClick={handleLike}
    >
      <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
    </button>
  );
}

export default LikeButton;
