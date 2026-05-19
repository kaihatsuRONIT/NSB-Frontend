import fetchWithRefresh from './fetchWithRefresh';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
    get: (path) =>
        fetchWithRefresh(`${API_URL}${path}`).then((res) => res?.json()),

    post: (path, body) =>
        fetchWithRefresh(`${API_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then((res) => res?.json()),

    patch: (path, body) =>
        fetchWithRefresh(`${API_URL}${path}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then((res) => res?.json()),

    delete: (path) =>
        fetchWithRefresh(`${API_URL}${path}`, {
            method: 'DELETE',
        }).then((res) => res?.json()),
};