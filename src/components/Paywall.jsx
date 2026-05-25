'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { load } from '@cashfreepayments/cashfree-js';
import { api } from '../../lib/api';

export default function Paywall({ story, onClose, onSuccess }) {
    const router = useRouter();
    const cashfreeRef = useRef(null);

    useEffect(() => {
        const initSDK = async () => {
            cashfreeRef.current = await load({ mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || 'sandbox' });
        };
        initSDK();
    }, []);

    const handlePurchase = async () => {
        try {
            const order = await api.post('/purchases/create-order', { storyId: story.id });
            if (!order?.paymentSessionId) return;

            const result = await cashfreeRef.current.checkout({
                paymentSessionId: order.paymentSessionId,
                redirectTarget: '_modal',
            });

            if (result.error) {
                console.log('Payment closed or failed:', result.error);
            }

            if (result.paymentDetails) {
                // Payment completed — check status on return URL page
                router.push(`/payment/status?order_id=${order.orderId}&story_slug=${order.storySlug}`);
                onClose();
            }
        } catch (err) {
            console.error('Purchase error:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[120px] pointer-events-none"
                style={{ background: 'linear-gradient(90deg, #6C5CE7, #00E5FF)', width: '500px', height: '500px' }} />

            <div className="relative w-full max-w-md">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-6 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M18 11H6C4.89543 11 4 11.8954 4 13V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V13C20 11.8954 19.1046 11 18 11Z" fill="white" />
                            <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-white text-2xl font-bold">Premium Content</h2>
                        <p className="text-gray-400 text-sm">
                            Purchase <span className="text-white font-semibold">{story?.title}</span> to unlock all episodes
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 w-full">
                        <p className="text-gray-400 text-xs mb-1">One-time purchase</p>
                        <p className="text-white text-4xl font-bold">₹{story?.price}</p>
                        <p className="text-gray-500 text-xs mt-1">Lifetime access · All episodes</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full text-left">
                        {[
                            `Unlocks ${story?.title}`,
                            'Unlimited access to all episodes',
                            'High quality audio streaming',
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handlePurchase}
                        className="w-full py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                    >
                        Purchase Now · ₹{story?.price}
                    </button>

                    <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-sm transition">
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
}