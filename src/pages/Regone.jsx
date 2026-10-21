import React, { useEffect, useRef, useState } from 'react';
import { motherTongues } from '../data/motherTongues';
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  UsersIcon,
  HeartIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ArrowRightIcon,
  ClockIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const inputBase =
  "w-full border border-yellow-600 rounded-xl bg-white py-3.5 pl-11 shadow-sm transition duration-200 " +
  "hover:shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-600/20";
const labelCls = "block mb-2 text-sm font-semibold text-red-800";
const iconCls = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-600";
const star = <span className="text-red-500"> *</span>;

/* ---------- Custom dropdown (replaces the browser's plain select popup) ----------
   Defined outside the page component so it never remounts.
   It calls onChange with { target: { name, value } }, so the page's handleChange works unchanged. */
const Dropdown = ({ id, label, icon: Icon, name, value, onChange, placeholder, options }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const searchable = options.length > 8;
  const filtered = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));

  // close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  // keep the highlighted option visible while using the arrow keys
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const openPanel = () => {
    setQuery('');
    const i = options.indexOf(value);
    setActive(i >= 0 ? i : 0);
    setOpen(true);
  };

  const choose = (opt) => {
    onChange({ target: { name, value: opt } });
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key) && e.target === triggerRef.current) {
        e.preventDefault();
        openPanel();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[active]) choose(filtered[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div>
      <label htmlFor={id} className={labelCls}>{label}{star}</label>
      <div className="relative" ref={wrapRef} onKeyDown={onKeyDown}>
        <Icon className={iconCls} />

        <button
          type="button"
          id={id}
          ref={triggerRef}
          onClick={() => (open ? setOpen(false) : openPanel())}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={
            inputBase + " pr-10 text-left " +
            (open ? "ring-4 ring-yellow-600/20 " : "") +
            (value ? "text-black" : "text-yellow-600")
          }
        >
          <span className="block truncate">{value || placeholder}</span>
        </button>

        <ChevronDownIcon
          className={
            "pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600 transition-transform duration-200 " +
            (open ? "rotate-180" : "")
          }
        />

        {/* keeps the browser's "required" validation working */}
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => {}}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full opacity-0"
        />

        {open && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-yellow-600 bg-white shadow-2xl">
            {searchable && (
              <div className="relative border-b border-yellow-600/30 p-2">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                  placeholder="Search"
                  aria-label={`Search ${label}`}
                  className="w-full rounded-lg bg-gray-50 py-2 pl-9 pr-3 text-sm text-black placeholder-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600/30"
                />
              </div>
            )}

            <ul ref={listRef} role="listbox" aria-label={label} className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-500">No results</li>
              )}
              {filtered.map((opt, i) => (
                <li
                  key={`${opt}-${i}`}
                  role="option"
                  aria-selected={opt === value}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(opt)}
                  className={
                    "flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors " +
                    (i === active ? "bg-yellow-600/10 " : "") +
                    (opt === value ? "font-semibold text-red-800" : "text-gray-800")
                  }
                >
                  <span>{opt}</span>
                  {opt === value && <CheckIcon className="h-4 w-4 shrink-0 text-red-800" />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const Regone = () => {
  const [formData, setFormData] = useState({
    prefix: 'Mr',
    name: '',
    dob: '',
    motherTongue: '',
    religion: '',
    caste: '',
    maritalStatus: '',
    height: '',
  });

  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];
  const castes = ['Brahmin', 'Rajput', 'Yadav', 'SC', 'ST', 'OBC', 'Other'];
  const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Separated'];
  const heights = [
    '4ft 6in', '4ft 8in', '5ft 0in', '5ft 2in', '5ft 4in',
    '5ft 6in', '5ft 8in', '5ft 10in', '6ft 0in', '6ft 2in'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const perks = [
    { icon: HeartIcon, title: "Better matches", text: "Your age, language, religion and more help us suggest people who fit you." },
    { icon: EyeSlashIcon, title: "Contact details stay hidden", text: "Other users see your profile, not your phone number or email." },
    { icon: ClockIcon, title: "Quick to finish", text: "Just six short fields and you are done." },
  ];

  return (
    <div>
      <style>{`
        @keyframes rgRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .rg-rise { animation: rgRise .6s ease-out both; }
        .rg-rise-2 { animation: rgRise .6s .12s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .rg-rise, .rg-rise-2 { animation: none; } }
      `}</style>

      <div className="relative min-h-screen bg-gray-100 px-4 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-600/10 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-red-900/10 blur-3xl" />
        </div>

        {/* Heading */}
        <div className="relative rg-rise text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-800">Complete your profile now</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-900" />
          <p className="mt-5 text-lg text-gray-700">
            Tell us a little about yourself so we can find people who are right for you.
          </p>
        </div>

        <div className="relative rg-rise-2 max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-stretch">

          {/* ---------- Left: image + info card ---------- */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="relative shrink-0 overflow-hidden rounded-2xl shadow-xl">
              <img
                src="./image/s23.jpg"
                alt="Banner"
                className="w-full h-80 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/85 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-6 right-6 text-white text-xl font-bold leading-snug">
                A few details are all it takes to find your match.
              </p>
            </div>

            <div className="relative flex-1 overflow-hidden bg-red-900 text-white rounded-2xl shadow-xl p-8">
              <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-yellow-600/10" />
              <h3 className="relative text-xl font-bold mb-6">Why we ask</h3>
              <ul className="relative space-y-5">
                {perks.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-sm text-white/70">{title}</p>
                      <p className="font-semibold leading-snug">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Right: form card ---------- */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl shadow-xl border-t-4 border-red-900 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900">Your details</h2>
            <p className="mt-1 mb-8 text-gray-600">Fields marked with * are required.</p>

            <form className="flex flex-1 flex-col gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Date of Birth */}
                <div>
                  <label htmlFor="dob" className={labelCls}>Date of Birth{star}</label>
                  <div className="relative">
                    <CalendarDaysIcon className={iconCls} />
                    <input
                      id="dob"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className={inputBase + " pr-4"}
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <Dropdown
                  id="maritalStatus"
                  label="Marital Status"
                  icon={HeartIcon}
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  placeholder="Select Marital Status"
                  options={maritalStatuses}
                />

                {/* Mother Tongue */}
                <Dropdown
                  id="motherTongue"
                  label="Mother Tongue"
                  icon={ChatBubbleLeftRightIcon}
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleChange}
                  placeholder="Select Mother Tongue"
                  options={motherTongues}
                />

                {/* Religion */}
                <Dropdown
                  id="religion"
                  label="Religion"
                  icon={SparklesIcon}
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  placeholder="Select Religion"
                  options={religions}
                />

                {/* Caste */}
                <Dropdown
                  id="caste"
                  label="Caste"
                  icon={UsersIcon}
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  placeholder="Select Caste"
                  options={castes}
                />

                {/* Height (typed) */}
                <div>
                  <label htmlFor="height" className={labelCls}>Height{star}</label>
                  <div className="relative">
                    <ArrowsUpDownIcon className={iconCls} />
                    <input
                      id="height"
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="Enter height"
                      required
                      className={inputBase + " pr-4 text-black placeholder-yellow-600"}
                    />
                  </div>
                </div>
              </div>

              {/* Height (quick pick) */}
              <div>
                <p className="mb-3 text-sm text-red-800">
                  You can either type your height or select from the list.
                </p>
                <div className="flex flex-wrap gap-2">
                  {heights.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData({ ...formData, height: h })}
                      aria-pressed={formData.height === h}
                      className={
                        'rounded-full border px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-600/30 ' +
                        (formData.height === h
                          ? 'border-red-900 bg-red-900 text-white shadow'
                          : 'border-yellow-600 bg-white text-gray-800 hover:bg-yellow-600/10')
                      }
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-auto w-full flex items-center justify-center gap-2 bg-red-900 text-white font-semibold tracking-wide py-4 rounded-xl shadow-lg
                           hover:bg-red-700 hover:shadow-xl active:scale-[0.99] transition duration-200
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-red-800/30"
              >
                Continue
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regone;