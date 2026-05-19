"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaFilm } from "react-icons/fa";
import { api } from "../../../lib/api";
import Loading from "../Loading";
import { deleteImage, uploadImage } from "../../../lib/upload";


const genres = ["All", "Fantasy", "Mystery", "Sci-Fi", "Thriller", "Romance"];
const emptyForm = { title: "", category: "Fantasy", description: "", status: "Draft", coverImage: "", language: "Hindi", price: 0, tags: [], accessDuration: "" };

export default function StoriesSection({ onViewEpisodes }) {
    const [stories, setStories] = useState([]);
    const [search, setSearch] = useState("");
    const [filterGenre, setFilterGenre] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [tagInput, setTagInput] = useState('');

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file)); // local preview
    };

    const handleSave = async () => {
        setError('');
        if (!form.title.trim()) {
            setError('Title is required');
            return;
        }
        setSaving(true);
        try {
            let coverImage = form.coverImage;

            // Upload image only on save
            if (thumbnailFile) {
                if (form.coverImage) await deleteImage(form.coverImage);
                coverImage = await uploadImage(thumbnailFile);
            }

            if (editingStory) {
                await api.patch(`/stories/${editingStory}`, {
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    coverImage,
                    tags: form.tags,
                    isPublished: form.status === 'Published',
                });
            } else {
                await api.post('/stories', {
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    coverImage,
                    language: form.language,
                    price: Number(form.price),
                    isFree: Number(form.price) === 0,
                    tags: form.tags,
                    isPublished: form.status === 'Published',
                    accessDuration: form.accessDuration ? Number(form.accessDuration) : null,
                });
            }

            const data = await api.get('/stories');
            setStories(data);
            setShowModal(false);
        } catch {
            setError('Failed to save story');
        } finally {
            setSaving(false);
        }
    };

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (!tag || form.tags.includes(tag)) return;
        setForm({ ...form, tags: [...form.tags, tag] });
        setTagInput('');
    };

    const handleRemoveTag = (tag) => {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    };

    const filtered = stories.filter((s) => {
        const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
        const matchGenre = filterGenre === "All" || s.genre === filterGenre;
        return matchSearch && matchGenre;
    });

    const openAdd = () => {
        setEditingStory(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (story) => {
        setEditingStory(story.id);
        setThumbnailPreview(story.coverImage || '');
        setThumbnailFile(null);
        setForm({
            title: story.title,
            category: story.category,
            description: story.description,
            status: story.isPublished ? "Published" : "Draft",
            coverImage: story.coverImage,
            tags: story.tags || [],
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const story = stories.find((s) => s.id === id);
            if (story?.coverImage) await deleteImage(story.coverImage);
            await api.delete(`/stories/${id}`);
            setStories((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error('Delete error:', err);
        }
        setDeleteConfirm(null);
    };

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const data = await api.get('/stories');
                setStories(data);
            } finally {
                setPageLoading(false);
            }
        };
        fetchStories();
    }, []);
    return (
        <>
            {
                pageLoading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="flex flex-col gap-6">

                            {/* Header Row */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-sm"
                                    style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <FaSearch size={12} style={{ color: '#6B7280' }} />
                                    <input
                                        type="text"
                                        placeholder="Search stories..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="bg-transparent outline-none text-sm flex-1"
                                        style={{ color: '#fff' }}
                                    />
                                </div>

                                <div className="flex gap-3 items-center flex-wrap">
                                    <select
                                        value={filterGenre}
                                        onChange={(e) => setFilterGenre(e.target.value)}
                                        className="px-3 py-2.5 rounded-xl text-sm outline-none"
                                        style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                                    >
                                        {genres.map((g) => <option key={g} value={g}>{g}</option>)}
                                    </select>

                                    <button
                                        onClick={openAdd}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                                        style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                                    >
                                        <FaPlus size={11} />
                                        Add Story
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-4">
                                {[
                                    { label: "Total", value: stories.length },
                                    { label: "Published", value: stories.filter(s => s.status === "Published").length },
                                    { label: "Draft", value: stories.filter(s => s.status === "Draft").length },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex flex-col gap-1 px-5 py-3 rounded-xl"
                                        style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <span style={{ color: '#6B7280', fontSize: '11px' }}>{stat.label}</span>
                                        <span className="text-white font-bold text-xl">{stat.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Story Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.length === 0 ? (
                                    <div className="col-span-3 py-10 text-center" style={{ color: '#6B7280' }}>No stories found</div>
                                ) : (
                                    filtered.map((story) => (
                                        <div
                                            key={story.id}
                                            className="flex flex-col rounded-2xl overflow-hidden"
                                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.08)' }}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-40 overflow-hidden">
                                                <img
                                                    src={story?.coverImage || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80"}
                                                    alt={story?.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #13131A 0%, transparent 60%)' }} />

                                                {/* Status Badge */}
                                                <div className="absolute top-2 right-2">
                                                    <span
                                                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                                        style={{
                                                            background: story?.isPublished === true ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.1)',
                                                            color: story?.isPublished === true ? '#00E5FF' : '#6B7280',
                                                            backdropFilter: 'blur(4px)',
                                                        }}
                                                    >
                                                        {story?.isPublished === true ? "Published" : "Draft"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex flex-col gap-3 p-4">
                                                <div>
                                                    <h3 className="text-white font-bold text-base">{story?.title}</h3>
                                                    <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6B7280' }}>{story.description}</p>
                                                </div>

                                                {/* Genre + Episodes */}
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                                                        style={{ background: 'rgba(108,92,231,0.15)', color: '#6C5CE7' }}
                                                    >
                                                        {story?.category}
                                                    </span>
                                                    <span
                                                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                                                        style={{ background: 'rgba(255,255,255,0.05)', color: '#9CA3AF' }}
                                                    >
                                                        {story?.episodes?.length} Episodes
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-3 p-4 justify-between flex-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => openEdit(story)}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-white/10 flex-1 justify-center"
                                                        style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#6C5CE7' }}
                                                    >
                                                        <FaEdit size={11} />
                                                        Edit
                                                    </button>

                                                    {/* Episodes */}
                                                    <button
                                                        onClick={() => onViewEpisodes(story?.id)}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition hover:opacity-90 flex-1 justify-center"
                                                        style={{ background: '#00E5FF', color: '#000' }}
                                                    >
                                                        <FaFilm size={11} />
                                                        Episodes
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => setDeleteConfirm(story?.id)}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-red-500/10 flex-1 justify-center"
                                                        style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#ef4444' }}
                                                    >
                                                        <FaTrash size={11} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add/Edit Modal */}
                            {
                                showModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
                                        <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5"
                                            style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.1)' }}>

                                            <div className="flex items-center justify-between">
                                                <h3 className="text-white font-bold text-lg">{editingStory ? "Edit Story" : "Add New Story"}</h3>
                                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition">
                                                    <FaTimes size={14} />
                                                </button>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                {/* Title */}
                                                <div className="flex flex-col gap-1.5">
                                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>Title</label>
                                                    <input
                                                        type="text"
                                                        value={form.title}
                                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                        placeholder="Story title"
                                                        className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                                        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* Category */}
                                                    <div className="flex flex-col gap-1.5">
                                                        <label style={{ color: '#6B7280', fontSize: '12px' }}>Category</label>
                                                        <select
                                                            value={form.category}
                                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                            className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                                            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                                        >
                                                            {genres.filter(g => g !== "All").map((g) => <option key={g} value={g} style={{ background: '#0B0B0F' }}>{g}</option>)}
                                                        </select>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="flex flex-col gap-1.5">
                                                        <label style={{ color: '#6B7280', fontSize: '12px' }}>Status</label>
                                                        <select
                                                            value={form.status}
                                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                                            className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                                            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                                        >
                                                            <option value="Draft" style={{ background: '#0B0B0F' }}>Draft</option>
                                                            <option value="Published" style={{ background: '#0B0B0F' }}>Published</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Thumbnail Upload */}
                                                <div className="flex flex-col gap-1.5">
                                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>Thumbnail</label>
                                                    <div className="flex items-center gap-3">
                                                        {thumbnailPreview && (
                                                            <div className="relative w-12 h-12">
                                                                <img src={thumbnailPreview} alt="thumbnail" className="w-12 h-12 rounded-lg object-cover" />
                                                                <button
                                                                    onClick={() => { setThumbnailPreview(''); setThumbnailFile(null); setForm({ ...form, coverImage: '' }); }}
                                                                    className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center"
                                                                    style={{ background: '#FF4757', width: 16, height: 16 }}
                                                                >
                                                                    <FaTimes size={8} color="white" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:opacity-80 transition"
                                                            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280' }}>
                                                            {uploading ? 'Uploading...' : 'Choose Image'}
                                                            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="flex flex-col gap-1.5">
                                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>Description</label>
                                                    <textarea
                                                        value={form.description}
                                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                        placeholder="Story description..."
                                                        rows={3}
                                                        className="px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                                                        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                                    />
                                                </div>

                                                {/* Language & Price — add only */}
                                                {!editingStory && (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="flex flex-col gap-1.5">
                                                            <label style={{ color: '#6B7280', fontSize: '12px' }}>Language</label>
                                                            <select
                                                                value={form.language}
                                                                onChange={(e) => setForm({ ...form, language: e.target.value })}
                                                                className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                                                style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                                            >
                                                                {["Hindi", "English"].map(l => (
                                                                    <option key={l} value={l} style={{ background: '#0B0B0F' }}>{l}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <label style={{ color: '#6B7280', fontSize: '12px' }}>Price (₹)</label>
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                value={form.price}
                                                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                                                placeholder="0 for free"
                                                                className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                                                style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <label style={{ color: '#6B7280', fontSize: '12px' }}>Access Duration (In days)</label>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                value={form.accessDuration}
                                                                onChange={(e) => setForm({ ...form, accessDuration: e.target.value })}
                                                                placeholder="Leave empty for lifetime"
                                                                className="px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                                                style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Tags — both add and edit */}
                                                <div className="flex flex-col gap-1.5">
                                                    <label style={{ color: '#6B7280', fontSize: '12px' }}>Tags</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={tagInput}
                                                            onChange={(e) => setTagInput(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                            placeholder="Type a tag and press Enter"
                                                            className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                                                            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                                                        />
                                                        <button
                                                            onClick={handleAddTag}
                                                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
                                                            style={{ background: '#6C5CE7' }}
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                    {form.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {form.tags.map(tag => (
                                                                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                                                                    style={{ background: 'rgba(108,92,231,0.2)', color: '#A78BFA' }}>
                                                                    {tag}
                                                                    <FaTimes size={9} className="cursor-pointer hover:opacity-70" onClick={() => handleRemoveTag(tag)} />
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {error && <p className="text-red-400 text-xs">{error}</p>}

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
                                                    disabled={saving || uploading}
                                                    className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                                                    style={{ background: 'linear-gradient(90deg, #6C5CE7 0%, #00E5FF 50.13%)' }}
                                                >
                                                    {saving ? 'Saving...' : editingStory ? "Save Changes" : "Add Story"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Delete Confirm */}
                            {deleteConfirm && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
                                    <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
                                        style={{ background: '#13131A', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <h3 className="text-white font-bold text-lg">Delete Story?</h3>
                                        <p style={{ color: '#6B7280', fontSize: '14px' }}>This will permanently delete the story and all its episodes.</p>
                                        <div className="flex gap-3 justify-end">
                                            <button onClick={() => setDeleteConfirm(null)}
                                                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                                                style={{ color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                Cancel
                                            </button>
                                            <button onClick={() => handleDelete(deleteConfirm)}
                                                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                                                style={{ background: '#ef4444' }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )
            }
        </>
    );
}