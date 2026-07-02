interface Song {
    track_id: string;
    track_name: string;
    artists: string;
    track_name_alias: string;
    artists_alias: string;
  }

export function SongCards(song: Song){
    return <div className="flex w-full bg-neutral-900 rounded-lg overflow-clip p-2 md:p-4">
        <div className="bg-neutral-800 flex-1/6 w-full aspect-square flex rounded-lg justify-center-safe items-center-safe">
            <p className="text-[0.5rem] md:text-xs font-extralight text-neutral-500">no cover</p>
        </div>
        <div className=" flex-5/6 flex flex-col justify-center gap-2 px-4">
            <h1 className="font-bold text-sm md:text-lg">{song.track_name} <span className="font-extralight text-[0.5rem] md:text-xs text-neutral-400">/{song.track_name_alias}</span></h1>
            <p className="font-medium text-[0.625rem] md:text-sm">{song.artists} <span className="font-extralight text-[0.5rem] md:text-xs text-neutral-400">/{song.artists_alias}</span></p>
        </div>
    </div>
}

export function SongCardsSkeleton(){
    return <div className="flex w-full bg-neutral-900 rounded-lg overflow-clip p-2 md:p-4 animate-pulse">
        <div className="bg-neutral-800 flex-1/6 w-full aspect-square flex rounded-lg justify-center-safe items-center-safe">
        </div>
        <div className=" flex-5/6 flex flex-col justify-center gap-2 px-4">
            <div className="w-1/4 aspect-8/1 bg-neutral-800 rounded-lg"></div>
            <div className="w-1/4 aspect-8/1 bg-neutral-800 rounded-lg"></div>
        </div>
    </div>
}