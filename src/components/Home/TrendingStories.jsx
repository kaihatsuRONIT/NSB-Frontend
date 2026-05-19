"use client";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function TrendingStories() {
    const [stories, setStories] = useState([]);
    const [start, setStart] = useState(0);
    const [visible, setVisible] = useState(4);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const skeletonCards = Array(visible).fill(0);
    const router = useRouter();

    const fetchStories = async (pageNum) => {
        setLoading(true);
        try {
            const data = await api.get(`/stories?page=${pageNum}&limit=8`);
            if (Array.isArray(data)) {
                if (data.length < 8) setHasMore(false);
                setStories(prev => pageNum === 1 ? data : [...prev, ...data]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories(1);
    }, []);

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

    const prev = () => setStart((s) => Math.max(0, s - visible));

    const next = async () => {
        const nextStart = start + visible;
        // If we're about to run out of fetched stories, fetch more
        if (nextStart + visible >= stories.length && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            await fetchStories(nextPage);
        }
        setStart(nextStart);
    };

    const visibleStories = stories.slice(start, start + visible);

    return (
        <div className="w-full px-6 py-8 bg-black">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-white text-3xl font-bold">Trending Stories</h2>
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
                        disabled={start + visible >= stories.length && !hasMore}
                        className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition disabled:opacity-30"
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    loading && stories.length === 0 ? (
                        skeletonCards.map((_, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden animate-pulse"
                                style={{ background: '#13131A' }}>
                                <div className="w-full h-64" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex flex-col gap-2">
                                    <div className="h-3 w-3/4 rounded-md" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                    <div className="h-3 w-1/2 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                </div>
                            </div>
                        ))
                    ) : (
                        visibleStories.map((story) => (
                            <div
                                key={story.id}
                                onClick={() => router.push(`/series/${story.slug}/episodes`)}
                                className="relative rounded-xl overflow-hidden cursor-pointer group"
                            >
                                <img
                                    src={story.coverImage}
                                    alt={story.title}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
                                    <span className="text-white text-[10px] bg-black/50 px-2 py-0.5 rounded-md">
                                        {story.totalEpisodes} Episodes
                                    </span>
                                    <span className="text-white text-[10px] bg-black/50 px-2 py-0.5 rounded-md">
                                        {story.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                                    style={{ background: 'linear-gradient(0deg, #0B0B0F 0%, rgba(11,11,15,0.7) 60%, transparent 100%)' }}>
                                    <h3 className="text-white text-sm font-bold leading-tight">{story.title}</h3>
                                    <p className="text-gray-400 text-xs mt-0.5">{story.language} • {story.isFree ? 'Free' : `₹${story.price}`}</p>
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}

{

}