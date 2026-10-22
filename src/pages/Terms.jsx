import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';

const sections = [
  {
    id: 'usage',
    title: 'Usage and Purpose',
    content: [
      'First Marriage is a matrimonial platform for individuals intending to explore potential marriage alliances. It is not a dating or casual contact site.',
    ],
  },
  {
    id: 'account',
    title: 'Account Responsibility',
    content: [
      'Users are responsible for the profiles they create and must have consent from individuals they represent. We reserve the right to remove or reject any profile that violates our policies.',
      'The user must ensure all information provided is accurate. Any misrepresentation may result in termination of the account without notice.',
    ],
  },
  {
    id: 'data',
    title: 'Personal Data',
    content: [
      'Your data may be used to improve matchmaking features and may be shared with third parties only with your consent. Profiles should be accurate and not misleading.',
      'We collect minimal personal data necessary for the service. Users have control over what information they wish to share.',
    ],
  },
  {
    id: 'use',
    title: 'Acceptable Use',
    content: [
      'Users must not upload offensive, false, or harmful content. Any attempts to misuse the platform will result in removal and potential legal action.',
      'Commercial use or unauthorized data scraping from the platform is strictly prohibited.',
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    content: [
      'We do not guarantee matchmaking outcomes. Any interaction or communication between users is at their own discretion and risk.',
      'First Marriage is not liable for any financial or emotional loss resulting from user interaction.',
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    content: [
      'First Marriage materials are the exclusive property of the company and are protected by copyright and intellectual property laws. Any copying, reproduction, or distribution without prior written permission is strictly prohibited. Unauthorized use may lead to legal action.',
    ],
  },
  {
    id: 'modifications',
    title: 'Modifications',
    content: [
      'Terms may be updated occasionally. Continued use of the platform implies acceptance of these changes.',
      'We encourage users to periodically review the terms to stay informed of updates.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    content: [
      <>
        For queries regarding these terms, please contact us at{' '}
        <a
          href="mailto:support@firstmarriage.online"
          className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
        >
          support@firstmarriage.online
        </a>
        .
      </>,
      'Our customer service team is available to assist you Monday through Friday during standard business hours.',
    ],
  },
];

const Terms = () => {
  const [active, setActive] = useState(sections[0].id);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-red-800 px-6 sm:px-10 py-8 sm:py-12 shadow-xl">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4 sm:gap-6">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <svg
                className="h-7 w-7 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Terms &amp; Conditions
              </h1>
              <p className="mt-1 text-sm sm:text-base text-white/80">
                Please read these terms carefully before using the platform.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block">
            <nav className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
              <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                On this page
              </p>
              <ul className="space-y-1">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollTo(s.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                        active === s.id
                          ? 'bg-red-800 font-semibold text-white shadow'
                          : 'text-gray-800 hover:bg-gray-100 hover:text-blue-900'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          active === s.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-blue-900'
                        }`}
                      >
                        {i + 1}
                      </span>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <main className="space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-md">
              <p className="text-sm sm:text-base leading-relaxed text-gray-800">
                Welcome to First Marriage. By accessing or using our platform, you agree to these
                Terms &amp; Conditions. If you do not agree, please do not use the platform.
              </p>
            </div>

            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="group scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-800 text-base font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    {i + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-blue-900">{s.title}</h2>
                </div>
                <div className="mt-4 space-y-3 border-l-2 border-gray-100 pl-5 sm:ml-5">
                  {s.content.map((para, idx) => (
                    <p
                      key={idx}
                      className="text-sm sm:text-base leading-relaxed text-gray-800"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-red-800 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <Footer />
    </div>
  );
};

export default Terms;