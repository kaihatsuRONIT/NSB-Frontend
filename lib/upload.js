import fetchWithRefresh from './fetchWithRefresh';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetchWithRefresh(`${API_URL}/upload/image`, {
        method: 'POST',
        body: formData,
    });
    const data = await res.json();
    return data.url;
};

export const deleteImage = async (url) => {
    await fetchWithRefresh(`${API_URL}/upload/image`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    });
};

export const uploadAudio = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetchWithRefresh(`${API_URL}/upload/audio`, {
        method: 'POST',
        body: formData,
    });
    const data = await res.json();
    return data.key;
};

export const deleteAudio = async (key) => {
    await fetchWithRefresh(`${API_URL}/upload/audio`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
    });
};