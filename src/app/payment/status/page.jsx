'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';

export default function PaymentStatus() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('checking');

    const orderId = searchParams.get('order_id');
    const storySlug = searchParams.get('story_slug');

    useEffect(() => {
        if (!orderId) return;
        const check = async () => {
            try {
                // Poll purchase status
                const purchases = await api.get('/purchases/my');
                const purchase = purchases.find(p => p.paymentRef === orderId);
                if (purchase?.status === 'SUCCESS') {
                    setStatus('success');
                    setTimeout(() => router.push(`/series/${storySlug}/episode-1`), 2000);
                } else {
                    setStatus('pending');
                    // Retry after 3 seconds (webhook may not have fired yet)
                    setTimeout(check, 3000);
                }
            } catch {
                setStatus('error');
            }
        };
        check();
    }, [orderId]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="flex flex-col items-center gap-6 text-center">
                {status === 'checking' || status === 'pending' ? (
                    <>
                        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-purple-500 animate-spin" />
                        <p className="text-white text-lg font-semibold">Confirming your payment...</p>
                        <p className="text-gray-400 text-sm">Please wait, do not close this tab.</p>
                    </>
                ) : status === 'success' ? (
                    <>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-white text-lg font-semibold">Payment Successful!</p>
                        <p className="text-gray-400 text-sm">Redirecting you to the story...</p>
                    </>
                ) : (
                    <>
                        <p className="text-white text-lg font-semibold">Something went wrong</p>
                        <p className="text-gray-400 text-sm">Please contact support if amount was deducted.</p>
                        <button onClick={() => router.push('/')}
                            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                            style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}>
                            Go Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}