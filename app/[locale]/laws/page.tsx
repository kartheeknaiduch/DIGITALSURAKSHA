'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { LAWS, LAW_CATEGORIES, LawCategory } from '@/app/content/laws';

export default function LawsPage() {
  const t = useTranslations('laws');
  const locale = useLocale();
  const [filter, setFilter] = useState<LawCategory | 'all'>('all');

  const filteredLaws = filter === 'all' ? LAWS : LAWS.filter(l => l.category === filter);

  const loc = (en: string, hi: string, te: string) => {
    if (locale === 'hi') return hi || en;
    if (locale === 'te') return te || en;
    return en;
  };

  return (
    <div className="page-wrap py-12">
      <div className="mb-12 max-w-2xl">
        <div className="section-tag mb-2">{t('tag')}</div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-ink mb-4">{t('h1')}</h1>
        <p className="text-ink/70 text-lg">{t('p')}</p>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-line">
        {LAW_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
              filter === cat.key 
                ? 'bg-ink text-white shadow-ink' 
                : 'bg-white border border-line text-ink/70 hover:border-ink/30'
            }`}
          >
            {loc(cat.labelEn, cat.labelHi, cat.labelTe)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredLaws.map(law => (
          <div key={law.id} className="bg-panel rounded-3xl border border-line p-8 shadow-sm">
            <h2 className="text-2xl font-display font-bold text-ink mb-6">
              {loc(law.titleEn, law.titleHi, law.titleTe)}
            </h2>
            
            <div className="space-y-6">
              {law.sections.map((sec, i) => (
                <div key={i} className="pl-4 border-l-2 border-marigold/30 pb-2">
                  <div className="font-mono text-xs font-bold text-marigold-deep mb-1 uppercase tracking-wider">{sec.section}</div>
                  <h3 className="font-bold text-ink mb-1">{loc(sec.titleEn, sec.titleEn, sec.titleEn)}</h3>
                  <p className="text-sm text-ink/70 leading-relaxed text-balance">
                    {loc(sec.descEn, sec.descHi, sec.descTe)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-4 border-t border-line text-xs font-bold text-ink/40 uppercase">
              {t('lastVerified')} {law.lastVerifiedOn}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-ink/5 rounded-2xl border border-line text-center text-sm font-medium text-ink/60">
        {t('disclaimer')}
      </div>
    </div>
  );
}
