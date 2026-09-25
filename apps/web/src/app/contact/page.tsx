/** Contact page — Open-source maintainer, FAQ, and message form. */
'use client';

import { Mail, Globe, Send, ChevronDown, HelpCircle, Github } from 'lucide-react';
import PublicChrome from '@/components/layout/public-chrome';
import Link from 'next/link';
import { useState } from 'react';
import {
  GITHUB_REPO_OSS,
  OSS_AUTHOR_EMAIL,
  OSS_AUTHOR_PROFILE_URL,
  PRODUCT_NAME,
  CONZEX_WEB_URL,
} from '@idrac/shared';

const FAQ = [
  {
    q: `What is ${PRODUCT_NAME}?`,
    a: `${PRODUCT_NAME} is an open-source, self-hosted web console for Dell PowerEdge servers with iDRAC 6 through 9. This repository (sumit-kumawat/uidrac) is MIT-licensed and connects to iDRAC on your LAN without an edge agent.`,
  },
  {
    q: 'Is this the same as the Conzex product?',
    a: `Related codebase, different distribution. The Conzex product is a commercial, cloud-hosted offering with an optional UiDRAC agent ([Conzex](${CONZEX_WEB_URL})). This fork stays MIT-licensed and self-hosted under Sumit Kumawat.`,
  },
  {
    q: 'How do I get help or contribute?',
    a: `Open a GitHub issue or pull request on ${GITHUB_REPO_OSS}. For direct contact, email the maintainer.`,
  },
  {
    q: 'Which server generations are supported?',
    a: 'PowerEdge systems with iDRAC 6, 7, 8, or 9. The platform auto-detects Redfish vs legacy protocols during server registration.',
  },
  {
    q: 'How are credentials handled?',
    a: 'iDRAC credentials are encrypted at rest (AES-256). Role-based access controls scope users to their organization. Actions are recorded in an audit log.',
  },
] as const;

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:${OSS_AUTHOR_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`;
    window.open(mailto);
    setSent(true);
  };

  return (
    <PublicChrome mainClassName="bg-bg-body py-10">
      <h1 className="text-xl font-bold text-text-primary mb-1">Contact</h1>
      <p className="text-sm text-text-secondary mb-2 max-w-2xl leading-relaxed">
        <strong className="text-text-primary">{PRODUCT_NAME}</strong> open source by{' '}
        <a href={OSS_AUTHOR_PROFILE_URL} className="text-dell-blue font-semibold hover:underline">
          Sumit Kumawat
        </a>
        . Questions, contributions, and feedback welcome.
      </p>
      <p className="text-sm text-text-secondary mb-8">
        Repositories:{' '}
        <a href={GITHUB_REPO_OSS} className="text-dell-blue font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
          sumit-kumawat/uidrac
        </a>
        {' · '}
        <a href={CONZEX_WEB_URL} className="text-dell-blue font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
          Conzex (commercial product)
        </a>
        {' · '}
        <Link href="/versions" className="text-dell-blue font-semibold hover:underline">
          Version manager
        </Link>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="space-y-4">
          <div className="bg-white border border-border-card rounded">
            <div className="px-5 py-4 border-b border-border-card">
              <h2 className="text-sm font-semibold text-text-primary">Maintainer</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-dell-blue mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Profile</p>
                  <a href={OSS_AUTHOR_PROFILE_URL} className="text-sm text-dell-blue hover:underline">
                    www.sumitkumawat.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-dell-blue mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <a href={`mailto:${OSS_AUTHOR_EMAIL}`} className="text-sm text-dell-blue hover:underline">
                    {OSS_AUTHOR_EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Github className="w-4 h-4 text-dell-blue mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Open-source repo</p>
                  <a href={GITHUB_REPO_OSS} className="text-sm text-dell-blue hover:underline break-all" target="_blank" rel="noopener noreferrer">
                    github.com/sumit-kumawat/uidrac
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-card rounded">
          <div className="px-5 py-4 border-b border-border-card">
            <h2 className="text-sm font-semibold text-text-primary">Send a message</h2>
          </div>
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            {sent ? (
              <p className="text-sm text-text-secondary">Your email client should open with the message pre-filled to {OSS_AUTHOR_EMAIL}.</p>
            ) : (
              <>
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border-card rounded text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-border-card rounded text-sm"
                />
                <input
                  required
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-border-card rounded text-sm"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2 border border-border-card rounded text-sm"
                />
                <button type="submit" className="inline-flex items-center gap-2 bg-dell-blue text-white text-sm font-semibold px-4 py-2 rounded hover:bg-dell-blue-dark">
                  <Send className="w-4 h-4" /> Open in email
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <div className="bg-white border border-border-card rounded">
        <div className="px-5 py-4 border-b border-border-card flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-dell-blue" />
          <h2 className="text-sm font-semibold text-text-primary">FAQ</h2>
        </div>
        <div className="divide-y divide-border-card">
          {FAQ.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-5 py-3 flex items-center justify-between text-left text-sm font-medium text-text-primary hover:bg-bg-body/50"
              >
                {item.q}
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </PublicChrome>
  );
}
