import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="page-wrap py-12 max-w-3xl mx-auto text-center">
      <div className="w-20 h-20 mx-auto bg-ink rounded-3xl flex items-center justify-center mb-8 shadow-ink">
        <svg className="w-12 h-12" viewBox="0 0 40 40" fill="none">
          <path d="M20 3 L35 9 V19 C35 28 28.5 34.5 20 37 C11.5 34.5 5 28 5 19 V9 Z" fill="#E8A33D"/>
          <path d="M13 20 L18 25 L27 14" stroke="#1B2A4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
      <h1 className="text-4xl font-display font-black text-ink mb-6">{t('h1')}</h1>
      <p className="text-ink/70 text-lg leading-relaxed mb-12">
        {t('p')}
      </p>

      <div className="bg-panel rounded-3xl border border-line p-8 text-left shadow-card">
        <h2 className="text-xl font-display font-bold text-ink mb-4">{t('privacy')}</h2>
        <p className="text-ink/70 leading-relaxed mb-6">
          {t('privacyText')}
        </p>
        <p className="text-ink/70 leading-relaxed text-sm">
          Digital Suraksha is designed as a privacy-first utility. Scanned contents (URLs, SMS texts, Emails) are analyzed through pattern matching and heuristic engines. Where third-party APIs (like VirusTotal) are used, only the required payload (such as a hashed URL) is transmitted. No personal identifiable information is stored on our servers.
        </p>
      </div>
    </div>
  );
}
