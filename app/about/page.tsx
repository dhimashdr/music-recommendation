import Image from "next/image"
import Link from "next/link"

export default function About(){
    return <div>
        <div className='fixed top-0 w-full min-h-16 bg-black/40 backdrop-blur-md z-50 shadow shadow-white/20 flex px-6 md:px-8 lg:px-16 gap-3 items-center-safe'>
            <div className='w-8 aspect-square relative rounded-md overflow-clip'>
            <Image src="/images/dhimashdr.jpg" alt='a' fill sizes='100' loading='eager'></Image>
            </div>
            <div className='ml-auto flex gap-6 text-xs md:text-sm font-medium'>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            </div>
        </div>

      {/* About Section */}
      <div className="mt-24">
        <div className="mx-6 md:mx-8 lg:mx-16 flex flex-col gap-4">
            <div className="w-fit">
                <h1 className="font-bold text-xl md:text-2xl text-green-400">What is this?</h1>
                <hr className="text-green-400"/>
            </div>
            <p className="font-light text-xs md:text-sm">This is a simple end-to-end implementation of <span className="bg-green-400/20 px-1 font-semibold rounded-sm">Collaborative Filtering</span> algorithm (<span className="bg-green-400/20 px-1 font-semibold rounded-sm">Nearest Neighbors</span> to be precise). Users can retrieve the output of its algorithm from given input area, no need to run in the outside (e.g. Jupyter Notebook).</p>
        </div>

        <br />

        <div className="mx-6 md:mx-8 lg:mx-16 flex flex-col gap-4">
            <div className="w-fit">
                <h1 className="font-bold text-xl md:text-2xl text-green-400">Tech stack</h1>
                <hr className="text-green-400"/>
            </div>
            <p className="font-light text-xs md:text-sm">For developing the model (later I exported to .joblib file), I use <span className="bg-green-400/20 px-1 font-semibold rounded-sm">Kaggle Notebook</span>, which I think it is plenty and great because I don't need to mount/upload the dataset, I just need to find the suitable dataset in Kaggle and made new notebook.
            </p>
            <p className="font-light text-xs md:text-sm">Then, for the backend, I use FastAPI, helped with <span className="bg-green-400/20 px-1 font-semibold rounded-sm">Gemini</span> to write the logic (since I'm too lazy to do that), and then wrapped it with <span className="bg-green-400/20 px-1 font-semibold rounded-sm">Docker</span> (I ask Gemini to do it again) and I deployed it in <span className="bg-green-400/20 px-1 font-semibold rounded-sm">HuggingFace</span> spaces. For free tier and small model, it's plenty and very easy to set up.
            </p>
            <p className="font-light text-xs md:text-sm">Last, for the frontend, I use <span className="bg-green-400/20 px-1 font-semibold rounded-sm">Next.js</span>, my current favorite framework. Again, I ask Gemini to write the API route and the logic, the rest is my work (I like doing the frontend). 
            </p>
        </div>

        <br />

        <div className="mx-6 md:mx-8 lg:mx-16 flex flex-col gap-4">
            <div className="w-fit">
                <h1 className="font-bold text-xl md:text-2xl text-green-400">Resources</h1>
                <hr className="text-green-400"/>
            </div>
            <p className="font-light text-xs md:text-sm">Kaggle Notebook : <span className="bg-green-400/20 px-1 font-semibold rounded-sm"><Link href="https://www.kaggle.com/code/dimashendrico/song-recommendation-collaborative-filtering">Song Recommendation - Collaborative Filtering</Link></span></p>
            <p className="font-light text-xs md:text-sm">HuggingFace Space : <span className="bg-green-400/20 px-1 font-semibold rounded-sm"><Link href="https://huggingface.co/spaces/dhimashdr/spotify-recommender-api/tree/main">Spotify Recommender API</Link></span></p>
        </div>

        <br />

        <div className="mx-6 md:mx-8 lg:mx-16 flex flex-col gap-4">
            <div className="w-fit">
                <h1 className="font-bold text-xl md:text-2xl text-green-400">Reach me out</h1>
                <hr className="text-green-400"/>
            </div>
            <p className="font-light text-xs md:text-sm">If you want to know more about me, you can visit my personal page through : <span className="bg-green-400/20 px-1 font-semibold rounded-sm"><Link href="https://dhimashdr.vercel.app">dhimashdr.vercel.app</Link></span></p>
        </div>
      </div>

    </div>
}