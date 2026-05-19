"use client";
import { useState } from "react";
import { FaUser, FaLock, FaBell, FaPalette, FaShieldAlt, FaSave } from "react-icons/fa";

const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaLock },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "privacy", label: "Privacy", icon: FaShieldAlt },
];

export default function SettingsSection() {
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">

            {/* Tabs Sidebar */}
            <div className="flex flex-row lg:flex-col gap-1 lg:w-52 flex-shrink-0 overflow-x-auto lg:overflow-visible">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition text-left flex-shrink-0"
                            style={{
                                background: isActive ? 'rgba(108,92,231,0.15)' : 'transparent',
                                border: isActive ? '1px solid rgba(108,92,231,0.3)' : '1px solid transparent',
                            }}
                        >
                            <Icon size={13} style={{ color: isActive ? '#00E5FF' : '#6B7280' }} />
                            <span style={{ color: isActive ? '#fff' : '#6B7280', fontSize: '13px', whiteSpace: 'nowrap' }}>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-5">

                {/* Profile */}
                {activeTab === "profile" && (
                    <div className="flex flex-col gap-5">
                        <div className="p-6 rounded-2xl flex flex-col gap-6" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="text-white font-bold text-base">Profile Information</h3>

                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                                    style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                                    A
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-white text-sm font-semibold">Admin User</span>
                                    <span style={{ color: '#6B7280', fontSize: '12px' }}>Super Admin</span>
                                    <button className="text-xs font-medium mt-1 hover:opacity-80 transition w-fit"
                                        style={{ color: '#00E5FF' }}>Change Avatar</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: "Full Name", placeholder: "Admin User", type: "text" },
                                    { label: "Email", placeholder: "admin@namansb.com", type: "email" },
                                    { label: "Phone", placeholder: "+91 9876543210", type: "tel" },
                                    { label: "Role", placeholder: "Super Admin", type: "text" },
                                ].map((field) => (
                                    <div key={field.label} className="flex flex-col gap-1.5">
                                        <label style={{ color: '#6B7280', fontSize: '12px' }}>{field.label}</label>
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label style={{ color: '#6B7280', fontSize: '12px' }}>Bio</label>
                                <textarea
                                    placeholder="Write a short bio..."
                                    rows={3}
                                    className="px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                                    style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Security */}
                {activeTab === "security" && (
                    <div className="flex flex-col gap-5">
                        <div className="p-6 rounded-2xl flex flex-col gap-5" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="text-white font-bold text-base">Change Password</h3>
                            {[
                                { label: "Current Password", placeholder: "••••••••" },
                                { label: "New Password", placeholder: "••••••••" },
                                { label: "Confirm New Password", placeholder: "••••••••" },
                            ].map((field) => (
                                <div key={field.label} className="flex flex-col gap-1.5">
                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>{field.label}</label>
                                    <input
                                        type="password"
                                        placeholder={field.placeholder}
                                        className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-2xl flex flex-col gap-4" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="text-white font-bold text-base">Two-Factor Authentication</h3>
                            <p style={{ color: '#6B7280', fontSize: '13px' }}>Add an extra layer of security to your admin account.</p>
                            <ToggleRow label="Enable 2FA via Authenticator App" defaultOn={false} />
                            <ToggleRow label="Enable 2FA via SMS" defaultOn={false} />
                        </div>

                        <div className="p-6 rounded-2xl flex flex-col gap-4" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="text-white font-bold text-base">Active Sessions</h3>
                            {[
                                { device: "Chrome on Windows", location: "Delhi, India", time: "Active now" },
                                { device: "Safari on iPhone", location: "Mumbai, India", time: "2 hours ago" },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <div className="flex flex-col gap-0.5">
                                        <span style={{ color: '#fff', fontSize: '13px' }}>{s.device}</span>
                                        <span style={{ color: '#6B7280', fontSize: '11px' }}>{s.location} · {s.time}</span>
                                    </div>
                                    <button className="text-xs px-3 py-1.5 rounded-lg transition hover:bg-red-500/10"
                                        style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                                        Revoke
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                    <div className="p-6 rounded-2xl flex flex-col gap-5" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h3 className="text-white font-bold text-base">Notification Preferences</h3>

                        <div className="flex flex-col gap-1">
                            <p style={{ color: '#6B7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform</p>
                            <div className="flex flex-col gap-3 mt-2">
                                <ToggleRow label="New user subscriptions" defaultOn={true} />
                                <ToggleRow label="New episode uploads" defaultOn={true} />
                                <ToggleRow label="Story published" defaultOn={false} />
                                <ToggleRow label="User reports" defaultOn={true} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 border-t pt-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <p style={{ color: '#6B7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</p>
                            <div className="flex flex-col gap-3 mt-2">
                                <ToggleRow label="Weekly analytics report" defaultOn={true} />
                                <ToggleRow label="Monthly revenue summary" defaultOn={true} />
                                <ToggleRow label="Security alerts" defaultOn={true} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Appearance */}
                {activeTab === "appearance" && (
                    <div className="flex flex-col gap-5">
                        <div className="p-6 rounded-2xl flex flex-col gap-5" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="text-white font-bold text-base">Theme</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Dark", colors: ["#0B0B0F", "#13131A"] },
                                    { label: "Darker", colors: ["#000000", "#0D0D0D"] },
                                    { label: "Midnight", colors: ["#060614", "#0D0D2B"] },
                                ].map((theme, i) => (
                                    <div key={theme.label}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition"
                                        style={{
                                            border: i === 0 ? '1px solid #6C5CE7' : '1px solid rgba(255,255,255,0.08)',
                                            background: 'rgba(255,255,255,0.02)'
                                        }}>
                                        <div className="w-full h-10 rounded-lg overflow-hidden flex">
                                            <div className="flex-1" style={{ background: theme.colors[0] }} />
                                            <div className="flex-1" style={{ background: theme.colors[1] }} />
                                        </div>
                                        <span style={{ color: i === 0 ? '#fff' : '#6B7280', fontSize: '12px' }}>{theme.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl flex flex-col gap-5" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="text-white font-bold text-base">Accent Color</h3>
                            <div className="flex gap-3">
                                {["#6C5CE7", "#00E5FF", "#FF6B6B", "#00B894", "#FDCB6E"].map((color) => (
                                    <div key={color}
                                        className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition"
                                        style={{ background: color, border: color === "#6C5CE7" ? '2px solid #fff' : '2px solid transparent' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl flex flex-col gap-4" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="text-white font-bold text-base">Layout</h3>
                            <ToggleRow label="Collapsed sidebar by default" defaultOn={false} />
                            <ToggleRow label="Compact card view" defaultOn={false} />
                        </div>
                    </div>
                )}

                {/* Privacy */}
                {activeTab === "privacy" && (
                    <div className="p-6 rounded-2xl flex flex-col gap-5" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h3 className="text-white font-bold text-base">Privacy Settings</h3>
                        <div className="flex flex-col gap-3">
                            <ToggleRow label="Allow analytics tracking" defaultOn={true} />
                            <ToggleRow label="Share usage data with Anthropic" defaultOn={false} />
                            <ToggleRow label="Show admin activity log" defaultOn={true} />
                        </div>

                        <div className="flex flex-col gap-3 border-t pt-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <h4 className="text-white font-semibold text-sm">Danger Zone</h4>
                            <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white text-sm font-medium">Clear All Analytics Data</p>
                                        <p style={{ color: '#6B7280', fontSize: '12px' }}>Permanently delete all analytics records</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-lg text-xs font-semibold transition hover:bg-red-500/20"
                                        style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                                        Clear
                                    </button>
                                </div>
                                <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'rgba(239,68,68,0.1)' }}>
                                    <div>
                                        <p className="text-white text-sm font-medium">Reset Admin Account</p>
                                        <p style={{ color: '#6B7280', fontSize: '12px' }}>Reset all settings to default</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-lg text-xs font-semibold transition hover:bg-red-500/20"
                                        style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                        style={{ background: saved ? 'rgba(0,229,255,0.2)' : 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                    >
                        <FaSave size={12} />
                        {saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ToggleRow({ label, defaultOn }) {
    const [on, setOn] = useState(defaultOn);
    return (
        <div className="flex items-center justify-between py-2">
            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{label}</span>
            <button
                onClick={() => setOn(!on)}
                className="relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0"
                style={{ background: on ? 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' : 'rgba(255,255,255,0.1)' }}
            >
                <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                    style={{ left: on ? '22px' : '2px' }}
                />
            </button>
        </div>
    );
}