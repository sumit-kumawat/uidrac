/** Contact page — Conzex product support, detailed FAQ, and message form. */
'use client';

import { Mail, Globe, Phone, Send, ChevronDown, HelpCircle } from 'lucide-react';
import PublicChrome from '@/components/layout/public-chrome';
import Link from 'next/link';
import { useState } from 'react';

const FAQ = [
  {
    q: 'What is Universal iDRAC Console?',
    a: 'It is a commercial product from Conzex Global Private Limited that provides a single web console for Dell PowerEdge servers across iDRAC 6 through 9—without Java plugins or generation-specific browser requirements.',
  },
  {
    q: 'Is this open source software?',
    a: 'No. Universal iDRAC Console is proprietary software developed and supported by Conzex. You deploy it on your own infrastructure (or Conzex-managed cloud); source code and licensing are provided under your agreement with Conzex.',
  },
  {
    q: 'How do I obtain a deployment?',
    a: 'Contact Conzex for licensing, deployment packages, and environment guidance. Standard delivery uses Docker Compose with PostgreSQL and Redis; Conzex can assist with production hardening, TLS, and backups.',
  },
  {
    q: 'What is the difference between cloud and self-hosted mode?',
    a: 'Self-hosted installs typically reach iDRAC addresses directly from the API network. Cloud deployments use a per-tenant edge agent on your LAN to probe and manage iDRAC while keeping tenant traffic isolated.',
  },
  {
    q: 'When is the edge agent required?',
    a: 'When the platform runs in cloud mode and iDRAC endpoints are not reachable from the central API. Download the agent for your OS, register it to your organization, and add servers only after the agent shows connected.',
  },
  {
    q: 'Which server generations are supported?',
    a: 'PowerEdge systems with iDRAC 6, 7, 8, or 9 (roughly 11G through 16G). The platform auto-detects Redfish vs legacy protocols during server registration.',
  },
  {
    q: 'How are credentials and audit data handled?',
    a: 'iDRAC credentials are encrypted at rest (AES-256). Role-based access controls scope users to their organization. Administrative actions are recorded in an immutable audit log suitable for compliance review.',
  },
  {
    q: 'How do version upgrades work?',
    a: 'Releases follow semantic versioning (major.minor.patch). See the version manager for release notes and core implementation details for each build, including the current v1.2.x line.',
  },
  {
    q: 'What support channels are available?',
    a: 'Use email, phone, or WhatsApp listed on this page for sales, technical support, and escalation. Include your organization name, deployment mode (cloud/self-hosted), and agent status when reporting issues.',
  },
  {
    q: 'Can Conzex customize integrations or branding?',
    a: 'Yes. Enterprise customers can discuss custom domains, SSO, monitoring hooks, and managed operations. Describe your requirements in the contact form or schedule a call.',
  },
] as const;

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:info@conzex.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`;
    window.open(mailto);
    setSent(true);
  };

  return (
    <PublicChrome mainClassName="bg-bg-body py-10">
      <h1 className="text-xl font-bold text-text-primary mb-1">Contact Conzex</h1>
      <p className="text-sm text-text-secondary mb-2 max-w-2xl leading-relaxed">
        Universal iDRAC Console is a product of <strong className="text-text-primary">Conzex Global Private Limited</strong>.
        Reach out for licensing, deployment assistance, support, or partnership inquiries.
      </p>
      <p className="text-sm text-text-secondary mb-8">
        Release notes and build history:{' '}
        <Link href="/versions" className="text-dell-blue font-semibold hover:underline">
          Version manager
        </Link>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="space-y-4">
          <div className="bg-white border border-border-card rounded">
            <div className="bg-card-header px-4 py-2.5 border-b border-border-card">
              <h2 className="text-[13px] font-bold uppercase tracking-wide text-text-primary">Contact information</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-dell-blue/10 text-dell-blue flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">Email</div>
                  <a href="mailto:info@conzex.com" className="text-sm text-dell-blue hover:underline">
                    info@conzex.com
                  </a>
                  <p className="text-xs text-text-secondary mt-1">Sales, licensing, and technical support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-dell-blue/10 text-dell-blue flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">Website</div>
                  <a
                    href="https://www.conzex.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-dell-blue hover:underline"
                  >
                    www.conzex.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-dell-blue/10 text-dell-blue flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">Call / WhatsApp</div>
                  <a href="tel:+918007060308" className="text-sm text-dell-blue hover:underline">
                    (+91) 800 7060 308
                  </a>
                  <p className="text-xs text-text-secondary mt-1">Business hours IST; WhatsApp for quick updates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border-card rounded p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-2">What to include in your message</h3>
            <ul className="text-sm text-text-secondary space-y-1.5 list-disc pl-5 leading-relaxed">
              <li>Organization name and deployment region</li>
              <li>Approximate fleet size and iDRAC generations</li>
              <li>Cloud vs self-hosted and edge agent status (if applicable)</li>
              <li>Whether you need evaluation, production rollout, or support escalation</li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-border-card rounded">
          <div className="bg-card-header px-4 py-2.5 border-b border-border-card">
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-text-primary">Send a message</h2>
          </div>
          <div className="p-4">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-healthy flex items-center justify-center mx-auto mb-3">
                  <Send className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-text-primary mb-1">Message ready</p>
                <p className="text-sm text-text-secondary">Your email client should open with the message pre-filled to info@conzex.com.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Your name"
                    className="w-full px-3 py-2 border border-border-card rounded text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue focus:border-dell-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="your@company.com"
                    className="w-full px-3 py-2 border border-border-card rounded text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue focus:border-dell-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                    placeholder="Licensing / support / demo request"
                    className="w-full px-3 py-2 border border-border-card rounded text-sm focus:outline-none focus:ring-2 focus:ring-dell-blue focus:border-dell-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Tell us about your environment and how we can help…"
                    className="w-full px-3 py-2 border border-border-card rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-dell-blue focus:border-dell-blue"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-dell-blue text-white text-sm font-semibold rounded hover:bg-dell-blue-hover transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-border-card rounded overflow-hidden">
        <div className="bg-card-header px-4 py-2.5 border-b border-border-card flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-dell-blue" />
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-text-primary">Frequently asked questions</h2>
        </div>
        <div className="divide-y divide-border-card">
          {FAQ.map((item, index) => {
            const open = openFaq === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : index)}
                  className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-row-hover transition-colors"
                >
                  <span className="text-sm font-semibold text-text-primary">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-secondary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && <p className="px-4 pb-4 text-sm text-text-secondary leading-relaxed">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </PublicChrome>
  );
}
