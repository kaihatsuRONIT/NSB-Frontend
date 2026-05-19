"use client";

const genres = ["All", "Sci-Fi", "Dark Fantasy", "Mystery", "Romance", "Thriller"];

export default function GenreFilter({ category, setCategory, sort, setSort }) {
    return (
        <div className="w-full px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
            <div className="flex items-center gap-2 flex-wrap">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => setCategory(genre)}
                        className="px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer"
                        style={category === genre ? {
                            background: '#6C5CE7',
                            color: 'white',
                        } : {
                            background: 'transparent',
                            color: '#9CA3AF',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div
                className="flex items-center gap-1.5 text-gray-400 text-sm cursor-pointer flex-shrink-0"
                onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="8" y1="12" x2="20" y2="12"/>
                    <line x1="12" y1="18" x2="20" y2="18"/>
                </svg>
                <span>{sort === 'newest' ? 'Newest' : 'Oldest'}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </div>
        </div>
    );
}