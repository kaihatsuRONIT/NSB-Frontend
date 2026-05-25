"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { FaChevronDown, FaPlay } from "react-icons/fa";

const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = String(Math.floor(secs % 60)).padStart(2, '0');
    return `${m}:${s}`;
};

export default function EpisodeResults({ search }) {
    const [episodes, setEpisodes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchEpisodes = async () => {
            setLoading(true);
            try {
                const data = await api.get(`/episodes/search?search=${search}&page=1`);
                setEpisodes(Array.isArray(data) ? data : []);
                setHasMore(data.length === 5);
                setPage(1);
            } finally {
                setLoading(false);
            }
        };
        fetchEpisodes();
    }, [search]);

    const loadMore = async () => {
        setLoadingMore(true);
        try {
            const data = await api.get(`/episodes/search?search=${search}&page=${page + 1}`);
            setEpisodes(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
            setHasMore(data.length === 5);
            setPage(prev => prev + 1);
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading) return (
        <div className="w-full px-6 py-4 bg-black">
            <div className="h-5 w-40 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 mb-3 p-4 rounded-xl animate-pulse" style={{ background: '#13131A' }}>
                    <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="h-3 w-3/4 rounded-md" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <div className="h-3 w-1/2 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                </div>
            ))}
        </div>
    );

    if (episodes.length === 0) return null;

    return (
        <div className="w-full px-6 py-6 bg-black flex flex-col gap-4">
            <h2 className="text-white text-xl font-bold">Episodes</h2>
            <div className="flex flex-col gap-3">
                {episodes.map((ep) => (
                    <div
                        key={ep.id}
                        onClick={() => router.push(`/series/${ep.story.slug}/episode-${ep.episodeNumber}`)}
                        className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-white/5 transition"
                        style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <img
                            src={ep.thumbnail || ep.story.coverImage}
                            alt={ep.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{ep.title}</p>
                            <p style={{ color: '#6B7280', fontSize: '12px' }}>{ep.story.title} • Ep {ep.episodeLabel} • {formatTime(ep.duration)}</p>
                        </div>
                        <button
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                        >
                            <FaPlay size={10} className="text-white ml-0.5" />
                        </button>
                    </div>
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 self-center rounded-full text-white text-xs font-bold tracking-widest hover:opacity-90 transition disabled:opacity-50"
                    style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)', padding: "14px 20px" }}
                >
                    {loadingMore ? 'Loading...' : 'LOAD MORE EPISODES'}
                    <FaChevronDown size={12} />
                </button>
            )}
        </div>
    );
}