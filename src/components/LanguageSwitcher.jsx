'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { i18n } from '@i18n/config';
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { LanguageIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import Cookies from 'js-cookie';

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = pathname.split('/')[1];

  const handleLocaleChange = (locale) => {
    Cookies.set('NEXT_LOCALE', locale, { expires: 365 });
  };

  return (
    <div className="flex bg-white justify-end cursor-pointer">
      <Menu>
        <MenuHandler>
          <LanguageIcon className="h-8 w-8 items-center" />
        </MenuHandler>
        <MenuList>
          {i18n.locales.map((locale) => {
            const newPathname = pathname.replace(currentLocale, locale);
            const queryString = searchParams.toString();
            const href = queryString ? `${newPathname}?${queryString}` : newPathname;

            return (
              <Link
                key={locale}
                href={href}
                className={`w-full ${currentLocale === locale
                  ? 'bg-blue-50 text-blue-500 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => handleLocaleChange(locale)}
              >
                <MenuItem>
                  {t(`language_switcher.options.${locale}`)}
                </MenuItem>
              </Link>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
}
