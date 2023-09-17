
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import Allmusic from "./components/Allmusic";

export const revalidate = 0;


export default function Home() {

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
      <Header>
        <div className="mb-2">
          <h1 
            className="
            text-white 
              text-3xl 
              font-semibold
            ">
              Welcome back
          </h1>
          <div 
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              xl:grid-cols-3 
              2xl:grid-cols-4 
              gap-3 
              mt-4
            "
          >
            <ListItem 
              name="Liked Musics" 
              image="/images/like.png" 
              href="liked" 
            />
            <ListItem 
              name="Bought Musics" 
              image="/images/bought.png" 
              href="bought" 
            />
          </div>
          <div className="
          md:hidden
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          xl:grid-cols-3 
          2xl:grid-cols-4 
          gap-3 
          mt-4
          ">
          <ListItem 
              name="Your Musics" 
              image="/images/mymusic.png" 
              href="mymusic" 
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Newest Musics
          </h1>
        </div>
        <Allmusic />
      </div>
    </div>
  )
}