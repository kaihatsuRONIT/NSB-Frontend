"use client";
import Link from "next/link";

export default function StoryCard({ image, title, episodes, slug }) {
    return (
        <Link href={`/series/${slug}/episodes`}>
            <div className="relative rounded-xl overflow-hidden cursor-pointer group flex flex-col w-full"
                style={{ aspectRatio: '2/3' }}
            >
                <div className="relative flex-1">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                </div>
                <div className="bg-[#111114] px-3 py-2.5 flex flex-col gap-1 flex-shrink-0">
                    <h3 className="text-white text-sm font-semibold leading-tight truncate">{title}</h3>
                    <div className="flex items-center justify-between">
                        <span style={{ color: '#6B7280', fontSize: '12px' }}>{episodes} Episodes</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}