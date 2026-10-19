import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';

const empty = { couple_names: '', image_url: '', story: '', location: '', married_on: '', is_published: true };

/* ------------------------------ HELPERS ------------------------------ */

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Draft' },
];

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent focus:bg-white transition';

/* ------------------------------ ICONS ------------------------------ */

const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const HeartIcon = ({ size = 28 }) => (
  <svg {...svgProps} width={size} height={size} strokeWidth="1.8">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const PinIcon = () => (
  <svg {...svgProps} width="14" height="14">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg {...svgProps} width="14" height="14">
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TrashIcon = () => (
  <svg {...svgProps} width="16" height="16">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const PlusIcon = () => (
  <svg {...svgProps} width="18" height="18">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ------------------------------ SMALL PARTS ------------------------------ */

const Field = ({ label, optional, children }) => (
  <label className="block">
    <span className="block mb-1.5 text-sm font-medium text-slate-700">
      {label}
      {optional && <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>}
    </span>
    {children}
  </label>
);

const Switch = ({ checked, onChange, disabled, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
      checked ? 'bg-green-500' : 'bg-slate-300'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-[22px]' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const CoverImage = ({ src, alt, className = '' }) => {
  const [failedSrc, setFailedSrc] = useState('');
  const ok = src && failedSrc !== src;
  return ok ? (
    <img src={src} alt={alt} onError={() => setFailedSrc(src)} className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-indigo-100 text-rose-400 ${className}`}>
      <HeartIcon size={36} />
    </div>
  );
};

const StoryCard = ({ story, busy, onToggle, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const text = story.story || '';
  const isLong = text.length > 130;
  const date = formatDate(story.married_on);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
      <div className="relative">
        <CoverImage src={story.image_url} alt={story.couple_names} className="w-full h-48" />
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur ${
            story.is_published ? 'bg-green-100/95 text-green-700' : 'bg-slate-100/95 text-slate-600'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${story.is_published ? 'bg-green-500' : 'bg-slate-400'}`} />
          {story.is_published ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-lg text-slate-800">{story.couple_names}</h3>
        {(story.location || date) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
            {story.location && (
              <span className="inline-flex items-center gap-1">
                <PinIcon /> {story.location}
              </span>
            )}
            {date && (
              <span className="inline-flex items-center gap-1">
                <CalendarIcon /> {date}
              </span>
            )}
          </div>
        )}

        <p className={`text-sm text-slate-600 mt-3 whitespace-pre-line break-words ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
          {text}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="self-start mt-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="mt-auto">
          <div className="mt-5 pt-5 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <Switch
                checked={!!story.is_published}
                onChange={onToggle}
                disabled={busy}
                label={story.is_published ? 'Unpublish story' : 'Publish story'}
              />
              <span className="text-xs font-medium text-slate-500">{story.is_published ? 'Live' : 'Hidden'}</span>
            </div>
            <button
              onClick={onDelete}
              disabled={busy}
              title="Delete story"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
            >
              <TrashIcon /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 w-2/3 rounded bg-slate-200" />
      <div className="h-3 w-1/2 rounded bg-slate-100" />
      <div className="h-12 rounded bg-slate-100" />
    </div>
  </div>
);

/* ------------------------------ PAGE ------------------------------ */

const AdminStories = () => {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null); // { type, text }

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async (showSkeleton = true) => {
    if (showSkeleton) setLoading(true);
    setError('');
    try {
      const res = await api.get('/stories/admin');
      if (res.success) setStories(res.data);
      else setError(res.message || 'Failed to load stories');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!confirmDelete) return;
    const onKey = (e) => e.key === 'Escape' && setConfirmDelete(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmDelete]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/stories/admin', form);
      setForm(empty);
      showToast('success', 'Story added');
      load(false);
    } catch (err) {
      showToast('error', err.message || 'Could not add story');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    setBusyId(id);
    try {
      await api.delete(`/stories/admin/${id}`);
      setStories((prev) => prev.filter((s) => s.id !== id));
      showToast('success', 'Story deleted');
    } catch (e) {
      showToast('error', e.message || 'Could not delete story');
    } finally {
      setBusyId(null);
      setConfirmDelete(null);
    }
  };

  const togglePublish = async (s) => {
    setBusyId(s.id);
    try {
      await api.put(`/stories/admin/${s.id}`, { is_published: !s.is_published });
      setStories((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_published: !s.is_published } : x)));
      showToast('success', s.is_published ? 'Story unpublished' : 'Story published');
    } catch (e) {
      showToast('error', e.message || 'Could not update story');
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(
    () => ({
      all: stories.length,
      published: stories.filter((s) => s.is_published).length,
      draft: stories.filter((s) => !s.is_published).length,
    }),
    [stories]
  );

  const visible = stories.filter((s) =>
    filter === 'all' ? true : filter === 'published' ? s.is_published : !s.is_published
  );

  return (
    <div className="space-y-10">
      {/* ADD STORY */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500" />
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-800">Add a success story</h2>
          <p className="text-sm text-slate-500 mt-1">Share a happy couple's journey on the website.</p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FIELDS */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Couple names">
                <input placeholder="e.g. Rahul & Priya" value={form.couple_names} onChange={set('couple_names')} required className={inputClass} />
              </Field>
              <Field label="Location" optional>
                <input placeholder="e.g. Mumbai" value={form.location} onChange={set('location')} className={inputClass} />
              </Field>
              <Field label="Image URL" optional>
                <input placeholder="https://..." value={form.image_url} onChange={set('image_url')} className={inputClass} />
              </Field>
              <Field label="Married on" optional>
                <input type="date" value={form.married_on} onChange={set('married_on')} className={inputClass} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Story">
                  <textarea
                    placeholder="How did they meet and what made it special?"
                    value={form.story}
                    onChange={set('story')}
                    required
                    rows="5"
                    className={`${inputClass} resize-none`}
                  />
                </Field>
              </div>
            </div>

            {/* LIVE PREVIEW */}
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">Preview</p>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <CoverImage src={form.image_url} alt="Preview" className="w-full h-40" />
                <div className="p-4">
                  <p className="font-bold text-slate-800 truncate">{form.couple_names || 'Couple names'}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {[form.location, formatDate(form.married_on)].filter(Boolean).join(' · ') || 'Location · Date'}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3">{form.story || 'Your story will appear here.'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_published}
                onChange={() => setForm({ ...form, is_published: !form.is_published })}
                label="Publish immediately"
              />
              <span className="text-sm text-slate-600">{form.is_published ? 'Publish immediately' : 'Save as draft'}</span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <PlusIcon /> Add Story
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* STORIES LIST */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold text-slate-800">All stories</h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
                    active ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                  <span className={`ml-1.5 text-xs ${active ? 'text-slate-300' : 'text-slate-400'}`}>{counts[f.key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => load()} className="font-semibold underline hover:no-underline">
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((s) => (
              <StoryCard
                key={s.id}
                story={s}
                busy={busyId === s.id}
                onToggle={() => togglePublish(s)}
                onDelete={() => setConfirmDelete(s)}
              />
            ))}
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center py-16 px-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
              <HeartIcon />
            </span>
            <p className="font-semibold text-slate-800">
              {stories.length === 0 ? 'No stories yet' : `No ${filter} stories`}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {stories.length === 0 ? 'Add your first success story using the form above.' : 'Try a different filter.'}
            </p>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => setConfirmDelete(null)}>
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-800">Delete this story?</h3>
            <p className="text-sm text-slate-600 mt-2">
              "{confirmDelete.couple_names}" will be removed permanently. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => remove(confirmDelete.id)}
                disabled={busyId === confirmDelete.id}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
              >
                {busyId === confirmDelete.id ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${
            toast.type === 'success' ? 'bg-slate-900' : 'bg-red-600'
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default AdminStories;