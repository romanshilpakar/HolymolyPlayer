import { Music } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import useUserAddress from "./useUserAddress";

const useOnPlay = (musics: Music[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { userAddress } = useUserAddress();

  const onPlay = (id: string) => {
    if (!userAddress) {
      return authModal.onOpen();
    }
    player.setId(id);
    player.setIds(musics.map((music) => music.tokenId.toString()));
  }

  return onPlay;
};

export default useOnPlay;
