"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCrown, FaPlay, FaCog, FaSignOutAlt } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { api } from '../../../lib/api';
import { getTotalEpisodes } from "@/helper/getTotalEpisodes";

// const user = {
//     name: "Arjun Mehta",
//     email: "arjun.mehta@gmail.com",
//     avatar: null,
//     plan: "Pro",
//     joinDate: "January 2024",
//     totalListened: "248h",
//     storiesCompleted: 12,
//     episodesPlayed: 184,
// };

// const purchases = [
//     { id: 1, title: "I AM SHAURYA", genre: "Dark Fantasy", episodes: 24, image: "/img-1.webp", purchasedOn: "May 1, 2026", amount: "₹99"},
//     { id: 2, title: "SHADOW QUEEN", genre: "Mystery", episodes: 12, image: "/img-2.png", purchasedOn: "Apr 1, 2026", amount: "₹299"},
//     { id: 3, title: "BLOOD PACT", genre: "Thriller", episodes: 16, image: "/img-4.png", purchasedOn: "Mar 1, 2026", amount: "₹499"},
//     { id: 4, title: "VOID WALKER", genre: "Sci-Fi", episodes: 8, image: "/img-3.png", purchasedOn: "Feb 1, 2026", amount: "₹799"},
// ];

// const continueListening = [
//     { id: 1, title: "I AM SHAURYA", episode: "Ep 769 · The Final Stand", progress: 65, image: "/img-1.webp" },
//     { id: 2, title: "SHADOW QUEEN", episode: "Ep 12 · Rise of Darkness", progress: 30, image: "/img-2.png" },
//     { id: 3, title: "VOID WALKER", episode: "Ep 5 · Between Worlds", progress: 80, image: "/img-3.png" },
// ];

// const savedStories = [
//     { id: 1, title: "BLOOD PACT", genre: "Thriller", episodes: 16, image: "/img-4.png" },
//     { id: 2, title: "IRON WILL", genre: "Romance", episodes: 6, image: "/img-5.png" },
//     { id: 3, title: "VOID WALKER", genre: "Sci-Fi", episodes: 8, image: "/img-3.png" },
//     { id: 4, title: "SHADOW QUEEN", genre: "Mystery", episodes: 12, image: "/img-2.png" },
// ];

const tabs = [
    { id: "overview", label: "Overview", icon: MdLibraryMusic },
    { id: "purchases", label: "Purchases", icon: FaCrown },
    // { id: "saved", label: "Saved", icon: FaBookmark },
    // { id: "liked", label: "Liked", icon: FaHeart },
];

