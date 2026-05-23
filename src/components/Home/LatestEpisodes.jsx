"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function LatestEpisodes() {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchEpisodes = async () => {
            const data = await api.get('/episodes/latest');
            if (Array.isArray(data)) setEpisodes(data);
            setLoading(false);
        };
        fetchEpisodes();
        
    }, []);

    const featured = episodes[0];
    const side = episodes.slice(1, 3);
    const wide = episodes.slice(3, 6);

    if (loading) return (
        <div className="w-full px-6 py-15 bg-black animate-pulse">
            <div className="h-7 w-48 rounded-lg mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl h-[380px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl h-[185px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <div className="rounded-xl h-[185px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl h-[185px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <div className="rounded-xl h-[185px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <div className="rounded-xl h-[185px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                </div>
            </div>
        </div>
    );

    if (!featured) return null;

    return (
        <div className="w-full px-6 py-15 bg-black">
            <h2 className="text-white text-2xl font-bold mb-5">Latest Episodes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Featured Left */}
                <div
                    onClick={() => router.push(`/series/${featured.story.slug}/episode-${featured.episodeNumber}`)}
                    className="relative rounded-xl overflow-hidden cursor-pointer group h-[300px] md:h-full md:min-h-[380px]"
                >
                    <img
                        src={featured.thumbnail || featured.story.coverImage}
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #0B0B0F 0%, rgba(11,11,15,0.5) 50%, transparent 100%)' }} />
                    <div className="absolute top-4 left-4">
                        <span className="text-yellow-400 font-black text-xl tracking-wide drop-shadow-lg">EP {featured.episodeNumber}</span>
                        <p className="text-white font-black text-2xl tracking-widest drop-shadow-lg leading-tight">{featured.story.title}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-white text-[10px] font-semibold mb-2"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                            NEW EPISODE
                        </span>
                        <h3 className="text-white text-xl font-bold leading-tight mb-1">{featured.title}</h3>
                        <p className="text-gray-400 text-xs">{featured.description}</p>
                    </div>
                </div>

                {/* Right Grid */}
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        {side.map((ep) => (
                            <div
                                key={ep.id}
                                onClick={() => router.push(`/series/${ep.story.slug}/episode-${ep.episodeNumber}`)}
                                className="relative rounded-xl overflow-hidden cursor-pointer group h-[160px] md:h-[185px]"
                            >
                                <img
                                    src={ep.thumbnail || ep.story.coverImage}
                                    alt={ep.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #0B0B0F 0%, rgba(11,11,15,0.3) 60%, transparent 100%)' }} />
                                <div className="absolute top-2 left-2">
                                    <span className="text-yellow-400 font-bold text-xs bg-black/40 px-1.5 py-0.5 rounded">EP {ep.episodeNumber}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <h3 className="text-white text-xs font-semibold leading-tight mb-0.5">{ep.title}</h3>
                                    <p className="text-gray-400 text-[10px]">{ep.story.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {wide.map((ep) => (
                            <div
                                key={ep.id}
                                onClick={() => router.push(`/series/${ep.story.slug}/episode-${ep.episodeNumber}`)}
                                className="relative rounded-xl overflow-hidden cursor-pointer group h-[160px] md:h-[185px]"
                            >
                                <img
                                    src={ep.thumbnail || ep.story.coverImage}
                                    alt={ep.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #0B0B0F 0%, rgba(11,11,15,0.3) 60%, transparent 100%)' }} />
                                <div className="absolute top-2 left-2">
                                    <span className="text-yellow-400 font-bold text-xs bg-black/40 px-1.5 py-0.5 rounded">EP {ep.episodeNumber}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <h3 className="text-white text-xs font-semibold leading-tight mb-0.5">{ep.title}</h3>
                                    <p className="text-gray-400 text-[10px]">{ep.story.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}