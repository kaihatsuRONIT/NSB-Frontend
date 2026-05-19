import { IoMdSearch } from "react-icons/io";

export default function SeriesHero({ search, setSearch, onSearch }) {
    return (
        <div className="relative w-full min-h-[300px] bg-[#0B0B0F] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">

            {/* Background glows */}
            <div className="absolute top-0 left-0 rounded-full opacity-30 blur-[120px] pointer-events-none"
                style={{ background: '#6C5CE7', width: '40vw', height: '40vw', maxWidth: '400px', maxHeight: '400px', transform: 'translate(-30%, -30%)' }} />
            <div className="absolute bottom-0 right-0 rounded-full opacity-20 blur-[120px] pointer-events-none"
                style={{ background: '#00E5FF', width: '40vw', height: '40vw', maxWidth: '400px', maxHeight: '400px', transform: 'translate(30%, 30%)' }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-xl">
                {/* Title */}
                <h1 className="text-white text-5xl font-bold">Series</h1>

                {/* Subtitle */}
                <p className="text-gray-400 text-sm text-center">
                    Immersive episodic narratives crafted for the cinematic mind.
                </p>

                {/* Browse All Badge */}
                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-5 py-2.5">
                    <span className="text-gray-400 text-sm font-medium tracking-wide">BROWSE STORIES AND EPISODES</span>
                </div>

                {/* Search Bar */}
                <div className="w-full flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                    <IoMdSearch className="text-gray-500 text-lg flex-shrink-0" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        placeholder="Search within Series library..."
                        className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                    />
                    <button
                        onClick={onSearch}
                        className="flex-shrink-0 px-4 py-1.5 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition"
                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}