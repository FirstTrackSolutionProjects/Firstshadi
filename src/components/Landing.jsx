import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================
//  DATA
// ============================================================
const ageOptions = Array.from({ length: 58 }, (_, i) => i + 18);

const religionOptions = [
  "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist",
  "Parsi", "Jewish", "Spiritual", "Other"
];

const motherTongueOptions = [
  "Hindi", "English", "Bengali", "Marathi", "Punjabi", "Tamil", "Telugu",
  "Gujarati", "Kannada", "Malayalam", "Odia", "Urdu", "Assamese",
  "Bhojpuri", "Haryanvi", "Rajasthani", "Other"
];

const profileForOptions = ['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend', 'My Relative'];

const testimonials = [
  {
    name: "Priya & Rahul",
    image: "/image/s1.jpg",
    text: "We found each other on First Marriage and couldn't be happier. The platform made it easy to connect with verified profiles.",
    location: "Mumbai"
  },
  {
    name: "Anjali & Vikram",
    image: "/image/s2.jpg",
    text: "The verified profiles gave us confidence to take the next step. Thank you for bringing us together.",
    location: "Delhi"
  },
  {
    name: "Sneha & Arjun",
    image: "/image/s3.jpg",
    text: "Thank you for helping us find our perfect match. The chat feature made getting to know each other so easy.",
    location: "Bangalore"
  },
  {
    name: "Meera & Karthik",
    image: "/image/s4.jpg",
    text: "From strangers to soulmates — First Marriage made our dream come true. Highly recommended.",
    location: "Chennai"
  },
];

const howItWorksSteps = [
  { step: "01", title: "Create Profile", description: "Sign up and build your detailed profile in minutes." },
  { step: "02", title: "Search & Filter", description: "Find matches using advanced filters and preferences." },
  { step: "03", title: "Connect", description: "Send requests and chat with your matches." },
  { step: "04", title: "Get Married", description: "Meet, fall in love, and begin your new journey together." },
];

const faqs = [
  { question: "How do I create a profile on First Marriage?", answer: "Click Register, fill in your basic details, verify your email and phone number, and start building your detailed profile. The process takes less than 5 minutes." },
  { question: "Are the profiles verified?", answer: "Yes. Every profile undergoes a manual verification process. We verify phone numbers, email addresses, and often government-issued IDs to ensure authenticity." },
  { question: "Is my personal information safe?", answer: "Absolutely. We use bank-grade 256-bit encryption to protect your data. Your contact details are only visible to premium members, and you have full control over your privacy settings." },
  { question: "How does the premium membership work?", answer: "Premium membership gives you access to contact details, unlimited chat, advanced filters, and priority support. Plans start from ₹199 for 7 days." },
  { question: "Can I search for profiles from specific communities?", answer: "Yes. Our advanced search allows you to filter profiles by religion, caste, community, mother tongue, education, occupation, income, location, and more." },
  { question: "What if I want to delete my profile?", answer: "You can delete your profile anytime from your account settings. All your data will be permanently removed from our servers within 24 hours." },
];

const upcomingFeatures = [
  { title: "AI Matchmaking", description: "Smart algorithms to find your perfect match." },
  { title: "Video Calls", description: "Secure video calling with your matches." },
  { title: "Horoscope Match", description: "Detailed kundli matching for compatibility." },
  { title: "Preference Boost", description: "Get your profile highlighted to more matches." },
];

// ============================================================
//  ICONS — one consistent stroke set
// ============================================================
const IconHeart = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const IconChevronDown = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const IconShield = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.746 3.746 0 0121 12z" />
  </svg>
);

const IconUsers = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const IconStar = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const IconCheck = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const IconPhone = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconChat = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

const IconLock = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const IconSparkle = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
  </svg>
);

const IconArrowRight = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const IconArrowUp = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

// ============================================================
//  REUSABLE
// ============================================================
const SelectField = ({ placeholder, value, onChange, options, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      className="w-full appearance-none bg-white border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 transition-colors pl-4 pr-10 py-3 cursor-pointer"
      value={value}
      onChange={onChange}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <IconChevronDown />
    </div>
  </div>
);

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-rose-200 transition-colors">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 text-left"
    >
      <span className="text-gray-900 font-semibold text-sm sm:text-base pr-4">{faq.question}</span>
      <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-800 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        <IconChevronDown />
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
        {faq.answer}
      </div>
    </div>
  </div>
);

