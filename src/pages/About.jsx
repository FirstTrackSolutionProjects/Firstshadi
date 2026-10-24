import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const IconTarget = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
  </svg>
);

const IconEye = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconShield = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconLock = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const IconSupport = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconArrow = () => (
  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const Diamond = () => (
  <div className="flex items-center justify-center gap-3">
    <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#e0b46a]" />
    <span className="h-1.5 w-1.5 rotate-45 bg-[#e0b46a]" />
    <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#e0b46a]" />
  </div>
);

const stats = [
  { value: '35M+', label: 'Verified Profiles' },
  { value: '5M+', label: 'Success Stories' },
  { value: '100%', label: 'Secure Platform' },
  { value: '4.9', label: 'User Rating' },
];

const highlights = [
  { icon: <IconShield />, title: 'Verified Profiles', text: 'Every profile is manually checked.' },
  { icon: <IconLock />, title: 'Secure Platform', text: 'Your data stays private and safe.' },
  { icon: <IconSupport />, title: 'Dedicated Support', text: 'Help at every step of the way.' },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-[#faf7f5]">
        {/* ==================== HERO ==================== */}
        <section className="relative overflow-hidden">
          <img
            src="/image/s9.jpg"
            alt="Teamwork"
            className="h-[380px] w-full object-cover sm:h-[460px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#3b0a18]/70 via-black/55 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md">
              <svg className="h-3 w-3 text-[#e0b46a]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Our Story
            </span>
            <h1 className="font-display text-4xl font-bold text-white drop-shadow-lg sm:text-5xl md:text-6xl">
              About <span className="italic text-[#f3d79e]">Us</span>
            </h1>
            <div className="mt-5">
              <Diamond />
            </div>
            <p className="mt-5 text-base text-white/85 sm:text-lg">Delivering Excellence in wedding</p>
          </div>
        </section>

        {/* ==================== MISSION + VISION ==================== */}
        <section className="relative overflow-hidden px-4 py-20">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e0b46a]/15 blur-3xl" />

          <div className="relative mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {[
              {
                icon: <IconTarget />,
                title: 'Our Mission',
                text: 'To revolutionize the matchmaking experience by connecting individuals and families through innovative technology and heartfelt service.First Marriage, we ensure transparency, trust, and compatibility in every match — helping you find your perfect life partner with confidence.',
              },
              {
                icon: <IconEye />,
                title: 'Our Vision',
                text: 'To be the leading matrimonial platform, empowering individuals and families with a seamless, meaningful, and culturally respectful matchmaking experience — making the journey to marriage joyful, trusted, and memorable.',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800 transition-transform duration-500 group-hover:scale-x-100" />
                <span className="absolute right-6 top-3 select-none font-display text-6xl font-bold text-gray-100 transition-colors duration-500 group-hover:text-rose-100">
                  0{i + 1}
                </span>
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-rose-100/0 blur-2xl transition-all duration-500 group-hover:bg-rose-100/80" />

                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 ring-1 ring-rose-100 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:from-rose-800 group-hover:to-rose-900 group-hover:text-white">
                    {card.icon}
                  </div>
                  <h2 className="font-display text-2xl font-bold text-gray-900">
                    {card.title.split(' ')[0]} <span className="italic text-rose-800">{card.title.split(' ')[1]}</span>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== WHY CHOOSE US ==================== */}
        <section className="px-4 pb-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-rose-800 via-rose-800 to-rose-900 px-6 py-14 text-center shadow-2xl shadow-rose-200 ring-1 ring-[#e0b46a]/50 sm:px-12">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-[#e0b46a] to-rose-800" />
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#e0b46a]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Why Choose <span className="italic text-[#f3d79e]">Us?</span>
              </h2>
              <div className="my-5">
                <Diamond />
              </div>
              <p className="mx-auto max-w-3xl leading-relaxed text-white/80">
                We bring together a trusted network of genuine profiles, intelligent matchmaking technology, and dedicated support to ensure your search for the perfect life partner is smooth, secure, and successful — every step of the way.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {highlights.map((h) => (
                  <div
                    key={h.title}
                    className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-[#f3d79e] ring-1 ring-white/25">
                      {h.icon}
                    </div>
                    <p className="font-semibold text-white">{h.title}</p>
                    <p className="mt-1 text-xs text-white/70">{h.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== STATS ==================== */}
        <section className="px-4 pb-20">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-lg shadow-rose-100/40 transition-all duration-300 hover:-translate-y-1 hover:border-rose-200"
              >
                <div className="font-display text-3xl font-bold text-rose-800">{s.value}</div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="px-4 pb-24">
          <div className="mx-auto max-w-5xl rounded-3xl border border-rose-100 bg-white p-10 text-center shadow-xl shadow-rose-100/50">
            <h3 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Ready to find your <span className="italic text-rose-800">life partner?</span>
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
              Join thousands of families who found their perfect match on First Marriage.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-800 px-8 py-3.5 font-semibold text-white shadow-lg shadow-rose-800/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-900 hover:shadow-xl"
            >
              Get Started
              <IconArrow />
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;