"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaUpload, FaPlay, FaMusic } from "react-icons/fa";
import { api } from "../../../lib/api";
import { deleteAudio, deleteImage, uploadAudio, uploadImage } from "../../../lib/upload";


const emptyForm = { storyId: "", episodeNumber: "", title: "", description: "", duration: "", audioFile: "", thumbnail: "", status: "Draft", isFree: "False" };

export default function EpisodesSection({ filterStoryProp = null }) {
    const [filterStory, setFilterStory] = useState(filterStoryProp || null);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingEpisode, setEditingEpisode] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [audioFileName, setAudioFileName] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [audioError, setAudioError] = useState('');
    const [epNumError, setEpNumError] = useState('')


    const [stories, setStories] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    // Replace static stories array with dynamic one
    const storyOptions = [...stories];

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filtered = episodes.filter((e) => {
        return e.title.toLowerCase().includes(search.toLowerCase());
    });

    const openAdd = () => {
        setEditingEpisode(null);
        setForm({ ...emptyForm, storyId: filterStory !== 'all' ? filterStory : stories[0]?.id || "" });
        setAudioFileName("");
        setThumbnailFile(null);
        setThumbnailPreview('');
        setShowModal(true);
    };

    const openEdit = (ep) => {
        setEditingEpisode(ep.id);
        setThumbnailFile(null);
        setThumbnailPreview(ep.thumbnail || '');
        setForm({
            storyId: ep.storyId,
            episodeNumber: ep.episodeNumber,
            title: ep.title,
            description: ep.description,
            thumbnail: ep.thumbnail,
            status: ep.isPublished ? "Published" : "Draft",
            isFree: ep.isFreePreview ? "True" : "False"
        });
        setAudioFileName(ep.audioUrl);
        setShowModal(true);
    };


    const handleSave = async () => {
        if (!form.title.trim()) {
            setTitleError('Title is required');
            return;
        }
        const validEpNum = episodes.filter((ep) => ep.episodeNumber === Number(form.episodeNumber) && ep.id !== editingEpisode);
        if (validEpNum.length > 0) {
            setEpNumError(`Episode Number ${form.episodeNumber} already exists`);
            return;
        }
        if (!editingEpisode && !form.audioFile) {
            setAudioError('Audio File is required');
            return;
        }

        setTitleError('');
        setAudioError('');
        setSaving(true);
        let uploadedAudioKey = null;
        let uploadedThumbnail = null;
        try {
            let thumbnail = form.thumbnail;
            let audioUrl = form.audioFile;

            if (thumbnailFile) {
                if (editingEpisode && form.thumbnail) await deleteImage(form.thumbnail);
                thumbnail = await uploadImage(thumbnailFile);
                uploadedThumbnail = thumbnail;
            }

            if (audioUrl && typeof audioUrl === 'object') {
                if (editingEpisode && form.audioFile && typeof form.audioFile === 'string') {
                    await deleteAudio(form.audioFile);
                }
                audioUrl = await uploadAudio(audioUrl);
                uploadedAudioKey = audioUrl;
            }

            const payload = {
                storyId: form.storyId,
                episodeNumber: Number(form.episodeNumber),
                title: form.title,
                description: form.description,
                duration: form.duration,
                audioUrl,
                thumbnail,
                isPublished: form.status === 'Published',
                isFreePreview: form.isFree === "True" ? true : false

            };

            if (editingEpisode) {
                await api.patch(`/episodes/${editingEpisode}`, payload);
            } else {
                await api.post('/episodes', payload);
            }

            const url = filterStory === 'all' ? '/episodes' : `/episodes/story/${filterStory}`;
            const data = await api.get(url);
            setEpisodes(Array.isArray(data) ? data : data.episodes ?? []);
            setShowModal(false);
            showToast('Episode saved successfully', 'success');
        } catch (err) {
            console.error('Save error:', err);
            if (uploadedAudioKey) await deleteAudio(uploadedAudioKey);
            if (uploadedThumbnail) await deleteImage(uploadedThumbnail);
            showToast('Failed to save episode', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(true);
            const episode = episodes.find((e) => e.id === id);
            if (episode?.thumbnail) await deleteImage(episode.thumbnail);
            if (episode?.audioUrl) await deleteAudio(episode.audioUrl);
            await api.delete(`/episodes/${id}`);
            setEpisodes((prev) => prev.filter((e) => e.id !== id));
            showToast('Episode deleted successfully', 'success');
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete episode', 'error');
        }
        finally {
            setDeleting(false);
        }
        setDeleteConfirm(null);
    };

    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAudioFileName(file.name);

        const audio = new Audio(URL.createObjectURL(file));
        audio.onloadedmetadata = () => {
            const totalSeconds = Math.floor(audio.duration);
            const mins = Math.floor(totalSeconds / 60);
            const secs = totalSeconds % 60;
            setForm(prev => ({
                ...prev,
                audioFile: file,
                duration: totalSeconds,          // store seconds for API
                durationDisplay: `${mins}:${secs.toString().padStart(2, '0')}` // for display
            }));
            URL.revokeObjectURL(audio.src);
        };
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };



    // Sync filterStoryProp → filterStory
    useEffect(() => {
        if (filterStoryProp) {
            setFilterStory(filterStoryProp);
        }
    }, [filterStoryProp]);

    // Fetch stories, auto-select only if no filterStoryProp
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const data = await api.get('/stories');
                setStories(data);
                if (data.length > 0 && !filterStoryProp) {
                    setFilterStory(data[0].id);
                }
            } finally {
                setPageLoading(false);
            }
        };
        fetchStories();
    }, []);

    // Fetch episodes whenever filterStory changes
    useEffect(() => {
        if (!filterStory) return;
        const fetchEpisodes = async () => {
            setEpisodes([]);
            const url = filterStory === 'all' ? '/episodes' : `/episodes/story/${filterStory}`;
            const data = await api.get(url);
            setEpisodes(data);
        };
        fetchEpisodes();
    }, [filterStory]);

    return (
        <div className="flex flex-col gap-6">

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-sm"
                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <FaSearch size={12} style={{ color: '#6B7280' }} />
                    <input
                        type="text"
                        placeholder="Search episodes or stories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-sm flex-1"
                        style={{ color: '#fff' }}
                    />
                </div>

                <div className="flex gap-3 items-center flex-wrap">
                    <select
                        value={filterStory || 'all'}
                        onChange={(e) => setFilterStory(e.target.value === 'all' ? null : e.target.value)}
                        className="px-3 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                    >
                        {storyOptions.map((s) => (
                            <option key={s.id} value={s.id} style={{ background: '#13131A' }}>
                                {s.title}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                    >
                        <FaPlus size={11} />
                        Add Episode
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
                {[
                    { label: "Total Episodes", value: episodes.length },
                    { label: "Published", value: episodes.filter(e => e?.isPublished).length },
                    { label: "Draft", value: episodes.filter(e => !e?.isPublished).length },
                    { label: "No Audio", value: episodes.filter(e => !e?.audioUrl).length },
                ].map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1 px-5 py-3 rounded-xl"
                        style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span style={{ color: '#6B7280', fontSize: '11px' }}>{stat.label}</span>
                        <span className="text-white font-bold text-xl">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Episodes Table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Table Header */}
                <div className="grid px-4 py-3 text-xs font-semibold"
                    style={{ color: '#6B7280', borderBottom: '1px solid rgba(255,255,255,0.06)', gridTemplateColumns: '2fr 1.5fr 0.5fr 1fr 1fr 1fr' }}>
                    <span>Episode</span>
                    <span>Story</span>
                    <span>Ep#</span>
                    <span>Duration</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {filtered.length === 0 ? (
                    <div className="px-4 py-10 text-center" style={{ color: '#6B7280' }}>No episodes found</div>
                ) : (
                    filtered.map((ep, i) => (
                        <div
                            key={ep.id}
                            className="grid px-4 py-4 items-center"
                            style={{
                                gridTemplateColumns: '2fr 1.5fr 0.5fr 1fr 1fr 1fr',
                                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            }}
                        >
                            {/* Title + Thumbnail */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={ep.thumbnail || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=100&q=80"}
                                    alt={ep.title}
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-white text-sm font-semibold truncate">{ep.title}</span>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        {ep?.audioUrl ? (
                                            <span className="flex items-center gap-1" style={{ color: '#00E5FF', fontSize: '10px' }}>
                                                <FaMusic size={8} /> Audio
                                            </span>
                                        ) : (
                                            <span style={{ color: '#ef4444', fontSize: '10px' }}>No audio</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Story */}
                            <span className="text-xs truncate" style={{ color: '#9CA3AF' }}>{ep?.story?.title}</span>

                            {/* Episode Number */}
                            <span className="text-xs font-bold" style={{ color: '#6C5CE7' }}>E{String(ep?.episodeNumber).padStart(2, '0')}</span>

                            {/* Duration */}
                            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{Math.floor(ep?.duration / 60)}:{String(ep.duration % 60).padStart(2, '0')}</span>

                            {/* Status */}
                            <div>
                                <span
                                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                        background: ep?.isPublished ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.05)',
                                        color: ep?.isPublished ? '#00E5FF' : '#6B7280',
                                    }}
                                >
                                    {ep?.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEdit(ep)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-white/10"
                                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    <FaEdit size={12} style={{ color: '#6C5CE7' }} />
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(ep.id)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-red-500/10"
                                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    <FaTrash size={12} style={{ color: '#ef4444' }} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <div className="relative w-full max-w-lg">
                        <div className="rounded-2xl p-6 flex flex-col gap-5 overflow-y-auto"
                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', scrollbarWidth: 'none' }}>

                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-bold text-lg">{editingEpisode ? "Edit Episode" : "Add New Episode"}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition">
                                    <FaTimes size={14} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Story + Episode Number */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ color: '#6B7280', fontSize: '12px' }}>Story</label>
                                        <select
                                            value={form.storyId}
                                            onChange={(e) => setForm({ ...form, storyTitle: e.target.value })}
                                            className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                        >
                                            {stories.map((s) => (
                                                <option key={s.id} value={s.id} style={{ background: '#0B0B0F' }}>{s.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ color: '#6B7280', fontSize: '12px' }}>Episode Number</label>
                                        <input
                                            type="number"
                                            value={form.episodeNumber}
                                            onChange={(e) => { setForm({ ...form, episodeNumber: e.target.value }); setEpNumError(''); }}
                                            placeholder="1"
                                            className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                            style={{ background: '#0B0B0F', border: `1px solid ${epNumError ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }}
                                        />
                                        {epNumError && <p style={{ color: '#ef4444', fontSize: '11px' }}>{epNumError}</p>}
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="flex flex-col gap-1.5">
                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>Episode Title</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => { setForm({ ...form, title: e.target.value }); setTitleError(''); }}
                                        placeholder="Episode title"
                                        className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                        style={{ border: `1px solid ${titleError ? '#ef4444' : 'rgba(255,255,255,0.08)'}` }}
                                    />
                                    {titleError && <p style={{ color: '#ef4444', fontSize: '11px' }}>{titleError}</p>}
                                </div>

                                {/* IsFree */}
                                <div className="flex flex-col gap-1.5">
                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>IsFree?</label>
                                    <select
                                        value={form.isFree}
                                        onChange={(e) => setForm({ ...form, isFree: e.target.value })}
                                        className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </select>
                                </div>

                                {/* Thumbnail + Status */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ color: '#6B7280', fontSize: '12px' }}>Thumbnail</label>
                                        <div className="flex items-center gap-3">
                                            {thumbnailPreview && (
                                                <div className="relative w-12 h-12">
                                                    <img src={thumbnailPreview} alt="thumbnail" className="w-12 h-12 rounded-lg object-cover" />
                                                    <button
                                                        onClick={() => { setThumbnailPreview(''); setThumbnailFile(null); setForm({ ...form, thumbnail: '' }); }}
                                                        className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center"
                                                        style={{ background: '#FF4757', width: 16, height: 16 }}
                                                    >
                                                        <FaTimes size={8} color="white" />
                                                    </button>
                                                </div>
                                            )}
                                            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:opacity-80 transition"
                                                style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280' }}>
                                                Choose Image
                                                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label style={{ color: '#6B7280', fontSize: '12px' }}>Status</label>
                                        <select
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                            className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                        </select>
                                    </div>
                                </div>

                                {!editingEpisode && (
                                    < div className="flex flex-col gap-1.5">
                                        {/* Audio Upload */}
                                        <div className="flex flex-col gap-1.5">
                                            <label style={{ color: '#6B7280', fontSize: '12px' }}>Audio File</label>
                                            <label
                                                className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl cursor-pointer transition hover:border-[#6C5CE7]"
                                                style={{ background: '#0B0B0F', border: '2px dashed rgba(255,255,255,0.1)' }}
                                            >
                                                <FaUpload size={20} style={{ color: '#6B7280' }} />
                                                <span style={{ color: audioFileName ? '#00E5FF' : '#6B7280', fontSize: '13px' }}>
                                                    {audioFileName || "Click to upload audio file"}
                                                </span>
                                                <span style={{ color: '#6B7280', fontSize: '11px' }}>MP3, WAV, OGG supported</span>
                                                <input
                                                    type="file"
                                                    accept="audio/*"
                                                    className="hidden"
                                                    onChange={(e) => { handleAudioUpload(e); setAudioError(''); }}
                                                />
                                            </label>
                                            {audioError && <p style={{ color: '#ef4444', fontSize: '11px' }}>{audioError}</p>}
                                        </div>
                                    </div>)}


                                {!editingEpisode && form.durationDisplay && (
                                    <div className="flex flex-col gap-1.5">
                                        {/* Duration */}
                                        {form.durationDisplay && (
                                            <p className="text-white text-sm px-4 py-2.5 rounded-xl" style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                {form.durationDisplay}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <div className="flex flex-col gap-1.5">
                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Episode description..."
                                        rows={3}
                                        className="px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                                        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-white/10"
                                    style={{ color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                                    style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                                >
                                    {editingEpisode ? "Save Changes" : "Add Episode"}
                                </button>
                            </div>
                        </div>
                        {/* Overlay outside scrollable div */}
                        {saving && (
                            <div className="absolute inset-0 rounded-2xl flex items-center justify-center z-10"
                                style={{ background: 'rgba(0,0,0,0.7)' }}>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 rounded-full animate-spin"
                                        style={{ border: '3px solid rgba(108,92,231,0.3)', borderTopColor: '#6C5CE7' }} />
                                    <p className="text-white text-sm">Saving...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )
            }

            {/* Delete Confirm */}
            {
                deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
                        <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 className="text-white font-bold text-lg">Delete Episode?</h3>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>This will permanently delete the episode and its audio. This action cannot be undone.</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                                    style={{ color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                                    style={{ background: '#ef4444' }}
                                >
                                    {
                                        deleting ? "Deleting..." : "Delete"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                toast && (
                    <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-all"
                        style={{ background: toast.type === 'success' ? '#22c55e' : '#ef4444' }}>
                        {toast.message}
                    </div>
                )
            }
        </div >
    );
}