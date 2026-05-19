export default function ContinueJourney() {
    return (
        <div className="w-full px-6 py-8">
            <div
                className="relative w-full rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-8 py-8 overflow-hidden"
                style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}
            >
                {/* Left gradient border accent */}
                <div
                    className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                    style={{ background: 'linear-gradient(180deg, #6C5CE7 0%, #00E5FF 100%)' }}
                />

                {/* Text */}
                <div className="flex flex-col gap-2 max-w-lg pl-4">
                    <h3 className="text-white font-bold text-lg">Ready to Continue Your Journey?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Sign in or create an account to save your progress, sync your library across all devices, and manage your premium subscription seamlessly.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold border border-white/20 hover:bg-white/10 transition"
                        style={{ background: 'transparent' }}
                    >
                        Log In
                    </button>
                    <button
                        className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}