"use client";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaCrown, FaBars, FaTimes } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { api } from "../../lib/api";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchResults([]);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        const timeout = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const data = await api.get(`/stories?search=${searchQuery}&limit=5`);
                setSearchResults(Array.isArray(data) ? data : []);
            } catch {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    return (
        <>
            <div className="w-full bg-[#101013] px-6 md:px-10">
                <div className="flex justify-between items-center h-[83px]">
                    {/* Logo */}
                    <div style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '22px',
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Naman Story Book
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex flex-row gap-14 text-white items-center">
                        <Link href="/" className="hover:text-[#00E5FF]">Home</Link>
                        <Link href="/series" className="hover:text-[#00E5FF]">Stories</Link>
                        <Link href="/premium">
                            <div className="flex flex-row gap-1 items-center hover:text-[#00E5FF]">
                                <span>Premium</span>
                                <FaCrown />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex flex-row gap-4 items-center flex-shrink-0">
                        <div className="relative" ref={searchRef}>
                            <div className="bg-white/5 text-[#6B7280] flex flex-row items-center gap-2 pl-4 py-3 rounded-full border border-white/10 w-[200px] lg:w-[260px]">
                                <IoMdSearch />
                                <input
                                    type="text"
                                    placeholder="Search stories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full"
                                />
                                {searchLoading && <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin mr-3" />}
                            </div>

                            {/* Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden z-50"
                                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {searchResults.map((story) => (
                                        <div
                                            key={story.id}
                                            onClick={() => { router.push(`/series/${story.slug}/episodes`); setSearchResults([]); setSearchQuery(''); }}
                                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition"
                                        >
                                            <img
                                                src={story.coverImage}
                                                alt={story.title}
                                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-white text-sm font-semibold truncate">{story.title}</p>
                                                <p style={{ color: '#6B7280', fontSize: '11px' }}>{story.category} • {story.language}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {loading ? (
                            <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
                        ) : (
                            <>
                                {user ? (
                                    <Link href="/profile">
                                        <FaUserCircle size={32} className="text-white cursor-pointer hover:opacity-80 transition" />
                                    </Link>
                                ) : (
                                    <Link href="/login">
                                        <div className="p-[1px] rounded-full w-fit" style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                                            <div className="bg-[#101013] px-5 py-2 rounded-full cursor-pointer">
                                                <span style={{
                                                    background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                }}>
                                                    Login/SignUp
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden text-white text-xl"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden flex flex-col gap-5 pb-6 text-white">
                        {/* Search */}
                        <div className="relative">
                            <div className="bg-white/5 text-[#6B7280] flex flex-row items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 w-full">
                                <IoMdSearch />
                                <input
                                    type="text"
                                    placeholder="Search stories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch?.()}
                                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full"
                                />
                                {searchLoading && <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin mr-3" />}
                            </div>
                            {/* Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden z-50"
                                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {searchResults.map((story) => (
                                        <div
                                            key={story.id}
                                            onClick={() => { router.push(`/series/${story.slug}/episodes`); setSearchResults([]); setSearchQuery(''); }}
                                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition"
                                        >
                                            <img
                                                src={story.coverImage}
                                                alt={story.title}
                                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-white text-sm font-semibold truncate">{story.title}</p>
                                                <p style={{ color: '#6B7280', fontSize: '11px' }}>{story.category} • {story.language}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Links */}
                        <Link href="/" className="hover:text-[#00E5FF]" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link href="/series" className="hover:text-[#00E5FF]" onClick={() => setMenuOpen(false)}>Stories</Link>
                        <Link href="/premium" onClick={() => setMenuOpen(false)}>
                            <div className="flex flex-row gap-1 items-center hover:text-[#00E5FF]">
                                <span>Premium</span>
                                <FaCrown />
                            </div>
                        </Link>

                        {/* Login */}
                        {!loading && (
                            <>
                                {user ? (
                                    <Link href="/profile">
                                        <FaUserCircle size={32} className="text-white cursor-pointer hover:opacity-80 transition" />
                                    </Link>
                                ) : (
                                    <Link href="/login">
                                        <div className="p-[1px] rounded-full w-fit" style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                                            <div className="bg-[#101013] px-5 py-2 rounded-full cursor-pointer">
                                                <span style={{
                                                    background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                }}>
                                                    Login/SignUp
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}