// ============================================================
//  MAIN
// ============================================================
const Landing = () => {
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [motherTongue, setMotherTongue] = useState('');
  const [profileFor, setProfileFor] = useState('Myself');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const navigate = useNavigate();
  const featuresRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/sol', {
      state: {
        gender: gender || null,
        minAge: minAge || null,
        maxAge: maxAge || null,
        religion: religion || null,
        motherTongue: motherTongue || null,
        profileFor: profileFor || 'Myself',
      },
    });
  };

  const handleEmailSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setEmailSubscribed(true);
      setTimeout(() => { setEmailSubscribed(false); setEmail(''); }, 3000);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const stats = [
    { value: "35M+", label: "Verified Profiles" },
    { value: "5M+", label: "Success Stories" },
    { value: "100%", label: "Secure Platform" },
    { value: "4.9", label: "User Rating" },
  ];

  const features = [
    { icon: <IconShield className="w-6 h-6" />, title: "Verified Profiles", description: "Every profile is manually verified for authenticity and safety." },
    { icon: <IconSparkle className="w-6 h-6" />, title: "Smart Matchmaking", description: "Intelligent algorithms find matches based on your preferences." },
    { icon: <IconLock className="w-6 h-6" />, title: "Privacy First", description: "Your data is protected with bank-grade encryption." },
    { icon: <IconChat className="w-6 h-6" />, title: "Secure Chat", description: "Connect safely with end-to-end encrypted messaging." },
    { icon: <IconPhone className="w-6 h-6" />, title: "24/7 Support", description: "Our team is always here to help you find your match." },
    { icon: <IconHeart className="w-6 h-6" />, title: "Trusted by Millions", description: "Join the largest community of verified singles in India." },
  ];

  const membershipPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "Forever",
      features: ["Create Profile", "Browse Profiles", "Send 5 Requests / day", "Basic Search Filters", "Email Support"],
      highlighted: false,
      cta: "Get Started",
      route: "/register",
    },
    {
      name: "Premium",
      price: "₹599",
      period: "30 Days",
      features: ["Everything in Free", "Unlimited Requests", "Access Contact Info", "Advanced Filters", "Priority Support", "Profile Boost"],
      highlighted: true,
      cta: "Go Premium",
      route: "/memb",
    },
    {
      name: "Elite",
      price: "₹4,499",
      period: "1 Year",
      features: ["Everything in Premium", "Dedicated Matchmaker", "Video Call Access", "Horoscope Matching", "Verified Badge", "Top Priority Support"],
      highlighted: false,
      cta: "Join Elite",
      route: "/memb",
    },
  ];

  return (
    <div className="w-full bg-white">

      {/* ==================== HERO ==================== */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#2b0a12]">

        {/* Background image + overlays */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/image/m1.png')" }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3b0a18]/70 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">

          {/* Trust ribbon */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5">
              <IconShield className="w-4 h-4 text-amber-300" />
              <span className="text-[13px] font-medium tracking-wide text-white/90">
                India's Most Trusted Matrimony Service
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center font-display leading-[1.05] tracking-tight">
            <span className="block text-white text-4xl sm:text-5xl md:text-6xl font-bold">
              Find Your
            </span>
            <span className="block mt-1 text-[#e0b46a] text-4xl sm:text-5xl md:text-6xl font-bold italic">
              Perfect Life Partner
            </span>
          </h1>

          <p className="mt-6 text-center text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Trusted by millions of Indian families. Verified profiles, secure conversations, and meaningful matches — all in one place.
          </p>

          {/* Search card */}
          <form
            onSubmit={handleSearch}
            className="mt-10 w-full bg-white rounded-xl shadow-2xl ring-1 ring-black/5 p-5 sm:p-6"
          >
            {/* Profile-for segmented control */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2">
                Profile for
              </span>
              <div className="inline-flex flex-wrap rounded-lg border border-gray-200 overflow-hidden">
                {profileForOptions.slice(0, 5).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setProfileFor(opt)}
                    className={`px-3.5 py-2 text-[13px] font-medium transition-colors border-r border-gray-200 last:border-r-0 ${
                      profileFor === opt
                        ? 'bg-rose-800 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Looking for
                </label>
                <SelectField
                  placeholder="Select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={['Woman', 'Man']}
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Age from
                </label>
                <SelectField
                  placeholder="From"
                  value={minAge}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setMinAge(v);
                    if (maxAge && v > maxAge) setMaxAge(v);
                  }}
                  options={ageOptions}
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Age to
                </label>
                <SelectField
                  placeholder="To"
                  value={maxAge}
                  onChange={(e) => setMaxAge(parseInt(e.target.value))}
                  options={ageOptions.filter((age) => age >= (minAge || 18))}
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Religion
                </label>
                <SelectField
                  placeholder="Any"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  options={religionOptions}
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                  Mother tongue
                </label>
                <SelectField
                  placeholder="Any"
                  value={motherTongue}
                  onChange={(e) => setMotherTongue(e.target.value)}
                  options={motherTongueOptions}
                />
              </div>

              <div className="lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-sm py-3 px-5 rounded-lg transition-colors"
                >
                  <IconSearch className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            {/* Popular tags */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-500 mr-1">Popular:</span>
              {['Hindu', 'Muslim', 'Christian', 'Punjabi', 'Tamil'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setReligion(tag)}
                  className="text-xs font-medium text-gray-600 hover:text-rose-800 border border-gray-200 hover:border-rose-200 rounded-full px-3 py-1 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-y-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="px-4 border-r border-white/10 last:border-r-0">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-white/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={scrollToFeatures}
              className="text-white/40 hover:text-white/80 transition-colors"
              aria-label="Scroll down"
            >
              <IconChevronDown className="w-7 h-7 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section ref={featuresRef} className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold tracking-wider uppercase mb-4">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              A Platform Built on <span className="italic text-rose-800">Trust</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a safe, secure, and trusted platform to help you find your perfect life partner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-200 hover:border-rose-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-rose-100"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-800 mb-4 group-hover:bg-rose-800 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 px-4 bg-[#faf7f5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold tracking-wider uppercase mb-4">
              Simple Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="italic text-rose-800">Works</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your journey to finding your soulmate in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-rose-800 flex items-center justify-center font-display text-white text-xl font-bold mb-4 shadow-lg shadow-rose-200">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold tracking-wider uppercase mb-4">
              Success Stories
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Real Couples, Real <span className="italic text-rose-800">Journeys</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from real couples who found love on First Marriage.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-[#faf7f5] border border-gray-200 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-lg"
                    onError={(e) => { e.target.src = 'https://placehold.co/200x200/9f1239/ffffff?text=%E2%9D%A4'; }}
                  />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} className="w-5 h-5 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic font-display">
                    “{testimonials[currentTestimonial].text}”
                  </p>
                  <div>
                    <p className="text-gray-900 font-bold text-lg">{testimonials[currentTestimonial].name}</p>
                    <p className="text-rose-800 text-sm">{testimonials[currentTestimonial].location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-rose-800 hover:text-rose-800 flex items-center justify-center text-gray-600 transition-colors"
                aria-label="Previous testimonial"
              >
                <IconChevronLeft />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentTestimonial ? 'w-8 bg-rose-800' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-rose-800 hover:text-rose-800 flex items-center justify-center text-gray-600 transition-colors"
                aria-label="Next testimonial"
              >
                <IconChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MEMBERSHIP ==================== */}
      <section className="py-20 px-4 bg-[#faf7f5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold tracking-wider uppercase mb-4">
              Membership
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span className="italic text-rose-800">Plan</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Flexible plans to suit every need. Upgrade anytime to unlock premium features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {membershipPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-rose-800 text-white shadow-2xl shadow-rose-200 md:scale-105'
                    : 'bg-white border border-gray-200 hover:border-rose-200 hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-rose-900 text-[11px] font-bold tracking-wider uppercase rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`font-display text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={plan.highlighted ? 'text-white/70' : 'text-gray-500'}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        plan.highlighted ? 'bg-white/20' : 'bg-rose-50'
                      }`}>
                        <IconCheck className={`w-4 h-4 ${plan.highlighted ? 'text-white' : 'text-rose-800'}`} />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(plan.route)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-white text-rose-800 hover:bg-gray-100'
                      : 'bg-rose-800 text-white hover:bg-rose-900'
                  }`}
                >
                  {plan.cta}
                  <IconArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== UPCOMING ==================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold tracking-wider uppercase mb-4">
              Coming Soon
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Exciting <span className="italic text-rose-800">Updates</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're constantly improving to make your matchmaking journey even better.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-[#faf7f5] border border-gray-200 hover:border-rose-200 rounded-2xl p-6 text-center transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-20 px-4 bg-[#faf7f5]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold tracking-wider uppercase mb-4">
              Got Questions?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="italic text-rose-800">Questions</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about First Marriage.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-800 hover:bg-rose-900 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Support
              <IconArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 px-4 bg-[#2b0a12] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(159,18,57,0.4)_0%,transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-800 mb-6">
            <IconHeart className="w-8 h-8 text-white" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Start Your <span className="italic text-[#e0b46a]">Love Story</span> Today
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg">
            Join millions of happy couples who found their perfect match. Your soulmate might be one click away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-7 py-3.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <IconSparkle />
              Register Free
              <IconArrowRight />
            </button>
            <button
              onClick={() => navigate('/memb')}
              className="w-full sm:w-auto px-7 py-3.5 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors"
            >
              View Premium Plans
            </button>
          </div>

          {/* Newsletter */}
          <div className="max-w-md mx-auto">
            <p className="text-white/70 text-sm mb-3">Subscribe for matchmaking tips and success stories</p>
            {emailSubscribed ? (
              <div className="bg-white/10 border border-white/20 rounded-lg px-6 py-3.5 flex items-center justify-center gap-2 text-white">
                <IconCheck className="w-5 h-5 text-amber-300" />
                <span className="font-medium">Thanks for subscribing.</span>
              </div>
            ) : (
              <form onSubmit={handleEmailSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-300 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-rose-900 font-semibold rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ==================== TRUST ==================== */}
      <section className="py-14 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-800 mb-3">
                <IconShield />
              </div>
              <p className="text-gray-900 font-semibold text-sm">SSL Secured</p>
              <p className="text-gray-500 text-xs mt-0.5">256-bit encryption</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-800 mb-3">
                <IconCheck />
              </div>
              <p className="text-gray-900 font-semibold text-sm">Verified Users</p>
              <p className="text-gray-500 text-xs mt-0.5">100% authentic profiles</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-800 mb-3">
                <IconLock />
              </div>
              <p className="text-gray-900 font-semibold text-sm">Privacy Protected</p>
              <p className="text-gray-500 text-xs mt-0.5">Your data is safe</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-800 mb-3">
                <IconStar />
              </div>
              <p className="text-gray-900 font-semibold text-sm">Award Winning</p>
              <p className="text-gray-500 text-xs mt-0.5">Best matrimony 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCROLL TO TOP ==================== */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-rose-800 hover:bg-rose-900 text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Scroll to top"
        >
          <IconArrowUp />
        </button>
      )}
    </div>
  );
};

export default Landing;




// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// // --- Data Constants ---
// const ageOptions = Array.from({ length: 58 }, (_, i) => i + 18);

// const religionOptions = [
//   "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Parsi", "Jewish", "Spiritual", "Other"
// ];

// const motherTongueOptions = [
//   "Hindi", "English", "Bengali", "Marathi", "Punjabi", "Tamil", "Telugu", "Gujarati",
//   "Kannada", "Malayalam", "Odia", "Urdu", "Assamese", "Bhojpuri", "Haryanvi", "Rajasthani", "Other"
// ];

// const profileForOptions = ['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend', 'My Relative'];

// const testimonials = [
//   {
//     name: "Priya & Rahul",
//     image: "/image/s1.jpg",
//     text: "We found each other on First Marriage and couldn't be happier! The platform made it so easy to connect with verified profiles.",
//     location: "Mumbai"
//   },
//   {
//     name: "Anjali & Vikram",
//     image: "/image/s2.jpg",
//     text: "The verified profiles gave us confidence to take the next step. Thank you for bringing us together!",
//     location: "Delhi"
//   },
//   {
//     name: "Sneha & Arjun",
//     image: "/image/s3.jpg",
//     text: "Thank you for helping us find our perfect match! The chat feature made getting to know each other so easy.",
//     location: "Bangalore"
//   },
//   {
//     name: "Meera & Karthik",
//     image: "/image/s4.jpg",
//     text: "From strangers to soulmates - First Marriage made our dream come true. Highly recommended!",
//     location: "Chennai"
//   },
// ];

// const howItWorksSteps = [
//   { step: "01", title: "Create Profile", description: "Sign up and build your detailed profile in minutes", icon: "📝" },
//   { step: "02", title: "Search & Filter", description: "Find matches using advanced filters and preferences", icon: "🔍" },
//   { step: "03", title: "Connect", description: "Send requests and chat with your matches", icon: "💬" },
//   { step: "04", title: "Get Married", description: "Meet, fall in love, and start your new journey together", icon: "💍" },
// ];

// const faqs = [
//   {
//     question: "How do I create a profile on First Marriage?",
//     answer: "Simply click on the 'Register' button, fill in your basic details, verify your email and phone number, and start building your detailed profile. The process takes less than 5 minutes."
//   },
//   {
//     question: "Are the profiles verified?",
//     answer: "Yes! Every profile on our platform undergoes a manual verification process. We verify phone numbers, email addresses, and often government-issued IDs to ensure authenticity."
//   },
//   {
//     question: "Is my personal information safe?",
//     answer: "Absolutely. We use bank-grade 256-bit encryption to protect your data. Your contact details are only visible to premium members, and you have full control over your privacy settings."
//   },
//   {
//     question: "How does the premium membership work?",
//     answer: "Premium membership gives you access to contact details, unlimited chat, advanced filters, and priority support. Plans start from just ₹199 for 7 days."
//   },
//   {
//     question: "Can I search for profiles from specific communities?",
//     answer: "Yes, our advanced search allows you to filter profiles by religion, caste, community, mother tongue, education, occupation, income, location, and much more."
//   },
//   {
//     question: "What if I want to delete my profile?",
//     answer: "You can delete your profile anytime from your account settings. All your data will be permanently removed from our servers within 24 hours."
//   },
// ];

// const partnerLogos = [
//   { name: "Google", icon: "🌐" },
//   { name: "Microsoft", icon: "🪟" },
//   { name: "Amazon", icon: "📦" },
//   { name: "Flipkart", icon: "🛒" },
//   { name: "Paytm", icon: "💰" },
//   { name: "PhonePe", icon: "📱" },
// ];

// const upcomingFeatures = [
//   { icon: "🤖", title: "AI Matchmaking", description: "Smart algorithms to find your perfect match" },
//   { icon: "📹", title: "Video Calls", description: "Secure video calling with your matches" },
//   { icon: "🌟", title: "Horoscope Match", description: "Detailed kundli matching for compatibility" },
//   { icon: "🎯", title: "Preference Boost", description: "Get your profile highlighted to more matches" },
// ];

// // --- Icons ---
// const HeartIcon = ({ className = "w-5 h-5" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.185 15.185 0 01-2.025-1.222c-.713-.577-1.36-1.18-1.92-1.815a11.14 11.14 0 01-2.427-4.22c-.157-.525-.26-1.07-.323-1.638C3.23 10.993 3 10.027 3 9.049c0-2.41 1.745-4.376 4.088-4.908A5.492 5.492 0 0112 5.169a5.492 5.492 0 014.912-1.026C19.255 4.673 21 6.639 21 9.049c0 .978-.23 1.944-.674 2.827-.063.568-.166 1.113-.323 1.638a11.14 11.14 0 01-2.427 4.22c-.56.635-1.207 1.238-1.92 1.815a15.185 15.185 0 01-2.025 1.222 15.247 15.247 0 01-1.383-.597l-.022.012-.007.003z" />
//   </svg>
// );

// const SearchIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//   </svg>
// );

// const UserGroupIcon = ({ className = "w-6 h-6" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
//   </svg>
// );

// const ShieldCheckIcon = ({ className = "w-6 h-6" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
//   </svg>
// );

// const SparklesIcon = ({ className = "w-5 h-5" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
//   </svg>
// );

// const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//   </svg>
// );

// const ChevronLeftIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//   </svg>
// );

// const ChevronRightIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//   </svg>
// );

// const StarIcon = ({ className = "w-5 h-5" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
//   </svg>
// );

// const CheckIcon = ({ className = "w-5 h-5" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
//   </svg>
// );

// const PhoneIcon = ({ className = "w-6 h-6" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
//   </svg>
// );

// const ChatIcon = ({ className = "w-6 h-6" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
//   </svg>
// );

// const LockIcon = ({ className = "w-6 h-6" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
//   </svg>
// );

// const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
//   </svg>
// );

// const ArrowUpIcon = ({ className = "w-5 h-5" }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
//   </svg>
// );

// // --- Select Field Component ---
// const SelectField = ({ placeholder, value, onChange, options, className = "", icon }) => (
//   <div className={`relative ${className}`}>
//     {icon && (
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 z-10 pointer-events-none">
//         {icon}
//       </div>
//     )}
//     <select
//       className={`w-full appearance-none bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-rose-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${icon ? 'pl-11' : 'pl-4'} pr-10 py-3.5`}
//       value={value}
//       onChange={onChange}
//     >
//       <option value="" disabled>{placeholder}</option>
//       {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//     </select>
//     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400">
//       <ChevronDownIcon />
//     </div>
//   </div>
// );

// // --- FAQ Item Component ---
// const FAQItem = ({ faq, isOpen, onToggle }) => (
//   <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
//     <button
//       onClick={onToggle}
//       className="w-full flex items-center justify-between p-5 text-left"
//     >
//       <span className="text-white font-semibold text-sm sm:text-base pr-4">{faq.question}</span>
//       <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
//         <ChevronDownIcon />
//       </div>
//     </button>
//     <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
//       <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
//         {faq.answer}
//       </div>
//     </div>
//   </div>
// );

// // --- Main Component ---
// const Landing = () => {
//   const [minAge, setMinAge] = useState('');
//   const [maxAge, setMaxAge] = useState('');
//   const [gender, setGender] = useState('');
//   const [religion, setReligion] = useState('');
//   const [motherTongue, setMotherTongue] = useState('');
//   const [profileFor, setProfileFor] = useState('Myself');
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);
//   const [openFAQ, setOpenFAQ] = useState(null);
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const [email, setEmail] = useState('');
//   const [emailSubscribed, setEmailSubscribed] = useState(false);
//   const navigate = useNavigate();
//   const featuresRef = useRef(null);

//   // Auto-rotate testimonials
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // Show/hide scroll to top button
//   useEffect(() => {
//     const handleScroll = () => setShowScrollTop(window.scrollY > 500);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     navigate('/sol', {
//       state: {
//         gender: gender || null,
//         minAge: minAge || null,
//         maxAge: maxAge || null,
//         religion: religion || null,
//         motherTongue: motherTongue || null,
//         profileFor: profileFor || 'Myself'
//       }
//     });
//   };

//   const handleEmailSubscribe = (e) => {
//     e.preventDefault();
//     if (email) {
//       setEmailSubscribed(true);
//       setTimeout(() => {
//         setEmailSubscribed(false);
//         setEmail('');
//       }, 3000);
//     }
//   };

//   const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
//   const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' });

//   const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
//   const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

//   // Stats
//   const stats = [
//     { icon: <UserGroupIcon className="w-6 h-6" />, value: "35M+", label: "Happy Members" },
//     { icon: <HeartIcon className="w-6 h-6" />, value: "5M+", label: "Success Stories" },
//     { icon: <ShieldCheckIcon className="w-6 h-6" />, value: "100%", label: "Verified Profiles" },
//     { icon: <StarIcon className="w-5 h-5" />, value: "4.9", label: "User Rating" },
//   ];

//   // Features
//   const features = [
//     { icon: <ShieldCheckIcon />, title: "Verified Profiles", description: "Every profile is manually verified for authenticity and safety.", color: "from-blue-500 to-cyan-500" },
//     { icon: <SparklesIcon className="w-6 h-6" />, title: "AI Matchmaking", description: "Smart algorithms find matches based on your preferences.", color: "from-purple-500 to-pink-500" },
//     { icon: <LockIcon />, title: "Privacy First", description: "Your data is protected with bank-grade encryption.", color: "from-green-500 to-emerald-500" },
//     { icon: <ChatIcon />, title: "Secure Chat", description: "Connect safely with end-to-end encrypted messaging.", color: "from-orange-500 to-red-500" },
//     { icon: <PhoneIcon />, title: "24/7 Support", description: "Our team is always here to help you find your match.", color: "from-indigo-500 to-blue-500" },
//     { icon: <HeartIcon className="w-6 h-6" />, title: "Trusted by Millions", description: "Join the largest community of verified singles in India.", color: "from-rose-500 to-pink-500" },
//   ];

//   // Membership Plans
//   const membershipPlans = [
//     {
//       name: "Free",
//       price: "₹0",
//       period: "Forever",
//       features: [
//         "Create Profile",
//         "Browse Profiles",
//         "Send 5 Requests/day",
//         "Basic Search Filters",
//         "Email Support"
//       ],
//       highlighted: false,
//       cta: "Get Started",
//       route: "/register"
//     },
//     {
//       name: "Premium",
//       price: "₹599",
//       period: "30 Days",
//       features: [
//         "Everything in Free",
//         "Unlimited Requests",
//         "Access Contact Info",
//         "Advanced Filters",
//         "Priority Support",
//         "Profile Boost"
//       ],
//       highlighted: true,
//       cta: "Go Premium",
//       route: "/memb"
//     },
//     {
//       name: "Elite",
//       price: "₹4,499",
//       period: "1 Year",
//       features: [
//         "Everything in Premium",
//         "Dedicated Matchmaker",
//         "Video Call Access",
//         "Horoscope Matching",
//         "Verified Badge",
//         "Top Priority Support"
//       ],
//       highlighted: false,
//       cta: "Join Elite",
//       route: "/memb"
//     },
//   ];

//   return (
//     <div className="relative w-full min-h-screen overflow-x-hidden bg-slate-900">
      
//       {/* ==================== HERO SECTION ==================== */}
//       <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
//           style={{ backgroundImage: "url('/image/m1.png')" }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-rose-900/80"></div>
//         </div>

//         {/* Animated Background */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl"></div>
//         </div>

//         {/* Floating Hearts */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute text-rose-400/20 animate-float"
//               style={{
//                 left: `${10 + i * 12}%`,
//                 top: `${15 + (i % 4) * 20}%`,
//                 animationDelay: `${i * 0.5}s`,
//                 animationDuration: `${4 + i}s`
//               }}
//             >
//               <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//               </svg>
//             </div>
//           ))}
//         </div>

//         <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto text-center px-4 py-12">
          
//           {/* Badge */}
//           <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm text-amber-300 font-medium animate-fadeIn">
//             <SparklesIcon />
//             <span>India's Most Trusted Matrimony Service</span>
//           </div>

//           {/* Heading */}
//           <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 animate-fadeInUp">
//             <span className="text-white">Find Your</span>
//             <br />
//             <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
//               Perfect Partner
//             </span>
//           </h1>

//           <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed animate-fadeInUp">
//             Begin your journey to find the one. Join millions of verified profiles
//             and discover meaningful connections that last a lifetime.
//           </p>

//           {/* Search Form */}
//           <form
//             className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl mb-12 animate-fadeInUp"
//             onSubmit={handleSearch}
//           >
//             {/* Profile For Tabs */}
//             <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
//               {profileForOptions.slice(0, 5).map((opt) => (
//                 <button
//                   key={opt}
//                   type="button"
//                   onClick={() => setProfileFor(opt)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                     profileFor === opt
//                       ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30'
//                       : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
//                   }`}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>

//             <div className="flex items-center justify-center gap-2 mb-6 text-white/80">
//               <SearchIcon />
//               <span className="text-sm font-medium tracking-wide uppercase">Search Your Match</span>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
//               <SelectField
//                 className="sm:col-span-2 lg:col-span-1"
//                 placeholder="I'm looking for..."
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//                 options={['Woman', 'Man']}
//                 icon={<HeartIcon />}
//               />

//               <div className="sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-3">
//                 <div className="relative">
//                   <select
//                     className="w-full appearance-none bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-rose-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md pl-4 pr-8 py-3.5"
//                     value={minAge}
//                     onChange={(e) => {
//                       const newMin = parseInt(e.target.value);
//                       setMinAge(newMin);
//                       if (newMin > maxAge) setMaxAge(newMin);
//                     }}
//                   >
//                     <option value="" disabled>From</option>
//                     {ageOptions.map((age) => <option key={`min-${age}`} value={age}>{age}</option>)}
//                   </select>
//                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400">
//                     <ChevronDownIcon className="w-3.5 h-3.5" />
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <select
//                     className="w-full appearance-none bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-rose-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md pl-4 pr-8 py-3.5"
//                     value={maxAge}
//                     onChange={(e) => setMaxAge(parseInt(e.target.value))}
//                   >
//                     <option value="" disabled>To</option>
//                     {ageOptions.filter((age) => age >= (minAge || 18)).map((age) => <option key={`max-${age}`} value={age}>{age}</option>)}
//                   </select>
//                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400">
//                     <ChevronDownIcon className="w-3.5 h-3.5" />
//                   </div>
//                 </div>
//               </div>

//               <SelectField
//                 placeholder="Religion"
//                 value={religion}
//                 onChange={(e) => setReligion(e.target.value)}
//                 options={religionOptions}
//               />

//               <SelectField
//                 placeholder="Mother Tongue"
//                 value={motherTongue}
//                 onChange={(e) => setMotherTongue(e.target.value)}
//                 options={motherTongueOptions}
//               />

//               <button
//                 type="submit"
//                 className="sm:col-span-2 lg:col-span-1 w-full group relative overflow-hidden text-lg font-bold text-white py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:shadow-rose-500/50 hover:-translate-y-0.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
//               >
//                 <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
//                 <HeartIcon />
//                 <span>Find Match</span>
//               </button>
//             </div>

//             {/* Popular Searches */}
//             <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 text-sm">
//               <span className="text-white/50 mr-1">Popular:</span>
//               {['Hindu', 'Muslim', 'Christian', 'Punjabi', 'Tamil'].map((tag) => (
//                 <button
//                   key={tag}
//                   type="button"
//                   onClick={() => setReligion(tag)}
//                   className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium transition-colors border border-white/10"
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </form>

//           {/* Stats */}
//           <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-6">
//             {stats.map((stat, index) => (
//               <div key={index} className="flex flex-col items-center text-center group">
//                 <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rose-500/20 to-amber-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-rose-300 mb-2 group-hover:scale-110 group-hover:text-amber-300 transition-all duration-300">
//                   {stat.icon}
//                 </div>
//                 <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
//                 <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* Scroll to Features */}
//           <button
//             onClick={scrollToFeatures}
//             className="mt-12 text-white/50 hover:text-white transition-colors animate-bounce"
//             aria-label="Scroll down"
//           >
//             <ChevronDownIcon className="w-8 h-8" />
//           </button>
//         </div>
//       </section>

//       {/* ==================== FEATURES SECTION ==================== */}
//       <section ref={featuresRef} className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <span className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold tracking-wider uppercase mb-4">
//               Why Choose Us
//             </span>
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
//               Features That Make Us <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">Different</span>
//             </h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               We provide a safe, secure, and trusted platform to help you find your perfect life partner
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
//               >
//                 <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
//                 <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ==================== HOW IT WORKS ==================== */}
//       <section className="relative py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
//               Simple Process
//             </span>
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
//               How It <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Works</span>
//             </h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               Your journey to finding your soulmate in just 4 simple steps
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
//             {howItWorksSteps.map((step, index) => (
//               <div key={index} className="relative flex flex-col items-center text-center group">
//                 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-3xl mb-5 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
//                   {step.icon}
//                 </div>
//                 <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-slate-900 border-2 border-rose-500/30 flex items-center justify-center text-amber-400 font-bold text-sm z-20">
//                   {step.step}
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
//                 <p className="text-gray-400 text-sm">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ==================== TESTIMONIALS SECTION ==================== */}
//       <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold tracking-wider uppercase mb-4">
//               Success Stories
//             </span>
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
//               Happy <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Couples</span>
//             </h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               Real stories from real couples who found love on First Marriage
//             </p>
//           </div>

//           <div className="relative max-w-4xl mx-auto">
//             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
//               <div className="flex flex-col md:flex-row items-center gap-8">
//                 <div className="flex-shrink-0">
//                   <img
//                     src={testimonials[currentTestimonial].image}
//                     alt={testimonials[currentTestimonial].name}
//                     className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-rose-500/30 shadow-2xl"
//                     onError={(e) => {
//                       e.target.src = 'https://placehold.co/200x200/f43f5e/ffffff?text=❤';
//                     }}
//                   />
//                 </div>
//                 <div className="flex-grow text-center md:text-left">
//                   <div className="flex justify-center md:justify-start gap-1 mb-4">
//                     {[...Array(5)].map((_, i) => (
//                       <StarIcon key={i} className="w-5 h-5 text-amber-400" />
//                     ))}
//                   </div>
//                   <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
//                     "{testimonials[currentTestimonial].text}"
//                   </p>
//                   <div>
//                     <p className="text-white font-bold text-xl">{testimonials[currentTestimonial].name}</p>
//                     <p className="text-rose-400 text-sm">{testimonials[currentTestimonial].location}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <div className="flex justify-center gap-4 mt-8">
//               <button
//                 onClick={prevTestimonial}
//                 className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
//                 aria-label="Previous testimonial"
//               >
//                 <ChevronLeftIcon />
//               </button>

//               <div className="flex items-center gap-2">
//                 {testimonials.map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentTestimonial(i)}
//                     className={`h-2 rounded-full transition-all duration-300 ${
//                       i === currentTestimonial ? 'w-8 bg-rose-500' : 'w-2 bg-white/30 hover:bg-white/50'
//                     }`}
//                     aria-label={`Go to testimonial ${i + 1}`}
//                   />
//                 ))}
//               </div>

//               <button
//                 onClick={nextTestimonial}
//                 className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
//                 aria-label="Next testimonial"
//               >
//                 <ChevronRightIcon />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== MEMBERSHIP PLANS ==================== */}
//       <section className="relative py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold tracking-wider uppercase mb-4">
//               Membership
//             </span>
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
//               Choose Your <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">Plan</span>
//             </h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               Flexible plans to suit every need. Upgrade anytime to unlock premium features.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
//             {membershipPlans.map((plan, index) => (
//               <div
//                 key={index}
//                 className={`relative rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 ${
//                   plan.highlighted
//                     ? 'bg-gradient-to-br from-rose-600 to-pink-700 shadow-2xl shadow-rose-500/30 border-2 border-rose-400/50 md:scale-105'
//                     : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10'
//                 }`}
//               >
//                 {plan.highlighted && (
//                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-slate-900 text-xs font-bold tracking-wider uppercase shadow-lg">
//                     ⭐ Most Popular
//                   </div>
//                 )}

//                 <div className="text-center mb-6">
//                   <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-white'}`}>
//                     {plan.name}
//                   </h3>
//                   <div className="flex items-baseline justify-center gap-1">
//                     <span className={`text-5xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-white'}`}>
//                       {plan.price}
//                     </span>
//                     <span className={plan.highlighted ? 'text-white/70' : 'text-gray-400'}>
//                       /{plan.period}
//                     </span>
//                   </div>
//                 </div>

//                 <ul className="space-y-3 mb-8">
//                   {plan.features.map((feature, i) => (
//                     <li key={i} className="flex items-start gap-3">
//                       <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
//                         plan.highlighted ? 'bg-white/20' : 'bg-rose-500/20'
//                       }`}>
//                         <CheckIcon className={`w-4 h-4 ${plan.highlighted ? 'text-white' : 'text-rose-400'}`} />
//                       </div>
//                       <span className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-gray-300'}`}>
//                         {feature}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>

//                 <button
//                   onClick={() => navigate(plan.route)}
//                   className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
//                     plan.highlighted
//                       ? 'bg-white text-rose-600 hover:bg-gray-100 shadow-lg'
//                       : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg hover:shadow-rose-500/30'
//                   }`}
//                 >
//                   {plan.cta}
//                   <ArrowRightIcon className="w-4 h-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ==================== UPCOMING FEATURES ==================== */}
//       <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-4">
//               Coming Soon
//             </span>
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
//               Exciting <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Updates</span>
//             </h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               We're constantly improving to make your matchmaking journey even better
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {upcomingFeatures.map((feature, index) => (
//               <div
//                 key={index}
//                 className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-2"
//               >
//                 <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
//                 <p className="text-gray-400 text-sm">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ==================== FAQ SECTION ==================== */}
//       <section className="relative py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-14">
//             <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-4">
//               Got Questions?
//             </span>
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
//               Frequently Asked <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Questions</span>
//             </h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               Everything you need to know about First Marriage
//             </p>
//           </div>

//           <div className="space-y-3">
//             {faqs.map((faq, index) => (
//               <FAQItem
//                 key={index}
//                 faq={faq}
//                 isOpen={openFAQ === index}
//                 onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
//               />
//             ))}
//           </div>

//           <div className="text-center mt-10">
//             <p className="text-gray-400 mb-4">Still have questions?</p>
//             <button
//               onClick={() => navigate('/contact')}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300 hover:-translate-y-0.5"
//             >
//               Contact Support
//               <ArrowRightIcon className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ==================== NEWSLETTER CTA ==================== */}
//       <section className="relative py-20 px-4 bg-gradient-to-br from-rose-900 via-slate-900 to-purple-900 overflow-hidden">
//         {/* Background decoration */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
//           <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
//         </div>

//         <div className="relative max-w-4xl mx-auto text-center">
//           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 mb-6 shadow-2xl shadow-rose-500/50">
//             <HeartIcon className="w-10 h-10 text-white" />
//           </div>

//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
//             Start Your <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">Love Story</span> Today
//           </h2>
//           <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
//             Join millions of happy couples who found their perfect match. Your soulmate might be just one click away!
//           </p>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
//             <button
//               onClick={() => navigate('/register')}
//               className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
//             >
//               <SparklesIcon />
//               Register Free Now
//               <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             </button>
//             <button
//               onClick={() => navigate('/memb')}
//               className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
//             >
//               View Premium Plans
//             </button>
//           </div>

//           {/* Email Subscription */}
//           <div className="max-w-md mx-auto">
//             <p className="text-white/80 text-sm mb-3 font-medium">
//               📧 Subscribe for matchmaking tips & success stories
//             </p>
//             {emailSubscribed ? (
//               <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-6 py-4 flex items-center justify-center gap-2 text-green-400 font-semibold">
//                 <CheckIcon />
//                 <span>Thanks for subscribing!</span>
//               </div>
//             ) : (
//               <form onSubmit={handleEmailSubscribe} className="flex gap-2">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   required
//                   className="flex-1 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
//                 />
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
//                 >
//                   Subscribe
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ==================== TRUST BADGES SECTION ==================== */}
//       <section className="relative py-12 px-4 bg-slate-900 border-t border-white/5">
//         <div className="max-w-6xl mx-auto">
//           <p className="text-center text-gray-500 text-sm mb-8 font-medium uppercase tracking-wider">
//             Trusted by leading organizations
//           </p>
//           <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
//             {partnerLogos.map((partner, index) => (
//               <div
//                 key={index}
//                 className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors duration-300 group"
//               >
//                 <span className="text-3xl group-hover:scale-110 transition-transform">{partner.icon}</span>
//                 <span className="text-lg font-semibold">{partner.name}</span>
//               </div>
//             ))}
//           </div>

//           {/* Trust Indicators */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/5">
//             <div className="text-center">
//               <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-400 mb-3">
//                 <ShieldCheckIcon />
//               </div>
//               <p className="text-white font-bold text-sm">SSL Secured</p>
//               <p className="text-gray-500 text-xs">256-bit encryption</p>
//             </div>
//             <div className="text-center">
//               <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 mb-3">
//                 <CheckIcon />
//               </div>
//               <p className="text-white font-bold text-sm">Verified Users</p>
//               <p className="text-gray-500 text-xs">100% authentic profiles</p>
//             </div>
//             <div className="text-center">
//               <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 mb-3">
//                 <LockIcon />
//               </div>
//               <p className="text-white font-bold text-sm">Privacy Protected</p>
//               <p className="text-gray-500 text-xs">Your data is safe</p>
//             </div>
//             <div className="text-center">
//               <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-amber-400 mb-3">
//                 <StarIcon />
//               </div>
//               <p className="text-white font-bold text-sm">Award Winning</p>
//               <p className="text-gray-500 text-xs">Best matrimony 2024</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================== SCROLL TO TOP BUTTON ==================== */}
//       {showScrollTop && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-2xl shadow-rose-500/50 hover:scale-110 transition-transform duration-300 animate-fadeIn"
//           aria-label="Scroll to top"
//         >
//           <ArrowUpIcon />
//         </button>
//       )}

//       {/* ==================== CUSTOM ANIMATIONS ==================== */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
//           50% { transform: translateY(-30px) rotate(10deg); opacity: 0.4; }
//         }
//         @keyframes scroll {
//           0% { transform: translateY(0); opacity: 1; }
//           100% { transform: translateY(12px); opacity: 0; }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-float {
//           animation: float 5s ease-in-out infinite;
//         }
//         .animate-scroll {
//           animation: scroll 1.5s ease-in-out infinite;
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-out;
//         }
//         .animate-fadeInUp {
//           animation: fadeInUp 0.8s ease-out both;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Landing;
