"use client";
import AnalyticsSection from "@/components/Admin/AnalyticsSection";
import EpisodesSection from "@/components/Admin/EpisodesSections";
import SettingsSection from "@/components/Admin/SettingsSection";
import StoriesSection from "@/components/Admin/StoriesSection";
import { useState } from "react";
import { FaBook, FaUsers, FaMusic, FaChartBar, FaCog, FaBars, FaTimes } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const navItems = [
    // { id: "dashboard", label: "Dashboard", icon: MdDashboard },
    { id: "stories", label: "Stories", icon: FaBook },
    // { id: "episodes", label: "Episodes", icon: FaMusic },
    { id: "users", label: "Paid Users", icon: FaUsers },
    { id: "analytics", label: "Analytics", icon: FaChartBar },
    { id: "settings", label: "Settings", icon: FaCog },
];

export default function AdminLayout({ children }) {
    const [active, setActive] = useState("stories");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [filteredStory, setFilteredStory] = useState("all");

    console.log('filteredStory:', filteredStory, typeof filteredStory);

    return (
        <div className="min-h-screen flex bg-[#0B0B0F]">

            {/* Sidebar */}
            <div
                className="flex flex-col flex-shrink-0 transition-all duration-300 h-screen sticky top-0"
                style={{
                    width: sidebarOpen ? '240px' : '64px',
                    background: '#13131A',
                    borderRight: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    {sidebarOpen && (
                        <span style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '16px',
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            NSB Admin
                        </span>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-white transition"
                    >
                        {sidebarOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
                    </button>
                </div>

                {/* Nav Items */}
                <div className="flex flex-col gap-1 p-3 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = active === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActive(item.id)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left"
                                style={{
                                    background: isActive ? 'rgba(108,92,231,0.15)' : 'transparent',
                                    border: isActive ? '1px solid rgba(108,92,231,0.3)' : '1px solid transparent',
                                }}
                            >
                                <Icon size={16} style={{ color: isActive ? '#00E5FF' : '#6B7280', flexShrink: 0 }} />
                                {sidebarOpen && (
                                    <span style={{ color: isActive ? '#fff' : '#6B7280', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Admin Badge */}
                {sidebarOpen && (
                    <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                                A
                            </div>
                            <div className="flex flex-col">
                                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Admin</span>
                                <span style={{ color: '#6B7280', fontSize: '10px' }}>Super Admin</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#13131A' }}>
                    <h1 className="text-white font-semibold text-lg capitalize">{active}</h1>
                    {/* <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                            + New
                        </div>
                    </div> */}
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
                    {/* {active === "dashboard" && <DashboardView />} */}
                    {active === "stories" && (
                        <StoriesSection
                            onViewEpisodes={(storyId) => {
                                setFilteredStory(storyId);
                                setActive("episodes");
                            }}
                        />
                    )}
                    {active === "episodes" && (
                        <EpisodesSection filterStoryProp={filteredStory} />
                    )}
                    {active === "users" && <div className="text-white">Users section - coming soon</div>}
                    {active === "analytics" && <div className="text-white">Analytics section - coming soon</div>}
                    {active === "settings" && <div className="text-white">Settings section - coming soon</div>}
                </div>
            </div>
        </div>
    );
}
