"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ContinueListening() {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchProgress = async () => {
            const data = await api.get('/progress/my');
            if (Array.isArray(data)) setProgress(data.slice(0, 4));
            setLoading(false);
        };
        fetchProgress();
    }, [user]);

    if (!user || (!loading && progress.length === 0)) return null;

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = String(Math.floor(secs % 60)).padStart(2, '0');
        return `${m}:${s}`;
    };

    if (loading) return (
        <div className="w-full px-6 py-15 bg-black animate-pulse">
            <div className="h-7 w-56 rounded-lg mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="w-16 h-16 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <div className="flex flex-col flex-1 gap-2">
                            <div className="h-3 w-3/4 rounded-md" style={{ background: 'rgba(255,255,255,0.08)' }} />
                            <div className="h-3 w-1/2 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            <div className="h-1 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            <div className="h-3 w-2/3 rounded-md" style={{ background: 'rgba(255,255,255,0.04)' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    const incomplete = progress.filter(p => p.episode.duration - p.listenedSeconds > 0);
    if (!user || (!loading && incomplete.length === 0)) return null;
    return (
        <div className="w-full px-6 py-15 bg-black">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-white text-3xl font-bold">Continue Listening</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {progress.map((p) => {
                    const percent = Math.round((p.listenedSeconds / p.episode.duration) * 100);
                    let remaining = p.episode.duration - p.listenedSeconds;
                    if (remaining <= 0) remaining = null;
                    if (!remaining) return null;
                    return (
                        <div
                            key={p.id}
                            onClick={() => router.push(`/series/${p.story.slug}/episode-${p.episode.episodeNumber}`)}
                            className="flex flex-row items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer hover:bg-white/8 transition"
                        >
                            <img
                                src={p.episode.thumbnail || p.story.coverImage}
                                alt={p.episode.title}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                                <h3 className="text-white text-sm font-semibold leading-snug mb-0.5">{p.story.title}</h3>
                                <p className="text-gray-400 text-xs mb-2 truncate">Ep {p.episode.episodeLabel}: {p.episode.title}</p>
                                <div className="w-full h-1 bg-white/10 rounded-full mb-1.5">
                                    <div
                                        className="h-1 rounded-full"
                                        style={{
                                            width: `${percent}%`,
                                            background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)'
                                        }}
                                    />
                                </div>
                                <span className="text-gray-500 text-xs">{formatTime(p.listenedSeconds)} / {formatTime(p.episode.duration)} • {formatTime(remaining)} remaining</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}