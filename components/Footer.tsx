import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('nav');
  const d = useTranslations('about');

  return (
    <footer className="bg-ink text-white/80 py-12 mt-20 border-t-4 border-marigold">
      <div className="page-wrap grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
              <path d="M20 3 L35 9 V19 C35 28 28.5 34.5 20 37 C11.5 34.5 5 28 5 19 V9 Z" fill="#E8A33D"/>
              <path d="M13 20 L18 25 L27 14" stroke="#1B2A4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="font-display font-bold text-xl text-white">{t('brand')}</span>
          </div>
          <p className="text-sm opacity-80 max-w-sm mb-6">{d('p')}</p>
        </div>
        
        <div>
          <h4 className="font-display font-bold text-white mb-4 uppercase tracking-wider text-sm opacity-90">{t('home')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/check" className="hover:text-marigold transition-colors">{t('check')}</Link></li>
            <li><Link href="/scams" className="hover:text-marigold transition-colors">{t('scams')}</Link></li>
            <li><Link href="/laws" className="hover:text-marigold transition-colors">{t('laws')}</Link></li>
            <li><Link href="/grievance" className="hover:text-marigold transition-colors">{t('grievance')}</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display font-bold text-white mb-4 uppercase tracking-wider text-sm opacity-90">{d('privacy')}</h4>
          <p className="text-sm opacity-80 mb-4">{d('privacyText')}</p>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-sm">
            <strong>{t('emergency')}</strong>
          </div>
        </div>
      </div>
      <div className="page-wrap mt-12 pt-6 border-t border-white/10 text-xs opacity-60 text-center">
        © {new Date().getFullYear()} Digital Suraksha Initiative.
      </div>
    </footer>
  );
}
