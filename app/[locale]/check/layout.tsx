import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function CheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('check');

  return (
    <div className="page-wrap py-12">
      <div className="mb-8">
        <div className="section-tag mb-2">{t('tag')}</div>
        <h1 className="text-4xl font-display font-black text-ink mb-4">{t('h1')}</h1>
        <p className="text-ink/70 text-lg max-w-2xl">{t('p')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-72 shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <ToolLink href="/check/sms" title={t('smsTitle')} desc={t('smsDesc')} />
          <ToolLink href="/check/link" title={t('linkTitle')} desc={t('linkDesc')} />
          <ToolLink href="/check/email" title={t('emailTitle')} desc={t('emailDesc')} />
          <ToolLink href="/check/pdf" title={t('pdfTitle')} desc={t('pdfDesc')} />
          <ToolLink href="/check/call-forwarding" title={t('callTitle')} desc={t('callDesc')} />
        </div>

        {/* Tool Workspace */}
        <div className="flex-1 w-full relative">
          {children}
        </div>
      </div>
    </div>
  );
}

function ToolLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link 
      href={href} 
      className="block p-4 rounded-2xl border border-line bg-white hover:border-marigold/50 hover:shadow-card transition-all group"
    >
      <div className="font-bold text-ink mb-1 group-hover:text-marigold-deep transition-colors">{title}</div>
      <div className="text-xs text-ink/60 line-clamp-2 leading-relaxed">{desc}</div>
    </Link>
  );
}
