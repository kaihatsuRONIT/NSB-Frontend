import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Paywall from "../Paywall";
import { api } from "../../../lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EpisodeCard({ image, episodeNumber, title, description, duration, story, hasPurchased, purchaseLoading, onPurchaseSuccess, isFreeEpisode }) {
    const { user, loading } = useAuth();
    const [showPaywall, setShowPaywall] = useState(false);
    const router = useRouter();

    const handlePlay = () => {
        if (purchaseLoading) return;
        if (loading) return null;
        if (!user) {
            router.push('/login');
            return;
        }
        if (!isFreeEpisode && !hasPurchased) {
            setShowPaywall(true);
            return;
        }
        router.push(`/series/${story?.slug}/episode-${episodeNumber}`);
    };
    return (
        <>
            {
                purchaseLoading ? (
                    <>
                        <div
                            className="relative flex flex-col rounded-2xl overflow-hidden w-full animate-pulse"
                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            {/* Thumbnail skeleton */}
                            <div className="w-full h-[160px]" style={{ background: 'rgba(255,255,255,0.06)' }} />

                            {/* Info skeleton */}
                            <div className="flex flex-col gap-3 px-4 py-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="h-4 rounded-md w-3/4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                    <div className="h-4 rounded-md w-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                </div>
                                <div className="h-3 rounded-md w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            </div>

                            {/* Button skeleton */}
                            <div className="pb-5 px-5">
                                <div className="h-[52px] rounded-lg w-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                            </div>

                            {/* Bottom gradient line */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer group w-full"
                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            {/* Thumbnail */}
                            <div className="relative">
                                <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-[160px] object-cover group-hover:scale-105 transition duration-300"
                                />
                                {/* IsFree badge */}
                                {
                                    isFreeEpisode && <div className="absolute top-2 right-2 bg-[#00E3FD]/90 px-2 py-0.5 rounded-md">
                                        <span className="text-white text-xs font-medium">Free Episode</span>
                                    </div>
                                }
                                {/* Duration badge */}
                                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded-md">
                                    <span className="text-white text-xs font-medium">{duration}m</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-2 px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-white text-base font-semibold">{episodeNumber}. {title}</h3>
                                    <span className="text-xs font-semibold flex-shrink-0 ml-2" style={{ color: '#00E5FF' }}>
                                        E{String(episodeNumber).padStart(2, '0')}
                                    </span>

                                </div>
                                <p style={{ color: '#ffffff', fontSize: '12px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{description}</p>
                            </div>

                            <div className="pb-5 px-5">
                                {/* Glow */}
                                <div
                                    className="absolute -z-10 rounded-full blur-[40px] opacity-40 pointer-events-none"
                                    style={{
                                        background: '#00E3FD',
                                        width: '100%',
                                        height: '100%',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                />
                                <span
                                    onClick={handlePlay}
                                    className="flex items-center gap-2 px-[32px] py-[16px] rounded-lg text-black text-sm hover:opacity-85 transition cursor-pointer"
                                    style={{ background: '#00E3FD', letterSpacing: '1.2px' }}
                                >
                                    <span>▶</span>
                                    <span>Play Episode {episodeNumber}</span>
                                </span>
                            </div>

                            {/* Bottom gradient line */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                            />
                            {showPaywall && <Paywall
                                story={story}
                                onClose={() => setShowPaywall(false)}
                                onSuccess={onPurchaseSuccess}
                            />}
                        </div >
                    </>
                )
            }
        </>
    )
}