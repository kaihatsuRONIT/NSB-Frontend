"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import GenreFilter from "@/components/Series/GenreFilter";
import SeriesGrid from "@/components/Series/SeriesGrid";
import SeriesHero from "@/components/Series/SeriesHero";
import EpisodeResults from "@/components/Series/EpisodeResults";
import { useState } from "react";

export default function Page() {
    const [search, setSearch] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('newest');

    const handleSearch = () => setAppliedSearch(search);

    return (
        <>
            <Navbar />
            <SeriesHero search={search} setSearch={setSearch} onSearch={handleSearch} />
            <GenreFilter category={category} setCategory={setCategory} sort={sort} setSort={setSort} />
            <SeriesGrid search={appliedSearch} category={category} sort={sort} />
            {appliedSearch.trim() && <EpisodeResults search={appliedSearch} />}
            <Footer />
        </>
    );
}