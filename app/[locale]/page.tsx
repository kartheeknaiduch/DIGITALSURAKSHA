import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import RadarAnimation from '@/components/RadarAnimation';

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-marigold-glow blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] aspect-square rounded-full bg-safe-glow blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="animate-fadein" style={{ animationDelay: '0.1s' }}>
            <div className="chip mb-6">Digital Suraksha</div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold leading-tight tracking-tight text-ink mb-6 text-balance">
              {t('heroH1')} <span className="text-marigold-deep">{t('heroAccent')}</span>
            </h1>
            <p className="text-lg md:text-xl text-ink/70 mb-10 max-w-lg leading-relaxed text-balance">
              {t('heroP')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/check" className="btn-primary justify-center text-lg shadow-card hover:shadow-card-hover">
                {t('heroBtn1')}
              </Link>
              <Link href="/grievance" className="btn-ghost justify-center text-lg">
                {t('heroBtn2')}
              </Link>
            </div>
          </div>

          <div className="relative animate-fadein" style={{ animationDelay: '0.3s' }}>
            <RadarAnimation label={t('radarLabel')} caption={t('radarCaption')} />
            
            {/* Floating UI Elements for aesthetic */}
            <div className="absolute top-10 -left-6 md:-left-12 glass-card rounded-2xl p-4 shadow-glass animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-danger-light flex items-center justify-center text-danger">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-ink/50 uppercase">SMS Scan</div>
                  <div className="font-bold text-danger text-sm">Phishing Detected</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 -right-6 md:-right-12 glass-card rounded-2xl p-4 shadow-glass animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-safe-light flex items-center justify-center text-safe">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-ink/50 uppercase">URL Scan</div>
                  <div className="font-bold text-safe text-sm">Safe Link</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-line py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-line">
          
          <div className="px-6 first:pl-0 text-center sm:text-left">
            <div className="text-4xl font-display font-black text-ink mb-2">1930</div>
            <div className="text-sm font-bold text-ink/60 uppercase tracking-wide">{t('stat1')}</div>
          </div>
          
          <div className="px-6 text-center sm:text-left pt-6 sm:pt-0">
            <div className="text-4xl font-display font-black text-marigold-deep mb-2">{t('stat2big')}</div>
            <div className="text-sm font-bold text-ink/60 uppercase tracking-wide">{t('stat2')}</div>
          </div>
          
          <div className="px-6 text-center sm:text-left pt-6 sm:pt-0">
            <div className="text-4xl font-display font-black text-danger-deep mb-2">{t('stat3big')}</div>
            <div className="text-sm font-bold text-ink/60 uppercase tracking-wide">{t('stat3')}</div>
          </div>
          
          <div className="px-6 last:pr-0 text-center sm:text-left pt-6 sm:pt-0">
            <div className="text-4xl font-display font-black text-safe mb-2">{t('stat4big')}</div>
            <div className="text-sm font-bold text-ink/60 uppercase tracking-wide">{t('stat4')}</div>
          </div>

        </div>
      </section>
    </div>
  );
}
