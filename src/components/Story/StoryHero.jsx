"use client";
import { useState } from "react";
import { FaPlus, FaRegPlayCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Paywall from "../Paywall";
import { useAuth } from "@/context/AuthContext";
import { getTotalEpisodes } from "@/helper/getTotalEpisodes";

export default function StorySection({ story, publishYear, episodeTitle, hasPurchased, purchaseLoading, onPurchaseSuccess, isFreeEpisode}) {
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
        router.push(`/series/${story?.slug}/episode-1`);
    };
    return (
        <>
            {
                purchaseLoading ? (
                    <div className="relative w-full h-125 overflow-hidden bg-black">

                        {/* Content skeleton */}
                        <div className="relative z-10 flex flex-col justify-end h-full px-10 max-w-[55%] pb-8 gap-4">
                            {/* Badge skeleton */}
                            <div className="h-5 w-32 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />

                            {/* Title skeleton */}
                            <div className="flex flex-col gap-2">
                                <div className="h-12 w-3/4 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                <div className="h-12 w-1/2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            </div>

                            {/* Description skeleton */}
                            <div className="flex flex-col gap-2">
                                <div className="h-4 w-full rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                <div className="h-4 w-5/6 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                <div className="h-4 w-4/6 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            </div>

                            {/* Episode name skeleton */}
                            <div className="h-4 w-48 rounded-md" style={{ background: 'rgba(255,255,255,0.06)' }} />

                            {/* Buttons skeleton */}
                            <div className="flex gap-4">
                                <div className="h-12 w-40 rounded-lg" style={{ background: 'rgba(0,227,253,0.2)' }} />
                                <div className="h-12 w-32 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full h-72 md:h-125 overflow-hidden bg-black">
                        {/* Background Image */}
                        <img
                            src={`${story?.coverImage}`}
                            alt="hero"
                            className="absolute inset-0 w-full h-full object-contain"
                        />

                        {/* Dark overlay - left side fade */}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #000000 1%, rgba(11, 11, 15, 0.8) 40%, rgba(11, 11, 15, 0) 100%)' }} />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-end md:justify-center h-full px-5 md:px-10 w-full md:max-w-[55%] pb-8">
                            {/* Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-[#00E3FD] bg-[#00E3FD]/25" style={{ letterSpacing: "1px" }}>
                                    <span>SCI-FI EPIC</span>
                                </div>
                                <div>
                                    <h1 style={{ fontSize: "14px" }} className="text-[#9CA3AF] font-semibold"> • {getTotalEpisodes(story?.episodes || [])} Episodes • {publishYear}</h1>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-white text-3xl md:text-6xl font-bold leading-tight mb-2">
                                {story?.title}
                            </h1>

                            {/* Description */}
                            <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-4 md:mb-6 max-w-full md:max-w-full"
                                style={{
                                    maxHeight: '6em',
                                    overflowY: 'auto',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                {story.description}
                            </p>

                            {/* Episode Name */}
                            <div className="flex flex-row gap-3 mb-8" style={{ color: "#00E3FD" }}>
                                <span><FaRegPlayCircle className="mt-1" /></span>
                                <h1 className="text-sm md:text-base">{episodeTitle}</h1>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-row gap-7">
                                <div className="relative">
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
                                        className="flex items-center gap-2 px-6 md:px-[32px] py-3 md:py-[16px] rounded-lg text-black text-sm hover:opacity-85 transition cursor-pointer"
                                        style={{ background: '#00E3FD', letterSpacing: '1.2px' }}
                                    >
                                        <span>▶</span>
                                        <span>Play Episode 1-2</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {showPaywall && <Paywall
                            story={story}
                            onClose={() => setShowPaywall(false)}
                            onSuccess={onPurchaseSuccess}
                        />}
                    </div>
                )
            }
        </>
    );
}