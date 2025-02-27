'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Translations {
  [key: string]: string | Translations;
}

export function useTranslation() {
  const params = useParams();
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    import(`@i18n/locales/${params.locale}.json`)
      .then((module) => setTranslations(module.default))
      .catch((error) => console.error("Error loading translations:", error));
  }, [params.locale]);

  const interpolate = (str: string, vars: { [key: string]: string }) => {
    return str.replace(/{(\w+)}/g, (_, key) => vars[key] || `{${key}}`);
  };

  const translate = (key: string, vars: { [key: string]: string } = {}) => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return typeof value === 'string' ? interpolate(value, vars) : value || key;
  };

  return {
    t: (key: string, vars: { [key: string]: string } = {}) => {
      return translate(key, vars);
    },
    locale: params.locale,
  };
}
