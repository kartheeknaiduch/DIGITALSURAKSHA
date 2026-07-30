'use client';

import { useState, type ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import CheckResult from '@/components/CheckResult';

type CheckResultData = Omit<ComponentProps<typeof CheckResult>, 'onReset'>;

export default function LinkCheck() {
  const t = useTranslations('linkCheck');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResultData | null>(null);

  const handleCheckUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      // Basic URL validation/formatting before sending
      let submitUrl = url.trim();
      if (!submitUrl.startsWith('http://') && !submitUrl.startsWith('https://')) {
        submitUrl = 'https://' + submitUrl;
      }
      
      const res = await fetch('/api/check/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <CheckResult {...result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="bg-panel rounded-3xl border border-line p-8 md:p-12 animate-fadein shadow-card">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-ink mb-2">{t('h1')}</h2>
        <p className="text-ink/60">{t('p')}</p>
      </div>

      <div className="mb-8">
        <input
          type="url"
          className="input-base"
          placeholder={t('urlPlaceholder')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheckUrl()}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <button 
          className="btn-primary w-full sm:w-auto" 
          onClick={handleCheckUrl}
          disabled={!url.trim() || loading}
        >
          {loading ? 'Scanning URL...' : t('urlBtn')}
        </button>
      </div>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-line"></div>
        <span className="flex-shrink-0 mx-4 text-ink/40 text-sm font-bold uppercase tracking-wider">{t('orDivider')}</span>
        <div className="flex-grow border-t border-line"></div>
      </div>

      {/* Mock QR Upload Dropzone */}
      <div className="mt-4 border-2 border-dashed border-line rounded-2xl p-12 text-center hover:border-marigold/50 hover:bg-marigold/5 transition-all cursor-pointer group">
        <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-marigold/10 transition-colors">
          <svg className="w-8 h-8 text-ink/40 group-hover:text-marigold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="font-bold text-ink mb-2 group-hover:text-marigold-deep transition-colors">{t('qrUpload')}</div>
        <div className="text-sm text-ink/50">{t('hint')}</div>
      </div>
    </div>
  );
}
