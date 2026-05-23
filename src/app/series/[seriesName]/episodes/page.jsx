"use client";
import StoryHero from "@/components/Story/StoryHero.jsx"
import Navbar from "@/components/Navbar";
import TrendingStories from "@/components/Home/TrendingStories";
import Episodes from "@/components/Story/Episodes";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { api } from "../../../../../lib/api";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";

export default function EpisodesPage() {
    const { seriesName } = useParams();
    const [story, setStory] = useState(null);
    const [pageLoading, setPageLoading] = useState(true)
    const [hasPurchased, setHasPurchased] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(true);

    useEffect(() => {
        if (!story) return;
        const fetchPurchases = async () => {
            const data = await api.get('/purchases/my');
            if (Array.isArray(data)) {
                setHasPurchased(data.some(p => p.storyId === story?.id && p.status === 'SUCCESS' && (p.expiresAt === null || new Date(p.expiresAt) > new Date())));
            }
            setPurchaseLoading(false);
        };
        fetchPurchases();
    }, [story?.id]);

    useEffect(() => {
        const fetchedStory = async () => {
            try {
                const data = await api.get(`/stories/slug/${seriesName}`);
                setStory(data);
            }
            finally {
                setPageLoading(false);
            }
        }
        fetchedStory();
    }, []);
    return (
        <>
            {
                pageLoading ? (
                    <Loading />
                ) : (
                    <>
                        <Navbar />
                        <StoryHero
                            story={story}
                            hasPurchased={hasPurchased}
                            purchaseLoading={purchaseLoading}
                            onPurchaseSuccess={() => setHasPurchased(true)}
                            publishYear={new Date(story.createdAt).getFullYear()}
                            episodeTitle={story.episodes.filter((ep) => ep.episodeNumber === 1)[0]?.title}
                            isFreeEpisode={story.episodes.filter((ep) => ep.episodeNumber === 1)[0]?.isFreePreview}
                        />
                        <Episodes story={story} hasPurchased={hasPurchased}
                            purchaseLoading={purchaseLoading}
                            onPurchaseSuccess={() => setHasPurchased(true)} />
                        <TrendingStories />
                        <Footer />
                    </>
                )
            }
        </>
    );
}