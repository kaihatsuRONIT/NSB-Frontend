import Link from "next/link";
import { FaTwitter, FaInstagram, FaGlobe } from "react-icons/fa";
import { FaApple } from "react-icons/fa";

export default function Footer() {
    const PlatformLinks = {
        "Browse Stories": "/series",
        "Subscription": "/subscription",
        "Help Center": "/policies#help-center",
    };
    const SupportLinks = {
        "Cancellation Policy": "/policies#cancellation-policy",
        "Privacy Policy": "/policies#privacy-policy",
        "Terms and Conditions": "/policies#terms-and-conditions",
        "Refund Policy": "/policies#refund-policy",
    };
    return (
        <footer className="w-full bg-[#0B0B0F] border-t border-white/10">
            {/* Main Footer */}
            <div className="px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between gap-10">
                {/* Brand */}
                <div className="flex flex-col gap-4 max-w-xs">
                    <span className="text-lg font-bold" style={{
                        background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Naman Story Book
                    </span>
                    <p className="text-gray-400 text-sm">
                        Elevating digital narratives through immersive audio experiences and cinematic storytelling.
                    </p>
                    <div className="flex gap-3 mt-1">
                        {[FaTwitter, FaInstagram, FaGlobe].map((Icon, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
                                <Icon size={13} className="text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div className="flex flex-row gap-10 sm:gap-20">
                    {/* Platform */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-semibold text-sm">Platform</h4>
                        {["Browse Stories", "Subscription", "Help Center"].map((item) => (
                            <Link key={item} href={PlatformLinks[item]} className="text-gray-400 text-sm cursor-pointer hover:text-white transition">
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Support */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-semibold text-sm">Support</h4>
                        {["Cancellation Policy", "Privacy Policy", "Terms and Conditions", "Refund Policy"].map((item) => (
                            <Link key={item} href={SupportLinks[item]} className="text-gray-400 text-sm cursor-pointer hover:text-white transition">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Download */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-white font-semibold text-sm">Download Our App</h4>
                    <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/15 transition w-fit">
                        <FaApple size={22} className="text-white" />
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-[10px]">Download on the</span>
                            <span className="text-white text-sm font-semibold">App Store</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="px-6 md:px-10 py-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-gray-500 text-xs">© 2026 StoryFlow. All rights reserved.</span>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {["Privacy Policy", "Terms of Service", "Help Center", "Cookies"].map((item) => (
                        <span key={item} className="text-gray-500 text-xs cursor-pointer hover:text-white transition">{item}</span>
                    ))}
                </div>
            </div>
        </footer>
    );
}