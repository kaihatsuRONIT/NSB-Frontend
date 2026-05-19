"use client";
import Footer from "@/components/Footer";
import ContinueListening from "@/components/Home/ContinueListening";
import HeroSection from "@/components/Home/HeroSection";
import LatestEpisodes from "@/components/Home/LatestEpisodes";
import TrendingStories from "@/components/Home/TrendingStories";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ContinueListening />
      <TrendingStories />
      <LatestEpisodes />
      <Footer />
    </>
  );
}
