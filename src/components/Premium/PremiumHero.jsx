export default function PremiumHero() {
    return (
        <div
            className="relative w-full flex items-center justify-center overflow-hidden bg-[#0B0B0F]"
            style={{
                minHeight: '400px',
                height: '526px',
                padding: '34px 24px',
                gap: '32px',
            }}
        >
            {/* Background Image */}
            <img
                src="img-9.png"
                alt="bg"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-[#0B0B0F]/60" />



            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl" style={{ gap: '32px' }}>
                <div className="flex flex-col items-center gap-4 tracking-tighter">
                    <div style={{lineHeight:"72px"}}>
                        <h1 className="text-white" style={{ fontSize: '72px', letterSpacing:"-2.38px", fontWeight:"900"}}>
                        Unlock Infinite
                    </h1>
                    <h1 className="text-white" style={{ fontSize: '72px', letterSpacing:"-2.38px", fontWeight:"900"}}>
                        Worlds
                    </h1>
                    </div>
                    <p className="text-gray-400 text-lg md:text-base leading-relaxed max-w-xl">
                        Experience the next generation of digital narratives. Immerse yourself
                        in premium storytelling with ultra-high-definition audio, exclusive
                        original series, and unlimited ad-free access.</p>
                </div>
            </div>
        </div>
    );
}