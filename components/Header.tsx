'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/app/i18n/routing';
import Link from 'next/link';
import {
  Menu, X, ChevronDown, ChevronRight, ShieldCheck, Home, ScanSearch,
  BookOpen, Scale, FileWarning, PhoneCall, MessageSquareText, Link2,
  Mail, FileText, Forward, QrCode,
} from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const checkT = useTranslations('check');
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checksOpen, setChecksOpen] = useState(pathname.startsWith('/check'));

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [drawerOpen]);

  const handleLocaleChange = (newLocale: 'en' | 'hi' | 'te') => {
    const nextPath = pathname as Parameters<typeof router.replace>[0];
    router.replace(nextPath, { locale: newLocale });
    setDrawerOpen(false);
  };

  const active = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));
  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/scams', label: t('scams'), icon: ShieldCheck },
    { href: '/laws', label: t('laws'), icon: Scale },
    { href: '/grievance', label: t('grievance'), icon: FileWarning },
    { href: '/helpline', label: t('helpline'), icon: PhoneCall },
  ];
  const toolItems = [
    { href: '/check/sms', label: checkT('smsTitle'), icon: MessageSquareText },
    { href: '/check/link', label: checkT('linkTitle'), icon: QrCode },
    { href: '/check/email', label: checkT('emailTitle'), icon: Mail },
    { href: '/check/pdf', label: checkT('pdfTitle'), icon: FileText },
    { href: '/check/call-forwarding', label: checkT('callTitle'), icon: Forward },
  ];

  return (
    <>
      <div className="bg-ink text-white py-2 text-xs sm:text-sm">
        <div className="page-wrap flex justify-between items-center gap-3">
          <span className="truncate">{t('govtNotice')}</span>
          <a href="tel:1930" className="font-bold text-marigold hover:text-marigold-light transition-colors whitespace-nowrap">
            {t('emergency')}
          </a>
        </div>
      </div>

      <header className="bg-cream/95 backdrop-blur-md border-b border-line sticky top-0 z-50">
        <div className="page-wrap flex items-center justify-between h-[68px] sm:h-[74px] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-line bg-white text-ink hover:bg-cream-dark transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-ink min-w-0">
              <svg className="w-9 h-9 shrink-0" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M20 3 L35 9 V19 C35 28 28.5 34.5 20 37 C11.5 34.5 5 28 5 19 V9 Z" fill="#1B2A4A"/>
                <path d="M13 20 L18 25 L27 14" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span className="truncate">{t('brand')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="nav-pill">
              <button onClick={() => handleLocaleChange('en')} aria-label="English" className="px-2 sm:px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm text-ink/70 hover:bg-line/50 transition-colors">EN</button>
              <button onClick={() => handleLocaleChange('hi')} aria-label="Hindi" className="px-2 sm:px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm text-ink/70 hover:bg-line/50 transition-colors">हिं</button>
              <button onClick={() => handleLocaleChange('te')} aria-label="Telugu" className="px-2 sm:px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm text-ink/70 hover:bg-line/50 transition-colors">తె</button>
            </div>
            <Link href="/grievance" className="btn-danger py-2.5 px-3 sm:px-4 text-sm hidden sm:inline-flex">
              {t('reportCrime')}
            </Link>
          </div>
        </div>

        <nav aria-label="Primary navigation" className="hidden md:block border-t border-line">
          <div className="page-wrap flex gap-1 overflow-x-auto hide-scrollbar">
            <NavTab href="/" num="01" label={t('home')} />
            <NavTab href="/check" num="02" label={t('check')} />
            <NavTab href="/scams" num="03" label={t('scams')} />
            <NavTab href="/laws" num="04" label={t('laws')} />
            <NavTab href="/grievance" num="05" label={t('grievance')} />
            <NavTab href="/helpline" num="06" label={t('helpline')} />
          </div>
        </nav>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-[70]" role="presentation">
          <button aria-label="Close navigation menu" className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col border-r border-line bg-cream shadow-2xl animate-fadein"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-marigold"><ShieldCheck className="h-6 w-6" /></div>
                <div>
                  <div className="font-display font-bold text-ink">{t('brand')}</div>
                  <div className="text-xs text-ink/55">Cyber safety tools</div>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="rounded-xl p-2 hover:bg-cream-dark"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Link href="/" className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-colors ${active('/') ? 'bg-ink text-white' : 'text-ink hover:bg-white'}`}>
                <Home className="h-5 w-5" /> {t('home')}
              </Link>

              <div className={`mb-2 overflow-hidden rounded-xl border ${pathname.startsWith('/check') ? 'border-marigold/60 bg-white' : 'border-line bg-white/70'}`}>
                <button
                  type="button"
                  onClick={() => setChecksOpen((open) => !open)}
                  aria-expanded={checksOpen}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left font-bold text-ink"
                >
                  <ScanSearch className="h-5 w-5 text-marigold-deep" />
                  <span className="flex-1">{t('check')}</span>
                  {checksOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {checksOpen && (
                  <div className="space-y-1 px-2 pb-2">
                    <Link href="/check" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${pathname === '/check' ? 'bg-cream-dark text-ink' : 'text-ink/70 hover:bg-cream'}`}>
                      <ScanSearch className="h-4 w-4" /> All security tools
                    </Link>
                    {toolItems.map(({ href, label, icon: Icon }) => (
                      <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${active(href) ? 'bg-cream-dark text-ink' : 'text-ink/70 hover:bg-cream'}`}>
                        <Icon className="h-4 w-4 shrink-0" /> <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navItems.slice(1).map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-colors ${active(href) ? 'bg-ink text-white' : 'text-ink hover:bg-white'}`}>
                  <Icon className="h-5 w-5" /> <span>{label}</span>
                </Link>
              ))}
              <Link href="/about" className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-colors ${active('/about') ? 'bg-ink text-white' : 'text-ink hover:bg-white'}`}>
                <BookOpen className="h-5 w-5" /> About
              </Link>
            </div>

            <div className="border-t border-line p-4">
              <Link href="/grievance" className="btn-danger w-full justify-center"><FileWarning className="h-4 w-4" /> {t('reportCrime')}</Link>
              <a href="tel:1930" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-safe-light px-4 py-3 font-bold text-safe"><PhoneCall className="h-4 w-4" /> Emergency helpline 1930</a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function NavTab({ href, num, label }: { href: string, num: string, label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
  return (
    <Link href={href} className={`relative px-4 py-4 font-bold text-[0.92rem] whitespace-nowrap transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-ink/60'}`}>
      <span className="font-mono text-xs opacity-60 mr-1.5">{num}</span>
      {label}
      {isActive && <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-marigold-deep rounded-t-full" />}
    </Link>
  );
}
