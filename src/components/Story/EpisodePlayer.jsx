"use client";
import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedo } from "react-icons/fa";
import Loading from "../Loading";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation"
import Paywall from "../Paywall";

export default function PlayerPage() {
    const router = useRouter();
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(80);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");
    const audioRef = useRef(null);
    const [currentEpisode, setCurrentEpisode] = useState(null);

    const { seriesName, episodeNumber } = useParams();
    const [story, setStory] = useState(null);
    const [episodes, setEpisodes] = useState([])
    const [pageLoading, setPageLoading] = useState(true);
    const [accessChecked, setAccessChecked] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);

    const handlePlayPause = async () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            if (!audioRef.current.src) {
                const data = await api.get(`/episodes/${currentEpisode.id}`);
                if (!data?.audioUrl) return;
                audioRef.current.src = data.audioUrl;
                audioRef.current.load();
            }
            audioRef.current.play();
            setTimeout(() => {
                if (audioRef.current && !isNaN(audioRef.current.duration)) {
                    setDuration(formatTime(audioRef.current.duration));
                }
            }, 500);
        }
        setPlaying(!playing);
    };

    // Save progress when episode ends
    const handleEnded = () => {
        setPlaying(false);
        api.post('/progress', {
            episodeId: currentEpisode.id,
            storyId: story.id,
            listenedSeconds: Math.floor(audioRef.current.duration),
            completed: true,
        });
    };

    const formatTime = (secs) => {
        if (isNaN(secs)) return "0:00";
        const m = Math.floor(secs / 60);
        const s = String(Math.floor(secs % 60)).padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;
        const pct = isNaN(audio.duration) ? 0 : (audio.currentTime / audio.duration) * 100;
        setProgress(pct);
        setCurrentTime(formatTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (!isNaN(audio.duration)) {
            setDuration(formatTime(audio.duration));
        }
        audio.volume = volume / 100;
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
        setProgress(pct);
    };

    const handleVolume = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
        setVolume(pct);
        audioRef.current.volume = pct / 100;
    };

    useEffect(() => {
        if (!seriesName || !episodeNumber) return;
        const fetchStoryData = async () => {
            try {
                const data = await api.get(`/stories/slug/${seriesName}`);
                setStory(data);
                setEpisodes(data.episodes);

                // Check purchase before setting current episode
                const epNum = Number(episodeNumber.replace('episode-', ''));
                const currentEp = data.episodes.find(ep => ep.episodeNumber === epNum);

                if (!currentEp?.isFreePreview) {
                    const purchases = await api.get('/purchases/my');
                    const purchased = Array.isArray(purchases) && purchases.some(
                        p => p.storyId === data.id &&
                            p.status === 'SUCCESS' &&
                            (p.expiresAt === null || new Date(p.expiresAt) > new Date())
                    );
                    if (!purchased) {
                        router.replace(`/series/${seriesName}/episodes`);
                        return;
                    }
                    setIsPurchased(true);
                } else {
                    // Free preview — but check if user has purchased anyway
                    const purchases = await api.get('/purchases/my');
                    const purchased = Array.isArray(purchases) && purchases.some(
                        p => p.storyId === data.id &&
                            p.status === 'SUCCESS' &&
                            (p.expiresAt === null || new Date(p.expiresAt) > new Date())
                    );
                    setIsPurchased(purchased);
                }
                // Reaches here if isFreePreview OR purchased
                setAccessChecked(true);
                setCurrentEpisode(currentEp || data.episodes[0]);
            } finally {
                setPageLoading(false);
            }
        };
        fetchStoryData();
    }, []);

    useEffect(() => {
        if (!audioRef.current || !currentEpisode?.audioUrl) return;
        audioRef.current.load();
        setPlaying(false);
        setProgress(0);
        setCurrentTime('0:00');
        setDuration('0:00');
    }, [currentEpisode?.audioUrl]);

    // When fetching initial audio
    useEffect(() => {
        if (!currentEpisode) return;
        const fetchAudio = async () => {
            const data = await api.get(`/episodes/${currentEpisode.id}`);
            if (!data?.audioUrl) return;
            audioRef.current.src = data.audioUrl;
            audioRef.current.load();

            // Fetch progress and seek
            const progress = await api.get(`/progress/story/${story.id}`);
            if (Array.isArray(progress)) {
                const ep = progress.find(p => p.episodeId === currentEpisode.id);
                if (ep?.listenedSeconds > 0) {
                    audioRef.current.currentTime = ep.listenedSeconds;
                }
            }

            setPlaying(false);
            setProgress(0);
            setCurrentTime('0:00');
            setDuration('0:00');
        };
        fetchAudio();
    }, [currentEpisode?.id]);

    // Save progress every 30 seconds
    useEffect(() => {
        if (!currentEpisode || !playing) return;

        const interval = setInterval(() => {
            if (audioRef.current) {
                api.post('/progress', {
                    episodeId: currentEpisode.id,
                    storyId: story.id,
                    listenedSeconds: Math.floor(audioRef.current.currentTime),
                });
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [currentEpisode?.id, playing]);

    if (pageLoading || !accessChecked) return <Loading />;
    return (
        <div className="min-h-screen bg-[#0B0B0F] flex flex-col lg:flex-row">

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            <div className="flex flex-col flex-1">
                {/* LEFT - Audio Player */}
                <div className="flex flex-col items-center justify-center px-8 py-12 gap-8">

                    {/* Album Art */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] opacity-30 pointer-events-none"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7, #00E5FF)', width: '280px', height: '280px' }}
                        />
                        <div
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                width: '260px',
                                height: '260px',
                                border: playing ? '2px solid rgba(0,229,255,0.5)' : '2px solid rgba(255,255,255,0.08)',
                                boxShadow: playing ? '0 0 40px rgba(0,229,255,0.15)' : 'none',
                                transition: 'all 0.3s',
                            }}
                        >
                            <img
                                src={currentEpisode?.thumbnail}
                                alt={currentEpisode?.title}
                                className="w-full h-full object-cover"
                                style={{ filter: playing ? 'none' : 'brightness(0.7)' }}
                            />
                            {!playing && (
                                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    <FaPlay size={32} className="text-white opacity-60" />
                                </div>
                            )}
                        </div>
                        <div
                            className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                        >
                            E{String(currentEpisode?.episodeNumber).padStart(2, '0')}
                        </div>
                    </div>

                    {/* Episode Info */}
                    <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-xs font-semibold tracking-widest" style={{ color: '#00E5FF' }}>
                            {story?.title}
                        </p>
                        <h1 className="text-white text-2xl font-bold">{currentEpisode?.title}</h1>
                        {/* <p style={{ color: '#6B7280', fontSize: '13px' }}>{episode.season}</p> */}
                    </div>

                    {/* Like / Share
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setLiked(!liked)} className="hover:scale-110 transition">
                                        <FaHeart size={18} style={{ color: liked ? '#00E5FF' : 'rgba(255,255,255,0.25)' }} />
                                    </button>
                                    <button className="hover:scale-110 transition">
                                        <FaShareAlt size={16} style={{ color: 'rgba(255,255,255,0.25)' }} />
                                    </button>
                                    <button className="hover:scale-110 transition">
                                        <MdClosedCaption size={20} style={{ color: 'rgba(255,255,255,0.25)' }} />
                                    </button>
                                </div> */}

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-2 w-full max-w-md">
                        <div
                            className="w-full h-1.5 rounded-full cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                            onClick={handleSeek}
                        >
                            <div
                                className="h-1.5 rounded-full relative"
                                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md" />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: '#6B7280', fontSize: '12px' }}>{currentTime}</span>
                            <span style={{ color: '#6B7280', fontSize: '12px' }}>{duration}</span>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center gap-8">
                        <button className="text-gray-600 hover:text-gray-400 transition">
                            <FaRandom size={14} />
                        </button>
                        <button
                            className="text-gray-400 hover:text-white transition"
                            onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 10; }}
                        >
                            <FaStepBackward size={18} />
                        </button>
                        <button
                            onClick={handlePlayPause}
                            className="w-14 h-14 rounded-full flex items-center justify-center hover:opacity-90 hover:scale-105 transition"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                        >
                            {playing
                                ? <FaPause size={18} className="text-white" />
                                : <FaPlay size={18} className="text-white ml-1" />
                            }
                        </button>
                        <button
                            className="text-gray-400 hover:text-white transition"
                            onClick={() => { if (audioRef.current) audioRef.current.currentTime += 10; }}
                        >
                            <FaStepForward size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-400 transition">
                            <FaRedo size={14} />
                        </button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-3 w-full max-w-xs">
                        <FaVolumeUp size={14} className="text-gray-500 flex-shrink-0" />
                        <div
                            className="flex-1 h-1 rounded-full cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.1)' }}
                            onClick={handleVolume}
                        >
                            <div className="h-1 rounded-full" style={{ width: `${volume}%`, background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }} />
                        </div>
                        <span style={{ color: '#6B7280', fontSize: '12px', minWidth: '28px' }}>{Math.round(volume)}%</span>
                    </div>
                </div>

                {/* Description */}
                <div className="px-8 pb-10 border-t border-white/10 pt-6 bg-white/5">
                    <h4 className="text-white text-2xl font-bold mb-3">About this Episode</h4>
                    <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.8' }}>{currentEpisode?.description}</p>
                </div>
            </div>

            {/* RIGHT - Episode List */}
            <div className="relative flex flex-col lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l overflow-hidden"
                style={{ borderColor: 'rgba(255,255,255,0.08)', maxHeight: '119vh' }}>

                {/* Episode List — always rendered */}
                <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="px-4 py-4 border-b sticky top-0 z-10 bg-[#0B0B0F]" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <h4 className="text-white font-semibold text-sm">Episodes</h4>
                        <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>{episodes?.length} Episodes</p>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                        {episodes.map((ep) => (
                            <div
                                key={ep.id}
                                onClick={() => isPurchased && setCurrentEpisode(ep)}
                                className="flex items-center gap-3 px-3 py-3 rounded-xl transition"
                                style={{
                                    background: ep.id === currentEpisode?.id ? 'rgba(108,92,231,0.15)' : 'rgba(255,255,255,0.03)',
                                    border: ep.id === currentEpisode?.id ? '1px solid rgba(108,92,231,0.4)' : '1px solid rgba(255,255,255,0.06)',
                                    cursor: isPurchased ? 'pointer' : 'default',
                                }}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: ep.id === currentEpisode?.id ? 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' : 'rgba(255,255,255,0.05)' }}
                                >
                                    {ep.id === currentEpisode?.id
                                        ? <FaPlay size={8} className="text-white ml-0.5" />
                                        : <span style={{ color: '#6B7280', fontSize: '11px', fontWeight: 600 }}>E{ep.episodeNumber}</span>
                                    }
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm truncate" style={{ color: ep.id === currentEpisode?.id ? '#fff' : '#9CA3AF' }}>{ep.title}</span>
                                    <span style={{ color: '#6B7280', fontSize: '11px' }}>{Math.floor(ep.duration / 60)}m</span>
                                </div>
                                {ep.id === currentEpisode?.id && (
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00E5FF' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Paywall Overlay — shown when not purchased */}
                {!isPurchased && (
                    <div className="absolute inset-0 flex flex-col items-center p-6 gap-5 text-center z-20"
                        style={{ background: 'rgba(11,11,15,0.7)', backdropFilter: 'blur(1px)' }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 11H6C4.89543 11 4 11.8954 4 13V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V13C20 11.8954 19.1046 11 18 11Z" fill="white" />
                                <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-white font-bold text-base">Unlock All Episodes</h3>
                            <p className="text-gray-400 text-xs">You're listening to a free preview. Purchase to access all episodes.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 w-full">
                            <p className="text-gray-400 text-xs mb-1">One-time purchase</p>
                            <p className="text-white text-3xl font-bold">₹{story?.price}</p>
                        </div>
                        <button
                            onClick={() => setShowPaywall(true)}
                            className="w-full py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                        >
                            Purchase Now · ₹{story?.price}
                        </button>
                    </div>
                )}

                {/* Paywall Modal */}
                {showPaywall && (
                    <Paywall
                        story={story}
                        onClose={() => setShowPaywall(false)}
                        onSuccess={() => { setIsPurchased(true); setShowPaywall(false); }}
                    />
                )}
            </div>
        </div>
    );
}