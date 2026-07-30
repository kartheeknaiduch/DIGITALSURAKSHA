'use client';

import { useTranslations } from 'next-intl';

interface CheckResultProps {
  verdict: 'safe' | 'suspicious' | 'high_risk';
  confidence: number;
  explanation: string;
  nextStep: string;
  matchedPatterns?: string[];
  engine?: string;
  onReset: () => void;
}

export default function CheckResult({
  verdict,
  confidence,
  explanation,
  nextStep,
  matchedPatterns = [],
  engine,
  onReset
}: CheckResultProps) {
  const t = useTranslations('common');

  const config = {
    safe: {
      color: 'bg-safe',
      light: 'bg-safe-light',
      text: 'text-safe',
      icon: (
        <svg className="w-12 h-12 text-safe" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t('safe'),
      bgGlow: 'from-safe-light to-transparent',
    },
    suspicious: {
      color: 'bg-marigold-deep',
      light: 'bg-marigold/15',
      text: 'text-marigold-deep',
      icon: (
        <svg className="w-12 h-12 text-marigold-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      label: t('suspicious'),
      bgGlow: 'from-marigold/20 to-transparent',
    },
    high_risk: {
      color: 'bg-danger',
      light: 'bg-danger-light',
      text: 'text-danger',
      icon: (
        <svg className="w-12 h-12 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      label: t('highRisk'),
      bgGlow: 'from-danger-light to-transparent',
    }
  };

  const style = config[verdict];

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-line bg-panel p-8 md:p-12 animate-fadein shadow-card`}>
      <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${style.bgGlow} opacity-60 pointer-events-none`} />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          <div className={`shrink-0 p-4 rounded-full ${style.light}`}>
            {style.icon}
          </div>
          
          <div>
            <h2 className={`font-display text-4xl font-bold mb-2 ${style.text}`}>
              {style.label}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <span className="bg-ink/5 px-3 py-1 rounded-full text-ink/70">
                {t('confidence')} {confidence}%
              </span>
              {engine && (
                <span className="bg-ink/5 px-3 py-1 rounded-full text-ink/70 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  {t('poweredBy')} {engine}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-ink/50">{t('explanation')}</h3>
            <p className="text-ink font-medium leading-relaxed">{explanation}</p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-ink/50">{t('nextStep')}</h3>
            <div className={`p-4 rounded-xl border ${verdict === 'high_risk' ? 'bg-danger-light border-danger/20 text-danger-deep' : 'bg-ink/5 border-line text-ink'}`}>
              <p className="font-medium">{nextStep}</p>
            </div>
          </div>
        </div>

        {matchedPatterns && matchedPatterns.length > 0 && (
          <div className="mt-8 pt-8 border-t border-line">
            <h3 className="font-bold text-sm uppercase tracking-wider text-ink/50 mb-3">{t('patterns')}</h3>
            <div className="flex flex-wrap gap-2">
              {matchedPatterns.map((p, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${verdict === 'high_risk' ? 'bg-danger-light text-danger' : 'bg-marigold/15 text-marigold-deep'}`}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button onClick={onReset} className="btn-ghost w-full justify-center">
            {t('tryAgain')}
          </button>
        </div>
      </div>
    </div>
  );
}
