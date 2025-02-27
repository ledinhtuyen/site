import { NextResponse } from 'next/server';
import { i18n } from './i18n/config';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request) {
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = i18n.locales;

  const cookieLocale = request.cookies.get('NEXT_LOCALE');
  if (cookieLocale && locales.includes(cookieLocale.value)) {
    return cookieLocale.value;
  }

  return match(languages, locales, i18n.defaultLocale);
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|api-doc|assets|_next/static|_next/image|favicon.ico).*)'],
};
