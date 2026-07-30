import { getTranslations } from 'next-intl/server';

export default async function CallForwardingCheck() {
  const t = await getTranslations('callCheck');

  return (
    <div className="bg-panel rounded-3xl border border-line p-8 md:p-12 animate-fadein shadow-card">
      <div className="mb-10">
        <h2 className="text-3xl font-display font-bold text-ink mb-2">{t('h1')}</h2>
        <p className="text-ink/60">{t('p')}</p>
      </div>

      <div className="space-y-6">
        
        <div className="flow-step">
          <div className="flow-num">1</div>
          <div>
            <h3 className="text-lg font-bold text-ink mb-1">{t('step1h')}</h3>
            <p className="text-ink/70 mb-4">{t('step1p')}</p>
            <div className="inline-block bg-ink text-white font-mono text-2xl font-bold px-6 py-3 rounded-xl tracking-widest">
              *#21#
            </div>
          </div>
        </div>

        <div className="flow-step">
          <div className="flow-num">2</div>
          <div>
            <h3 className="text-lg font-bold text-ink mb-2">{t('step2h')}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-safe-light rounded-xl">
                <svg className="w-6 h-6 text-safe shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-safe font-medium">{t('step2safe')}</span>
              </div>
              <div className="flex items-start gap-3 p-4 bg-danger-light rounded-xl">
                <svg className="w-6 h-6 text-danger shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-danger font-medium">{t('step2risk')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flow-step">
          <div className="flow-num">3</div>
          <div>
            <h3 className="text-lg font-bold text-ink mb-1">{t('step3h')}</h3>
            <p className="text-ink/70 mb-4">{t('step3p')}</p>
            <div className="flex flex-wrap gap-4">
              <div className="inline-block bg-ink text-white font-mono text-xl font-bold px-4 py-2 rounded-xl tracking-widest">
                *#62#
              </div>
              <div className="inline-block bg-ink text-white font-mono text-xl font-bold px-4 py-2 rounded-xl tracking-widest">
                *#67#
              </div>
            </div>
          </div>
        </div>

        <div className="flow-step bg-marigold/10 border-marigold/30">
          <div className="flow-num bg-marigold-deep">4</div>
          <div>
            <h3 className="text-lg font-bold text-ink mb-1">{t('step4h')}</h3>
            <p className="text-ink/70 mb-4">{t('step4p')}</p>
            <div className="inline-block bg-marigold-deep text-white font-mono text-2xl font-bold px-6 py-3 rounded-xl tracking-widest">
              ##002#
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-ink/50 bg-ink/5 p-4 rounded-xl">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t('carrierNote')}
      </div>
    </div>
  );
}
