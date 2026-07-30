'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function GrievancePage() {
  const t = useTranslations('grievance');
  
  const [what, setWhat] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');
  
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/grievance/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ what, amount, date, phone })
      });
      const data = await res.json();
      setDraft(data.draft);
      setCopied(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-wrap py-12">
      <div className="mb-12 max-w-2xl">
        <div className="section-tag mb-2">{t('tag')}</div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-ink mb-4 text-balance">{t('h1')}</h1>
        <p className="text-ink/70 text-lg">{t('p')}</p>
      </div>

      {/* Pathways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="block group">
          <div className="bg-panel rounded-3xl border border-line p-8 h-full hover:border-danger/50 hover:shadow-card transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-danger/10 group-hover:text-danger/20 transition-colors">
              <svg className="w-24 h-24 transform rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-display font-bold text-ink mb-2 group-hover:text-danger-deep transition-colors">{t('trackA')}</h2>
              <p className="text-ink/70 mb-4">{t('trackADesc')}</p>
              <div className="inline-flex items-center gap-2 font-bold text-sm text-danger mt-4">
                cybercrime.gov.in →
              </div>
            </div>
          </div>
        </a>

        <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer" className="block group">
          <div className="bg-panel rounded-3xl border border-line p-8 h-full hover:border-marigold/50 hover:shadow-card transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-marigold/10 group-hover:text-marigold/20 transition-colors">
              <svg className="w-24 h-24 transform -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-display font-bold text-ink mb-2 group-hover:text-marigold-deep transition-colors">{t('trackB')}</h2>
              <p className="text-ink/70 mb-4">{t('trackBDesc')}</p>
              <div className="inline-flex items-center gap-2 font-bold text-sm text-marigold-deep mt-4">
                cms.rbi.org.in →
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Complaint Generator */}
      <div className="bg-white rounded-3xl border border-line p-8 md:p-12 shadow-card max-w-4xl mx-auto">
        <div className="mb-8 border-b border-line pb-8">
          <h2 className="text-2xl font-display font-bold text-ink mb-2">{t('draftTitle')}</h2>
          <p className="text-ink/60">{t('draftDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-ink/70 mb-2">{t('draftWhat')}</label>
            <textarea
              className="textarea-base"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="E.g., I received a call from someone claiming to be from my bank..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink/70 mb-2">{t('draftAmount')}</label>
            <input
              type="text"
              className="input-base"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink/70 mb-2">{t('draftDate')}</label>
            <input
              type="date"
              className="input-base"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-ink/70 mb-2">{t('draftPhone')}</label>
            <input
              type="text"
              className="input-base"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210 or URL"
            />
          </div>
        </div>

        <button 
          className="btn-primary w-full justify-center mb-8"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating...' : t('draftGenerate')}
        </button>

        {draft && (
          <div className="animate-fadein bg-ink/5 p-6 rounded-2xl border border-line relative">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-line">
              <span className="font-bold text-sm text-ink/60 uppercase">{t('draftNote')}</span>
              <button 
                onClick={copyToClipboard}
                className="px-4 py-2 bg-white rounded-lg text-sm font-bold shadow-sm border border-line hover:border-ink/30 transition-all flex items-center gap-2"
              >
                {copied ? (
                  <><span className="text-safe">✓</span> {t('draftCopied')}</>
                ) : (
                  <>{t('draftCopy')}</>
                )}
              </button>
            </div>
            <pre className="font-mono text-sm text-ink whitespace-pre-wrap leading-relaxed">
              {draft}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
