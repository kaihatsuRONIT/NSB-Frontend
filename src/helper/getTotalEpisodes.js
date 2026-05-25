export const getTotalEpisodes = (episodes) => {
    if (!episodes || episodes.length === 0) return 0;
    const last = episodes.reduce((max, ep) => {
        const end = ep.episodeEnd || ep.episodeNumber;
        const maxEnd = max.episodeEnd || max.episodeNumber;
        return end > maxEnd ? ep : max;
    });
    return last.episodeEnd || last.episodeNumber;
};