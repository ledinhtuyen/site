import { NextResponse, NextRequest } from 'next/server';
import { i18n } from './i18n/config';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = i18n.locales;

  const cookieLocale = request.cookies.get('NEXT_LOCALE');
  if (cookieLocale && locales.includes(cookieLocale.value as typeof i18n.locales[number])) {
    return cookieLocale.value;
  }

  return match(languages, locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Get the locale from the cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE');
  const locale = getLocale(request);

  // If the pathname is missing a locale, redirect to add it
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // Extract the current locale from the URL path
  const currentLocale = pathname.split('/')[1];

  // If the cookie locale exists and is different from the current URL locale, redirect
  if (cookieLocale && i18n.locales.includes(cookieLocale.value as typeof i18n.locales[number]) && currentLocale !== cookieLocale.value) {
    // Replace the current locale in the path with the cookie locale
    const newPathname = pathname.replace(`/${currentLocale}`, `/${cookieLocale.value}`);
    return NextResponse.redirect(
      new URL(newPathname, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|api-doc|assets|_next/static|_next/image|favicon.ico).*)'],
};
