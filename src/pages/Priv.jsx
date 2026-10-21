import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import {
  InformationCircleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  ShareIcon,
  LockClosedIcon,
  UserGroupIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

/* Policy text is unchanged; it is only structured as data so the layout stays consistent. */
const EMAIL = 'privacy@firstmarriage.online';

const sections = [
  {
    id: 'sec-1',
    title: '1. Introduction',
    icon: InformationCircleIcon,
    blocks: [
      { type: 'p', text: 'At First Marriage.com ("we", "us", or "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website and use our services.' },
      { type: 'p', text: 'This policy applies to all visitors, users, and others who access our service ("Users"). By using First Marriage.com, you agree to the collection and use of information in accordance with this policy.' },
    ],
  },
  {
    id: 'sec-2',
    title: '2. Information We Collect',
    icon: ClipboardDocumentListIcon,
    blocks: [
      { type: 'p', text: 'We collect several types of information to provide and improve our services to you:' },
      {
        type: 'ul',
        items: [
          'Personal details such as name, email address, date of birth, phone number, and gender',
          'Profile information including education, occupation, income, and marital preferences',
          'Photos and other media you choose to upload',
          'Communication data when you interact with other users',
          'Technical data including IP address, browser type, and device information',
          'Usage data about how you interact with our platform',
        ],
      },
      { type: 'note', text: 'We may collect sensitive personal data only with your explicit consent, which you can withdraw at any time.' },
    ],
  },
  {
    id: 'sec-3',
    title: '3. How We Use Your Information',
    icon: Cog6ToothIcon,
    blocks: [
      { type: 'p', text: 'We use the collected information for various purposes:' },
      {
        type: 'ul',
        items: [
          'To create and manage your account',
          'To provide personalized matchmaking services',
          'To communicate with you about matches and service updates',
          'To improve our platform and develop new features',
          'To prevent fraud and ensure platform security',
          'To comply with legal obligations',
        ],
      },
      { type: 'note', text: 'Your profile information (excluding contact details) may be visible to other users to facilitate matches.' },
    ],
  },
  {
    id: 'sec-4',
    title: '4. Cookies and Tracking Technologies',
    icon: FingerPrintIcon,
    blocks: [
      { type: 'p', text: 'We use cookies and similar tracking technologies to enhance your experience:' },
      {
        type: 'ul',
        items: [
          'Essential cookies for platform functionality',
          'Analytics cookies to understand user behavior',
          'Preference cookies to remember your settings',
        ],
      },
      { type: 'p', text: 'You can control cookies through your browser settings, but disabling them may affect certain features.' },
    ],
  },
  {
    id: 'sec-5',
    title: '5. Information Sharing',
    icon: ShareIcon,
    blocks: [
      { type: 'p', text: 'We may share your information in these limited circumstances:' },
      {
        type: 'ul',
        items: [
          'With service providers who assist in platform operations',
          'When required by law or to protect our legal rights',
          'In connection with business transfers like mergers or acquisitions',
        ],
      },
      { type: 'note', text: 'We never sell your personal information to third parties for marketing purposes.' },
    ],
  },
  {
    id: 'sec-6',
    title: '6. Data Security',
    icon: LockClosedIcon,
    blocks: [
      { type: 'p', text: 'We implement appropriate technical and organizational measures to protect your personal data. However, no internet transmission is completely secure, and we cannot guarantee absolute security.' },
    ],
  },
  {
    id: 'sec-7',
    title: "7. Children's Privacy",
    icon: UserGroupIcon,
    blocks: [
      { type: 'p', text: 'Our services are intended for users aged 18 and above. We do not knowingly collect information from minors. If we become aware of such collection, we will take steps to delete the information.' },
    ],
  },
  {
    id: 'sec-8',
    title: '8. Changes to This Policy',
    icon: ArrowPathIcon,
    blocks: [
      { type: 'p', text: 'We may update this Privacy Policy periodically. We will notify you of significant changes through our platform or via email. Your continued use after changes constitutes acceptance of the updated policy.' },
    ],
  },
  {
    id: 'sec-9',
    title: '9. Contact Us',
    icon: EnvelopeIcon,
    blocks: [{ type: 'contact' }],
  },
];

const PrivacyPolicy = () => {
  const [active, setActive] = useState(sections[0].id);

  // highlight the table-of-contents item for the section being read
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

  const renderBlock = (block, i) => {
    if (block.type === 'p') {
      return (
        <p key={i} className="max-w-2xl leading-relaxed text-gray-700">
          {block.text}
        </p>
      );
    }
    if (block.type === 'ul') {
      return (
        <ul key={i} className="max-w-2xl space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-700 leading-relaxed">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === 'note') {
      return (
        <div key={i} className="flex max-w-2xl items-start gap-3 rounded-xl border border-yellow-600 bg-yellow-600/10 p-4">
          <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
          <p className="font-medium leading-relaxed text-gray-900">{block.text}</p>
        </div>
      );
    }
    if (block.type === 'contact') {
      return (
        <div key={i} className="max-w-2xl space-y-4">
          <p className="leading-relaxed text-gray-700">
            If you have questions about this Privacy Policy or your personal data, please contact our Data Protection Officer at{' '}
            <a href={`mailto:${EMAIL}`} className="font-semibold text-red-700 hover:underline">{EMAIL}</a>.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 rounded-xl bg-red-900 px-5 py-3 font-semibold text-white shadow-lg transition duration-200 hover:bg-red-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-800/30"
          >
            <EnvelopeIcon className="h-5 w-5" />
            Email our Data Protection Officer
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <style>{`
        @keyframes ppRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .pp-rise { animation: ppRise .6s ease-out both; }
        .pp-rise-2 { animation: ppRise .6s .12s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .pp-rise, .pp-rise-2 { animation: none; } }
      `}</style>

      <div className="relative overflow-hidden min-h-screen bg-gray-50 px-4 py-12">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-600/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-red-900/10 blur-3xl" />

        {/* Heading */}
        <div className="relative pp-rise mx-auto mb-12 max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold text-red-700 md:text-5xl">Privacy Policy</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-900" />
          <p className="mt-5 text-lg text-gray-700">
            How we collect, use, and protect your personal information.
          </p>
        </div>

        <div className="relative pp-rise-2 mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-4">

          {/* ---------- Left: contents + summary ---------- */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-1">
            <nav aria-label="Privacy policy sections" className="rounded-2xl border-t-4 border-red-900 bg-white p-4 shadow-xl">
              <p className="mb-3 px-2 text-sm font-bold text-gray-900">On this page</p>
              <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(s.id)}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={
                      'whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-yellow-600/40 lg:whitespace-normal ' +
                      (active === s.id
                        ? 'bg-red-900 font-semibold text-white shadow'
                        : 'text-gray-700 hover:bg-yellow-600/10')
                    }
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </nav>

            <div className="relative hidden overflow-hidden rounded-2xl bg-red-900 p-6 text-white shadow-xl lg:block">
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-yellow-600/10" />
              <h3 className="relative mb-4 text-lg font-bold">Privacy at a glance</h3>
              <ul className="relative space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  We never sell your personal information.
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  Sensitive data only with your explicit consent.
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  Our services are for users aged 18 and above.
                </li>
              </ul>
            </div>
          </aside>

          {/* ---------- Right: sections ---------- */}
          <div className="space-y-6 lg:col-span-3">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-28 rounded-2xl bg-white p-7 shadow-lg transition duration-200 hover:shadow-xl md:p-8"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-900 text-white shadow">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="text-xl font-bold text-red-800 md:text-2xl">{s.title}</h2>
                  </div>
                  <div className="space-y-4">{s.blocks.map(renderBlock)}</div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;