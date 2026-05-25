"use client";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EpisodeCard from "./EpisodeCard";


export default function Episodes({ story, hasPurchased,purchaseLoading,onPurchaseSuccess }) {
    const [start, setStart] = useState(0);
    const [visible, setVisible] = useState(4);


    useEffect(() => {
        const update = () => {
            if (window.innerWidth < 640) setVisible(1);
            else if (window.innerWidth < 768) setVisible(2);
            else if (window.innerWidth < 1024) setVisible(3);
            else setVisible(4);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const prev = () => setStart((s) => Math.max(0, s - 1));
    const next = () => setStart((s) => Math.min(story?.episodes.length - visible, s + 1));

    const visibleEpisodes = story?.episodes.slice(start, start + visible);

    return (
        <div className="w-full px-6 py-8 bg-black">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-white/10 pb-5">
                <div>
                    <h2 className="text-white text-3xl font-bold">Episodes</h2>
                    {/* <p className="text-gray-500 text-sm font-bold pt-2">Season 1 : The Kidnapping of Zin</p> */}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prev}
                        disabled={start === 0}
                        className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition disabled:opacity-30"
                    >
                        <FaChevronLeft size={12} />
                    </button>
                    <button
                        onClick={next}
                        disabled={start >= story?.episodes.length - visible}
                        className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition disabled:opacity-30"
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visibleEpisodes.map((ep, idx) => (
                    <EpisodeCard
                        key={idx}
                        image={ep.thumbnail}
                        hasPurchased={hasPurchased}
                        purchaseLoading={purchaseLoading}
                        onPurchaseSuccess={onPurchaseSuccess}
                        episodeNumber={ep.episodeNumber}
                        title={ep.title}
                        description={ep.description}
                        isFreeEpisode={ep.isFreePreview}
                        episodeLabel={ep.episodeLabel}
                        story={story}
                        duration={Math.floor(ep.duration / 60)}
                    />
                ))}
            </div>
        </div>
    );
}