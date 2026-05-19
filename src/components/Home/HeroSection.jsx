"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { FaPlay, FaPlus } from "react-icons/fa";

export default function HeroSection() {
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchStories = async () => {
            const data = await api.get('/stories');
            if (Array.isArray(data)) {
                const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 5);
                setStories(shuffled);
            }
        };
        fetchStories();
    }, []);

    useEffect(() => {
        if (stories.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % stories.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [stories]);

    const story = stories[currentIndex];

    if (!story) return (
        <div className="relative w-full h-72 md:h-163 overflow-hidden bg-black animate-pulse">
            <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.02)' }} />
            <div className="absolute bottom-8 left-10 flex flex-col gap-4 max-w-[55%]">
                <div className="h-5 w-32 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-14 w-3/4 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-14 w-1/2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-full rounded-md" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    <div className="h-4 w-5/6 rounded-md" style={{ background: 'rgba(255,255,255,0.04)' }} />
                </div>
                <div className="flex gap-4 mt-2">
                    <div className="h-12 w-40 rounded-lg" style={{ background: 'rgba(0,227,253,0.08)' }} />
                    <div className="h-12 w-32 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-72 md:h-163 overflow-hidden">
            {/* Background Image */}
            <img
                key={`img-${story.id}`}
                src={story.coverImage}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ animation: 'fadeIn 1s ease forwards' }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #000000 1%, rgba(11, 11, 15, 0.8) 40%, rgba(11, 11, 15, 0) 100%)' }} />

            {/* Content */}
            <div
                key={`content-${story.id}`}
                className="relative z-10 flex flex-col justify-end h-full px-5 md:px-10 w-full md:max-w-[55%] pb-6 md:pb-8"
                style={{ animation: 'fadeSlideIn 0.8s ease forwards' }}
            >
                {/* Badge */}
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                        <span>✦</span>
                        <span>{story.category?.toUpperCase()}</span>
                    </div>
                    <span className="text-gray-400 text-xs md:text-sm">• {story.totalEpisodes} Episodes</span>
                </div>

                {/* Title */}
                <h1 className="text-white text-3xl md:text-6xl font-bold leading-tight mb-2">
                    {story.title}
                </h1>

                {/* Description */}
                <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-4 md:mb-6 max-w-full md:max-w-[450px] line-clamp-2 md:line-clamp-none">
                    {story.description}
                </p>

                {/* Dots */}
                <div className="flex gap-2 mb-4 md:mb-6">
                    {stories.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                                width: i === currentIndex ? '24px' : '6px',
                                background: i === currentIndex ? '#00E5FF' : 'rgba(255,255,255,0.3)',
                            }}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-row gap-4 md:gap-7">
                    <button
                        onClick={() => router.push(`/series/${story.slug}/episodes`)}
                        className="flex items-center gap-2 px-5 md:px-[32px] py-3 md:py-[16px] rounded-lg text-white text-sm font-semibold"
                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                    >
                        <FaPlay size={12} />
                        <span>Listen Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
}