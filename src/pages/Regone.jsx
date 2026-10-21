import React, { useState } from 'react';
import { motherTongues } from '../data/motherTongues';
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  UsersIcon,
  HeartIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
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

/* ---------- UI helper: a select with a left icon and a custom arrow (outside the page component so it never remounts) ---------- */
const SelectField = ({ id, label, icon: Icon, name, value, onChange, placeholder, options }) => (
  <div>
    <label htmlFor={id} className={labelCls}>{label}{star}</label>
    <div className="relative">
      <Icon className={iconCls} />
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required
        className={inputBase + " appearance-none pr-10 " + (value ? "text-black" : "text-yellow-600")}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt} className="text-black">{opt}</option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600" />
    </div>
  </div>
);

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

        <div className="relative rg-rise-2 max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start">

          {/* ---------- Left: image + info card ---------- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="./image/s23.jpg"
                alt="Banner"
                className="w-full h-96 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/85 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-6 right-6 text-white text-xl font-bold leading-snug">
                A few details are all it takes to find your match.
              </p>
            </div>

            <div className="relative overflow-hidden bg-red-900 text-white rounded-2xl shadow-xl p-8">
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
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border-t-4 border-red-900 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900">Your details</h2>
            <p className="mt-1 mb-8 text-gray-600">Fields marked with * are required.</p>

            <form className="space-y-6">
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
                <SelectField
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
                <SelectField
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
                <SelectField
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
                <SelectField
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
                className="w-full flex items-center justify-center gap-2 bg-red-900 text-white font-semibold tracking-wide py-4 rounded-xl shadow-lg
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