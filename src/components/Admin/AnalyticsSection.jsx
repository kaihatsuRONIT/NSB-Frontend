"use client";
import { useState } from "react";
import { FaUsers, FaBook, FaMusic, FaDollarSign, FaArrowUp, FaArrowDown } from "react-icons/fa";

const stats = [
    { label: "Total Revenue", value: "$12,480", change: "+18%", up: true, icon: FaDollarSign },
    { label: "Paid Users", value: "3,842", change: "+204", up: true, icon: FaUsers },
    { label: "Total Stories", value: "124", change: "+12", up: true, icon: FaBook },
    { label: "Total Episodes", value: "1,248", change: "+48", up: true, icon: FaMusic },
];

const monthlyRevenue = [
    { month: "Jan", value: 4200 },
    { month: "Feb", value: 5800 },
    { month: "Mar", value: 4900 },
    { month: "Apr", value: 7200 },
    { month: "May", value: 6100 },
    { month: "Jun", value: 8400 },
    { month: "Jul", value: 7800 },
    { month: "Aug", value: 9200 },
    { month: "Sep", value: 8700 },
    { month: "Oct", value: 10400 },
    { month: "Nov", value: 11200 },
    { month: "Dec", value: 12480 },
];

const topStories = [
    { title: "I AM SHAURYA", plays: 48200, genre: "Dark Fantasy", growth: "+12%" },
    { title: "SHADOW QUEEN", plays: 32400, genre: "Mystery", growth: "+8%" },
    { title: "VOID WALKER", plays: 28900, genre: "Sci-Fi", growth: "+22%" },
    { title: "BLOOD PACT", plays: 21300, genre: "Thriller", growth: "-3%" },
    { title: "IRON WILL", plays: 18700, genre: "Romance", growth: "+5%" },
];

const recentSubs = [
    { name: "Arjun Mehta", plan: "Pro", date: "Today, 2:30 PM", amount: "$9.99" },
    { name: "Priya Singh", plan: "Cinematic", date: "Today, 11:10 AM", amount: "$14.99" },
    { name: "Rahul Kumar", plan: "Basic", date: "Yesterday", amount: "$4.99" },
    { name: "Sneha Patel", plan: "Pro", date: "Yesterday", amount: "$9.99" },
    { name: "Vikram Nair", plan: "Cinematic", date: "2 days ago", amount: "$14.99" },
];

const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

export default function AnalyticsSection() {
    const [period, setPeriod] = useState("12m");

    return (
        <div className="flex flex-col gap-6">

            {/* Period Toggle */}
            <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-xl">Overview</h2>
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {["7d", "30d", "12m"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition"
                            style={{
                                background: period === p ? 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' : 'transparent',
                                color: period === p ? '#fff' : '#6B7280',
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="flex flex-col gap-3 p-5 rounded-2xl"
                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div className="flex items-center justify-between">
                                <span style={{ color: '#6B7280', fontSize: '12px' }}>{stat.label}</span>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: 'rgba(108,92,231,0.15)' }}>
                                    <Icon size={13} style={{ color: '#6C5CE7' }} />
                                </div>
                            </div>
                            <span className="text-white text-2xl font-bold">{stat.value}</span>
                            <div className="flex items-center gap-1">
                                {stat.up ? <FaArrowUp size={9} style={{ color: '#00E5FF' }} /> : <FaArrowDown size={9} style={{ color: '#ef4444' }} />}
                                <span style={{ color: stat.up ? '#00E5FF' : '#ef4444', fontSize: '11px', fontWeight: 600 }}>{stat.change}</span>
                                <span style={{ color: '#6B7280', fontSize: '11px' }}>this month</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Chart + Recent Subs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Revenue Chart */}
                <div className="lg:col-span-2 p-5 rounded-2xl flex flex-col gap-5"
                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-sm">Monthly Revenue</h3>
                        <span style={{ color: '#00E5FF', fontSize: '12px', fontWeight: 600 }}>$12,480 this month</span>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end gap-2 h-40">
                        {monthlyRevenue.map((m, i) => (
                            <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                                <div
                                    className="w-full rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer"
                                    style={{
                                        height: `${(m.value / maxRevenue) * 100}%`,
                                        background: i === monthlyRevenue.length - 1
                                            ? 'linear-gradient(180deg, #6C5CE7 0%, #00E5FF 100%)'
                                            : 'rgba(108,92,231,0.3)',
                                        minHeight: '4px',
                                    }}
                                />
                                <span style={{ color: '#6B7280', fontSize: '9px' }}>{m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Subscriptions */}
                <div className="p-5 rounded-2xl flex flex-col gap-4"
                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 className="text-white font-semibold text-sm">Recent Subscriptions</h3>
                    <div className="flex flex-col gap-3">
                        {recentSubs.map((sub, i) => (
                            <div key={i} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                                        {sub.name[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>{sub.name}</span>
                                        <span style={{ color: '#6B7280', fontSize: '10px' }}>{sub.date}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span style={{ color: '#00E5FF', fontSize: '12px', fontWeight: 600 }}>{sub.amount}</span>
                                    <span style={{ color: '#6B7280', fontSize: '10px' }}>{sub.plan}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Stories */}
            <div className="p-5 rounded-2xl flex flex-col gap-4"
                style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="text-white font-semibold text-sm">Top Performing Stories</h3>

                {/* Header */}
                <div className="grid text-xs font-semibold" style={{ color: '#6B7280', gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                    <span>Story</span>
                    <span>Genre</span>
                    <span>Total Plays</span>
                    <span>Growth</span>
                </div>

                {topStories.map((story, i) => (
                    <div key={i} className="grid items-center py-2.5 border-t" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', borderColor: 'rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center gap-2">
                            <span style={{ color: '#6B7280', fontSize: '11px', minWidth: '16px' }}>#{i + 1}</span>
                            <span className="text-white text-sm font-semibold">{story.title}</span>
                        </div>
                        <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{story.genre}</span>
                        <div className="flex flex-col gap-1">
                            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>{story.plays.toLocaleString()}</span>
                            <div className="w-24 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <div className="h-1 rounded-full" style={{ width: `${(story.plays / 48200) * 100}%`, background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }} />
                            </div>
                        </div>
                        <span style={{ color: story.growth.startsWith('+') ? '#00E5FF' : '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                            {story.growth}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}