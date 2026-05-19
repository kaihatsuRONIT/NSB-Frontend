'use client';
import { useEffect, useState } from 'react';
import { FaStar, FaChevronDown } from 'react-icons/fa';
import { IoMdSearch } from 'react-icons/io';
import { api } from '../../../lib/api';
import Paywall from '../Paywall';
import Loading from '../Loading';

export default function TopStories() {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [search, setSearch] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchStories = async (searchVal, pageNum, append = false) => {
        const params = new URLSearchParams();
        params.append('limit', '4');
        params.append('page', String(pageNum));
        if (searchVal) params.append('search', searchVal);

        const data = await api.get(`/stories?${params.toString()}`);
        const result = Array.isArray(data) ? data : [];
        if (append) {
            setStories(prev => [...prev, ...result]);
        } else {
            setStories(result);
        }
        setHasMore(result.length === 4);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchStories('', 1);
            setLoading(false);
        };
        init();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setPage(1);
        setAppliedSearch(search);
        await fetchStories(search, 1);
        setLoading(false);
    };

    const loadMore = async () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchStories(appliedSearch, nextPage, true);
        setLoadingMore(false);
    };

    return (
        <>
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="w-full px-6 py-16 bg-black flex flex-col items-center gap-10">
                            {/* Header */}
                            <div className="flex flex-col items-center gap-3 text-center">
                                <h2 className="text-white text-4xl md:text-5xl font-bold">Top Stories</h2>
                                <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                                    Handpicked stories to get you started. Purchase once, listen forever.
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="w-full max-w-xl flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                <IoMdSearch className="text-gray-500 text-lg flex-shrink-0" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search stories..."
                                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="flex-shrink-0 px-4 py-1.5 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition"
                                    style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                                >
                                    Search
                                </button>
                            </div>

                            {/* Cards */}
                            {loading ? (
                                <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="animate-pulse rounded-xl flex-shrink-0"
                                            style={{ width: '225px', height: '339px', background: 'rgba(255,255,255,0.06)' }} />
                                    ))}
                                </div>
                            ) : stories.length === 0 ? (
                                <p className="text-gray-500 text-sm">No stories found.</p>
                            ) : (
                                <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
                                    {stories.map((story, index) => (
                                        <div
                                            key={story.id}
                                            onClick={() => setSelectedStory(story)}
                                            className="relative flex flex-col w-full rounded-2xl overflow-hidden cursor-pointer group"
                                            style={{
                                                maxWidth: '280px',
                                                background: '#13131A',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                            }}
                                        >
                                            {/* Cover Image */}
                                            <div className="relative w-full h-48 overflow-hidden">
                                                <img
                                                    src={story.coverImage}
                                                    alt={story.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex flex-col flex-1 p-6 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-semibold tracking-widest" style={{ color: '#00E5FF' }}>
                                                        {story.category.toUpperCase()}
                                                    </span>
                                                    <h3 className="text-white text-xl font-bold leading-snug">{story.title}</h3>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {/* <FaStar size={11} className="text-yellow-400" /> */}
                                                        {/* <span className="text-gray-400 text-xs">{story.ratingAverage?.toFixed(1) || '5.0'}</span> */}
                                                        <span className="text-gray-600 text-xs">{story.totalEpisodes} Episodes</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{story.description}</p>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="text-white text-2xl font-bold">₹{story.price}</span>
                                                    <button
                                                        className="px-5 py-2.5 rounded-xl text-white text-xs font-bold tracking-widest hover:opacity-90 transition"
                                                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                                                    >
                                                        GET NOW
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Load More */}
                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-2 rounded-full text-white text-xs font-bold tracking-widest hover:opacity-90 transition disabled:opacity-50"
                                    style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)', padding: '18px 24px' }}
                                >
                                    {loadingMore ? 'Loading...' : 'LOAD MORE'}
                                    <FaChevronDown size={12} />
                                </button>
                            )}

                            {/* Paywall Modal */}
                            {selectedStory && (
                                <Paywall
                                    story={selectedStory}
                                    onClose={() => setSelectedStory(null)}
                                    onSuccess={() => setSelectedStory(null)}
                                />
                            )}
                        </div>
                    </>
                )
            }
        </>
    );
}