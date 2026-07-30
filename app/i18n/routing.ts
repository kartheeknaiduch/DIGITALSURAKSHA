import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'hi', 'te'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/check': '/check',
    '/check/sms': '/check/sms',
    '/check/link': '/check/link',
    '/check/pdf': '/check/pdf',
    '/check/call-forwarding': '/check/call-forwarding',
    '/check/email': '/check/email',
    '/scams': '/scams',
    '/scams/[slug]': '/scams/[slug]',
    '/laws': '/laws',
    '/laws/[category]': '/laws/[category]',
    '/grievance': '/grievance',
    '/grievance/[track]': '/grievance/[track]',
    '/helpline': '/helpline',
    '/about': '/about',
  }
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
