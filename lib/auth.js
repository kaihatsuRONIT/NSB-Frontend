
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const protectedPaths = ['/series/', '/profile', '/admin'];

const isProtectedPath = () => {
    const path = window.location.pathname;
    return /\/series\/[^/]+\/episode-\d+/.test(path) || path.includes('/profile') || path.includes('/admin');
};

export const refreshAccessToken = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!res.ok) {
            if (isProtectedPath()) window.location.href = '/login';
            return false;
        }
        return true;
    } catch {
        if (isProtectedPath()) window.location.href = '/login';
        return false;
    }
};



export const clearTokens = async () => {
    await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
};

export const isLoggedIn = () => {
    // Can't read httpOnly cookies from JS
    // Will be determined by API response instead
    return true; // let fetchWithRefresh handle 401s
};