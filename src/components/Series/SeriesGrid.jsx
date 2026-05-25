"use client";
import { FaChevronDown } from "react-icons/fa";
import StoryCard from "./StoryCard";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Loading from "../Loading";
import { getTotalEpisodes } from "@/helper/getTotalEpisodes";

export default function SeriesGrid({ search, category, sort }) {
    const [stories, setStories] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Reset and fetch on filter change
    useEffect(() => {
        const fetchStories = async () => {
            setPageLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (category && category !== 'All') params.append('category', category);
                if (sort) params.append('sort', sort);
                params.append('page', '1');
                params.append('limit', '8');

                const data = await api.get(`/stories?${params.toString()}`);
                setStories(Array.isArray(data) ? data : []);
                setHasMore(data.length === 8);
                setPage(1);
            } finally {
                setPageLoading(false);
            }
        };
        fetchStories();
    }, [search, category, sort]);

    const loadMore = async () => {
        setLoadingMore(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category && category !== 'All') params.append('category', category);
            if (sort) params.append('sort', sort);
            params.append('page', String(page + 1));
            params.append('limit', '8');

            const data = await api.get(`/stories?${params.toString()}`);
            setStories(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
            setHasMore(data.length === 8);
            setPage(prev => prev + 1);
        } finally {
            setLoadingMore(false);
        }
    };

    console.log(stories)

    return (
        <>
            {pageLoading ? (
                <div className="w-full px-4 md:px-6 py-8 bg-black">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 w-full">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse rounded-2xl w-full"
                                style={{ aspectRatio: '2/3', background: 'rgba(255,255,255,0.06)' }} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full px-4 md:px-6 py-8 bg-black flex flex-col items-center gap-10">
                    {stories.length === 0 ? (
                        <p className="text-gray-500 text-sm">No stories found.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 w-full">
                            {stories.map((item) => (
                                <StoryCard
                                    key={item.id}
                                    id={item.id}
                                    image={item.coverImage}
                                    title={item.title}
                                    slug={item.slug}
                                    episodes={getTotalEpisodes(item.episodes)}
                                    rating={5}
                                />
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="flex items-center gap-2 rounded-full text-white text-xs font-bold tracking-widest hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)', padding: "18px 12px" }}
                        >
                            {loadingMore ? 'Loading...' : 'LOAD MORE SERIES'}
                            <FaChevronDown size={12} />
                        </button>
                    )}
                </div>
            )}
        </>
    );
}