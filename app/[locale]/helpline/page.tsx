import { getTranslations } from 'next-intl/server';
import { HELPLINES } from '@/app/content/helplines';

export default async function HelplinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('helpline');

  const loc = (en: string, hi: string, te: string) => {
    if (locale === 'hi') return hi || en;
    if (locale === 'te') return te || en;
    return en;
  };

  const sortedHelplines = [...HELPLINES].sort((a, b) => a.priority - b.priority);

  return (
    <div className="page-wrap py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="section-tag mb-2">{t('tag')}</div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-ink mb-4">{t('h1')}</h1>
        <p className="text-ink/70 text-lg">{t('p')}</p>
      </div>

      <div className="bg-danger-light border border-danger/20 rounded-2xl p-6 mb-12 flex gap-4 items-start shadow-sm animate-pulse-risk">
        <div className="w-10 h-10 shrink-0 bg-danger text-white rounded-full flex items-center justify-center font-bold text-xl">!</div>
        <div className="text-danger-deep font-bold leading-relaxed pt-1.5">{t('urgentNote')}</div>
      </div>

      <div className="space-y-6">
        {sortedHelplines.map(help => (
          <div key={help.id} className="bg-panel rounded-3xl border border-line p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-card transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-display font-bold text-ink">
                  {loc(help.titleEn, help.titleHi, help.titleTe)}
                </h2>
                {help.priority === 1 && (
                  <span className="chip-warn">Primary</span>
                )}
              </div>
              <p className="text-ink/70 text-sm leading-relaxed">
                {loc(help.descEn, help.descHi, help.descTe)}
              </p>
            </div>
            
            <div className="shrink-0 flex items-center gap-4">
              {help.number && (
                <a 
                  href={`tel:${help.number}`} 
                  className="bg-ink hover:bg-ink-light text-white font-mono text-xl font-bold px-6 py-3 rounded-2xl shadow-ink transition-all active:translate-y-px text-center min-w-[140px]"
                >
                  {help.number}
                </a>
              )}
              {help.portal && (
                <a 
                  href={help.portal} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-ink text-ink hover:bg-ink hover:text-white font-bold px-6 py-3 rounded-2xl transition-all active:translate-y-px text-center"
                >
                  Visit Portal ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
