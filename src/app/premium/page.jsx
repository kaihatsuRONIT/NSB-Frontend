import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PremiumHero from "@/components/Premium/PremiumHero";
import TopStories from "@/components/Premium/TopStories";

export default function Page(){
    return(
        <>
        <Navbar/>
        <PremiumHero/>
        <TopStories/>
        <Footer/>
        </>
    );
}