export default function UserProfilePage() {
    const { user, loading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [purchases, setPurchases] = useState([]);
    const [continueListening, setContinueListening] = useState([]);
    const [purchaseMap, setPurchaseMap] = useState({})


    const joinDate = new Date(user?.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });

    const { logout } = useAuth();
    const router = useRouter();

    const getExpiryLabel = (expiresAt) => {
        if (!expiresAt) return null; // lifetime
        const diff = new Date(expiresAt) - new Date();
        if (diff <= 0) return { label: 'Access Expired', color: '#FF4757' };
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days <= 7) return { label: `Expires in ${days} day${days > 1 ? 's' : ''}`, color: '#FF4757' };
        return { label: `Listen before ${new Date(expiresAt).toLocaleDateString('en-IN')}`, color: '#dadee4' };
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [purchasesData, progressData] = await Promise.all([
                    api.get('/purchases/my'),
                    api.get('/progress/my'),
                ]);
                setPurchases(Array.isArray(purchasesData) ? purchasesData : []);
                setContinueListening(Array.isArray(progressData) ? progressData : []);
                const purchaseMap = {};
                purchasesData.forEach(p => {
                    if (!purchaseMap[p.storyId] || new Date(p.expiresAt) > new Date(purchaseMap[p.storyId].expiresAt)) {
                        purchaseMap[p.storyId] = p;
                    }
                });
                setPurchaseMap(purchaseMap);
            } catch {
                console.error('Failed to fetch data');
            } finally {
                setPageLoading(false);
            }
        };

        if (!loading) fetchAll();
    }, [loading]);

    console.log(purchases)

    return (
        <>
            {
                (loading || pageLoading) ? (<Loading />) : (
                    <>
                        <Navbar />
                        <div className="min-h-screen bg-[#0B0B0F] border-t border-white/20">
                            <div className="max-w-5xl mx-auto px-6 mt-20">
                                {/* Profile Row */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-6">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
                                            style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00E5FF 100%)', border: '3px solid #0B0B0F' }}>
                                            <img src={`${user?.avatar}`} alt={user?.name[0]} />
                                        </div>
                                    </div>

                                    {/* Name + Actions */}
                                    <div className="flex flex-col sm:flex-row flex-1 justify-between items-start sm:items-end gap-3 pb-1">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <h1 className="text-white text-2xl font-bold">{user?.name}</h1>
                                            </div>
                                            <span style={{ color: '#6B7280', fontSize: '13px' }}>{user?.email}</span>
                                            <span style={{ color: '#6B7280', fontSize: '12px' }}>Member since : <span className="font-semibold text-gray-400">{joinDate}</span></span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Link href="/profile/settings"><span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition hover:bg-white/10"
                                                style={{ color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <FaCog size={12} />
                                                Settings
                                            </span></Link>
                                            <button onClick={handleLogout}>
                                                <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition hover:bg-red-500/10"
                                                    style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                                                    <FaSignOutAlt size={12} />
                                                    Logout
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>


                                {/* Tabs */}
                                <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
                                                style={{
                                                    background: isActive ? 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' : 'transparent',
                                                    color: isActive ? '#fff' : '#6B7280',
                                                }}
                                            >
                                                <Icon size={12} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Tab Content */}

                                {/* Overview */}
                                {activeTab === "overview" && (
                                    <div className="flex flex-col gap-6 pb-10">
                                        {/* Continue Listening */}
                                        {
                                            continueListening.length === 0 ? (
                                                <>
                                                    <h1 className="text-white font-bold text-base">No listening records found !!</h1>
                                                    <button
                                                        onClick={() => (router.push(`/series`))}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition w-26"
                                                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)', color: '#fff' }}>
                                                        <FaPlay size={8} />
                                                        Listen Now
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col gap-4">
                                                        <h3 className="text-white font-bold text-base">Continue Listening</h3>
                                                        <div className="flex flex-col gap-3">
                                                            {continueListening.map((item) => (
                                                                <div key={item?.id} className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-white/3 transition"
                                                                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                                    <img
                                                                        src={item?.episode?.thumbnail || item?.story?.coverImage}
                                                                        alt={item?.episode?.title}
                                                                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                                                        onError={(e) => e.target.src = item?.story?.coverImage}
                                                                    />
                                                                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <p className="text-white text-sm font-semibold">{item?.episode?.title}</p>
                                                                                {(() => {
                                                                                    const purchase = purchaseMap[item?.story?.id];
                                                                                    const expiry = purchase ? getExpiryLabel(purchase.expiresAt) : null;
                                                                                    return expiry ? (
                                                                                        <p style={{ color: expiry.color, fontSize: '11px', marginTop: '2px' }}>
                                                                                            {expiry.label}
                                                                                        </p>
                                                                                    ) : null;
                                                                                })()}
                                                                                <p style={{ color: '#6B7280', fontSize: '12px' }}>Episode Number : {item?.episode?.episodeLabel}</p>
                                                                            </div>
                                                                            {item?.completed ? (
                                                                                <span style={{ color: '#00E5FF', fontSize: '16px', fontWeight: 600 }}>Listen Again!!</span>
                                                                            ) : (
                                                                                <span style={{ color: '#6B7280', fontSize: '12px' }}>{Math.round((item?.listenedSeconds / item?.episode?.duration) * 100)}%</span>
                                                                            )}
                                                                        </div>
                                                                        {
                                                                            !item?.completed && (
                                                                                <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                                                                    <div className="h-1 rounded-full" style={{
                                                                                        width: `${Math.round((item?.listenedSeconds / item?.episode?.duration) * 100)}%`,
                                                                                        background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)'
                                                                                    }} />
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <button onClick={() => (router.push(`/series/${item?.story?.slug}/episode-${item?.episode?.episodeNumber}`))} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80 transition"
                                                                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                                                                        <FaPlay size={10} className="text-white ml-0.5" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                )}

                                {activeTab === "purchases" && (
                                    <div className="flex flex-col gap-5 pb-10">

                                        {/* Summary */}
                                        <div className="flex gap-3">
                                            {[
                                                { label: "Stories Bought", value: purchases.length },
                                                { label: "Total Spent", value: `₹${purchases.reduce((acc, p) => acc + parseFloat(p.amountPaid), 0).toFixed(2)}` },
                                            ].map((stat) => (
                                                <div key={stat.label} className="flex flex-col gap-1 px-5 py-3 rounded-xl"
                                                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                    <span style={{ color: '#6B7280', fontSize: '11px' }}>{stat.label}</span>
                                                    <span className="text-white font-bold text-xl">{stat.value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Story Cards */}
                                        <div className="flex flex-col gap-3">
                                            {purchases.map((item) => (
                                                <div key={item.id}
                                                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-white/3 transition"
                                                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>

                                                    {/* Thumbnail */}
                                                    <img
                                                        src={item?.story?.coverImage}
                                                        alt={item?.story?.title}
                                                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                                        onError={(e) => e.target.src = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=100&q=80"}
                                                    />

                                                    {/* Info */}
                                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                        <h3 className="text-white text-sm font-bold truncate">{item?.story?.title}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                                                                style={{ background: 'rgba(108,92,231,0.15)', color: '#6C5CE7' }}>
                                                                {item.genre}
                                                            </span>
                                                            <span style={{ color: '#6B7280', fontSize: '11px' }}>{getTotalEpisodes(item?.story?.episodes || [])} Episodes</span>
                                                        </div>
                                                        <span style={{ color: '#6B7280', fontSize: '11px' }}>Purchased on {new Date(item?.createdAt).toLocaleDateString()}</span>
                                                    </div>

                                                    {/* Right */}
                                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                        <span style={{ color: '#00E5FF', fontSize: '13px', fontWeight: 600 }}>₹{item?.amountPaid}</span>
                                                        <button
                                                            onClick={() => (router.push(`/series/${item?.story?.slug}/episodes`))}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition"
                                                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)', color: '#fff' }}>
                                                            <FaPlay size={8} />
                                                            Listen
                                                        </button>
                                                        {(() => {
                                                            const purchase = purchaseMap[item?.story?.id];
                                                            const expiry = purchase ? getExpiryLabel(purchase.expiresAt) : null;
                                                            return expiry ? (
                                                                <p style={{ color: expiry.color, fontSize: '11px', marginTop: '2px' }}>
                                                                    {expiry.label}
                                                                </p>
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Saved
                                {activeTab === "saved" && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-10">
                                        {savedStories.map((story) => (
                                            <div key={story.id} className="relative rounded-2xl overflow-hidden cursor-pointer group"
                                                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <img src={story.image} alt={story.title}
                                                    className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                                                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&q=80"}
                                                />
                                                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #0B0B0F 0%, transparent 60%)' }} />
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <p className="text-white text-xs font-bold">{story.title}</p>
                                                    <p style={{ color: '#6B7280', fontSize: '10px' }}>{story.genre} · {story.episodes} Eps</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                Liked
                                {activeTab === "liked" && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-10">
                                        {savedStories.slice().reverse().map((story) => (
                                            <div key={story.id} className="relative rounded-2xl overflow-hidden cursor-pointer group"
                                                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <img src={story.image} alt={story.title}
                                                    className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                                                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&q=80"}
                                                />
                                                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #0B0B0F 0%, transparent 60%)' }} />
                                                <div className="absolute top-2 right-2">
                                                    <FaHeart size={14} style={{ color: '#00E5FF' }} />
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <p className="text-white text-xs font-bold">{story.title}</p>
                                                    <p style={{ color: '#6B7280', fontSize: '10px' }}>{story.genre} · {story.episodes} Eps</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}

