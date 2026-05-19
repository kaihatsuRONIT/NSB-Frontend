"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { FaUser, FaLock, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../../../lib/api";
import Loading from "../Loading";

const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaLock },
];

export default function UserSettings() {
    const { user, loading, fetchProfile } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

    // Profile fields
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [email, setEmail] = useState(user?.email || '');

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSaveProfile = async () => {
        setError('');
        try {
            await api.patch('/users/profile', { name, phone, email }, );
            await fetchProfile();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch {
            setError('Failed to update profile');
        }
    };

    const handleChangePassword = async () => {
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        try {
            const res = await api.patch('/users/change-password', {
                currentPassword,
                newPassword,
            });

            if (res.statusCode === 401) {
                setError('Current password is incorrect');
                return;
            }
            if (res.statusCode === 400) {
                setError(res.message || 'Invalid request');
                return;
            }

            setSaved(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSaved(false), 2000);
        } catch {
            setError('Failed to change password');
        }
    };

    const handleSave = () => {
        if (activeTab === 'profile') handleSaveProfile();
        if (activeTab === 'security') handleChangePassword();
    };
    const initialized = useRef(false);

    useEffect(() => {
        if (user && !initialized.current) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setEmail(user.email || '');
            initialized.current = true;
        }
    }, [user]);

    if (loading) return <Loading />;
    return (
        <div className="min-h-screen bg-[#0B0B0F] px-6 py-10">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">

                {/* Header */}
                <div>
                    <h1 className="text-white text-2xl font-bold">Settings</h1>
                    <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>Manage your account preferences</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setError(''); }}
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

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="flex flex-col gap-5">
                        <div className="p-6 rounded-2xl flex flex-col gap-5"
                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>

                            <h3 className="text-white font-bold text-base">Profile Information</h3>

                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #00E5FF 100%)' }}>
                                    {user?.avatar
                                        ? <img src={user.avatar} alt={user.name[0]} className="w-full h-full rounded-2xl object-cover" />
                                        : user?.name?.[0]
                                    }
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-white text-sm font-semibold">Profile Photo</span>
                                    <p style={{ color: '#6B7280', fontSize: '12px' }}>JPG, PNG or GIF. Max size 2MB</p>
                                    <label className="text-xs font-medium cursor-pointer w-fit px-3 py-1.5 rounded-lg transition hover:opacity-80"
                                        style={{ background: 'rgba(108,92,231,0.15)', color: '#6C5CE7' }}>
                                        Upload Photo
                                        <input type="file" accept="image/*" className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl text-sm outline-none"
                                        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#bcbdc0' }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>Phone</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl text-sm outline-none"
                                        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#bcbdc0' }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label style={{ color: '#6B7280', fontSize: '12px' }}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                                    style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#bcbdc0' }}
                                />
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="p-6 rounded-2xl flex flex-col gap-4"
                            style={{ background: '#13131A', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <h3 className="text-white font-bold text-base">Danger Zone</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">Delete Account</p>
                                    <p style={{ color: '#6B7280', fontSize: '12px' }}>Permanently delete your account and all data</p>
                                </div>
                                <button className="px-4 py-2 rounded-xl text-xs font-semibold transition hover:bg-red-500/20"
                                    style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <div className="flex flex-col gap-5">
                        <div className="p-6 rounded-2xl flex flex-col gap-5"
                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="text-white font-bold text-base">Change Password</h3>
                            {[
                                { label: "Current Password", key: "current", value: currentPassword, setter: setCurrentPassword },
                                { label: "New Password", key: "new", value: newPassword, setter: setNewPassword },
                                { label: "Confirm New Password", key: "confirm", value: confirmPassword, setter: setConfirmPassword },
                            ].map((field) => (
                                <div key={field.label} className="flex flex-col gap-1.5">
                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>{field.label}</label>
                                    <div className="relative">
                                        <input
                                            type={showPass[field.key] ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none pr-10"
                                            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                            onClick={() => setShowPass(p => ({ ...p, [field.key]: !p[field.key] }))}
                                        >
                                            {showPass[field.key]
                                                ? <FaEyeSlash size={13} style={{ color: '#6B7280' }} />
                                                : <FaEye size={13} style={{ color: '#6B7280' }} />
                                            }
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && <p className="text-red-400 text-xs text-right">{error}</p>}

                {/* Save Button */}
                <div className="flex justify-end pb-10">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                        style={{ background: saved ? 'rgba(0,229,255,0.2)' : 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                    >
                        {saved ? <FaCheck size={12} /> : null}
                        {saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
