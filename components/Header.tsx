'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/app/i18n/routing';
import Link from 'next/link';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: 'en' | 'hi' | 'te') => {
    const nextPath = pathname as Parameters<typeof router.replace>[0];
    router.replace(nextPath, { locale: newLocale });
  };

  return (
    <>
      <div className="bg-ink text-white py-2 text-sm">
        <div className="page-wrap flex justify-between items-center">
          <span>{t('govtNotice')}</span>
          <a href="tel:1930" className="font-bold text-marigold hover:text-marigold-light transition-colors">
            {t('emergency')}
          </a>
        </div>
      </div>
      
      <header className="bg-cream/90 backdrop-blur-md border-b border-line sticky top-0 z-50">
        <div className="page-wrap flex items-center justify-between h-[74px] gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-ink shrink-0">
            <svg className="w-9 h-9 shrink-0" viewBox="0 0 40 40" fill="none">
              <path d="M20 3 L35 9 V19 C35 28 28.5 34.5 20 37 C11.5 34.5 5 28 5 19 V9 Z" fill="#1B2A4A"/>
              <path d="M13 20 L18 25 L27 14" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span>{t('brand')}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="nav-pill">
              <button onClick={() => handleLocaleChange('en')} className="px-3 py-1.5 rounded-full font-bold text-sm text-ink/70 hover:bg-line/50 transition-colors">EN</button>
              <button onClick={() => handleLocaleChange('hi')} className="px-3 py-1.5 rounded-full font-bold text-sm text-ink/70 hover:bg-line/50 transition-colors">हिं</button>
              <button onClick={() => handleLocaleChange('te')} className="px-3 py-1.5 rounded-full font-bold text-sm text-ink/70 hover:bg-line/50 transition-colors">తె</button>
            </div>
            
            <Link href="/grievance" className="btn-danger py-2.5 px-4 text-sm max-sm:hidden">
              {t('reportCrime')}
            </Link>
          </div>
        </div>
        
        <div className="border-t border-line overflow-x-auto hide-scrollbar">
          <div className="page-wrap flex gap-1">
            <NavTab href="/" num="01" label={t('home')} />
            <NavTab href="/check" num="02" label={t('check')} />
            <NavTab href="/scams" num="03" label={t('scams')} />
            <NavTab href="/laws" num="04" label={t('laws')} />
            <NavTab href="/grievance" num="05" label={t('grievance')} />
            <NavTab href="/helpline" num="06" label={t('helpline')} />
          </div>
        </div>
      </header>
    </>
  );
}

function NavTab({ href, num, label }: { href: string, num: string, label: string }) {
  const pathname = usePathname();
  // Active if exact match, or if it's a sub-route (like /check/sms is active for /check)
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
  
  return (
    <Link 
      href={href} 
      className={`relative px-4 py-4 font-bold text-[0.92rem] whitespace-nowrap transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-ink/60'}`}
    >
      <span className="font-mono text-xs opacity-60 mr-1.5">{num}</span>
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-marigold-deep rounded-t-full"></span>
      )}
    </Link>
  );
}
