import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { SCAMS } from '@/app/content/scams';

export function generateStaticParams() {
  return SCAMS.map((scam) => ({ slug: scam.slug }));
}

export default async function ScamDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('scams');
  const scam = SCAMS.find((s) => s.slug === slug);

  if (!scam) notFound();

  const loc = (enText: string, hiText: string, teText: string) => {
    if (locale === 'hi') return hiText || enText;
    if (locale === 'te') return teText || enText;
    return enText;
  };

  return (
    <div className="page-wrap py-12 max-w-4xl mx-auto">
      <Link href="/scams" className="inline-flex items-center gap-2 text-sm font-bold text-ink/50 hover:text-ink mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to All Scams
      </Link>

      <div className="bg-panel rounded-3xl border border-line p-8 md:p-12 shadow-card mb-8">
        <div className="chip mb-4">{scam.tag}</div>
        <h1 className="text-3xl md:text-5xl font-display font-black text-ink mb-6 leading-tight text-balance">
          {loc(scam.title, scam.titleHi, scam.titleTe)}
        </h1>
        
        {/* Scam Flow Diagram */}
        <div className="bg-ink/5 rounded-2xl p-6 md:p-8 my-10 flex flex-col md:flex-row items-center gap-4 justify-between border border-line overflow-x-auto hide-scrollbar">
          {scam.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 shrink-0">
              <div className={`px-5 py-3 rounded-xl text-sm font-bold shadow-sm whitespace-nowrap
                ${step.type === 'alert' ? 'bg-danger text-white shadow-danger' : 'bg-white text-ink border border-line'}`}
              >
                {step.label}
              </div>
              {i < scam.steps.length - 1 && (
                <div className="hidden md:block w-8 h-[2px] bg-ink/20 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-ink/20 -rotate-45" />
                </div>
              )}
              {i < scam.steps.length - 1 && (
                <div className="md:hidden h-8 w-[2px] bg-ink/20 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-r-2 border-b-2 border-ink/20 rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 bg-danger-light rounded-2xl mb-10 border border-danger/20 flex gap-4 items-start">
          <div className="w-10 h-10 shrink-0 bg-danger text-white rounded-full flex items-center justify-center font-bold text-xl">!</div>
          <p className="text-danger-deep font-bold leading-relaxed text-lg pt-1.5 text-balance">
            {loc(scam.redFlag, scam.redFlagHi, scam.redFlagTe)}
          </p>
        </div>

        <div className="prose prose-lg max-w-none prose-p:text-ink/80 prose-p:leading-relaxed">
          <p>{loc(scam.detail, scam.detailHi, scam.detailTe)}</p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link href="/grievance" className="btn-danger shadow-card hover:shadow-card-hover">
          {t('reportBtn')}
        </Link>
      </div>
    </div>
  );
}
