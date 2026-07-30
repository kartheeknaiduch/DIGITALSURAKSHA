import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/app/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Digital Suraksha — Cyber Safety & Grievance Redressal',
  description: 'Scan suspicious messages, links, and files. Learn your rights and file cybercrime complaints.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeValue = locale as (typeof routing.locales)[number];

  if (!routing.locales.includes(localeValue)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
