import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { SCAMS } from '@/app/content/scams';

export default async function ScamsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('scams');
  
  // Helper to get locale-specific text
  const loc = (enText: string, hiText: string, teText: string) => {
    if (locale === 'hi') return hiText || enText;
    if (locale === 'te') return teText || enText;
    return enText;
  };

  return (
    <div className="page-wrap py-12">
      <div className="mb-12 max-w-2xl">
        <div className="section-tag mb-2">{t('tag')}</div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-ink mb-4 text-balance">{t('h1')}</h1>
        <p className="text-ink/70 text-lg">{t('p')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SCAMS.map((scam) => (
          <Link href={`/scams/${scam.slug}`} key={scam.slug} className="block group">
            <div className="bg-panel rounded-3xl border border-line p-6 h-full flex flex-col hover:border-marigold/50 hover:shadow-card transition-all">
              <div className="chip mb-4 self-start">{scam.tag}</div>
              <h2 className="text-xl font-display font-bold text-ink mb-3 group-hover:text-marigold-deep transition-colors line-clamp-3">
                {loc(scam.title, scam.titleHi, scam.titleTe)}
              </h2>
              <p className="text-sm text-ink/70 mb-6 flex-grow line-clamp-4">
                {loc(scam.summary, scam.summaryHi, scam.summaryTe)}
              </p>
              
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-sm font-bold text-ink/60 group-hover:text-ink transition-colors">
                  {t('learnMore')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
