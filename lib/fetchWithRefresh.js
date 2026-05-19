import { refreshAccessToken } from './auth';

let isRefreshing = false;
let refreshPromise = null;

const fetchWithRefresh = async (url, options = {}) => {
    const res = await fetch(url, { ...options, credentials: 'include', headers: { ...options.headers } });

    if (res.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshAccessToken().finally(() => {
                isRefreshing = false;
                refreshPromise = null;
            });
        }

        const refreshed = await refreshPromise;
        if (!refreshed) {
            if (url.includes('/users/profile')) return res;
            return null;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        return fetch(url, { ...options, credentials: 'include', headers: { ...options.headers } });
    }

    return res;
};

export default fetchWithRefresh;