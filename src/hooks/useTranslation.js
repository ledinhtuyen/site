'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useTranslation() {
  const params = useParams();
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    import(`@i18n/locales/${params.locale}.json`)
      .then((module) => setTranslations(module.default))
      .catch((error) => console.error("Error loading translations:", error));
  }, [params.locale]);

  const interpolate = (str, vars) => {
    return str.replace(/{(\w+)}/g, (_, key) => vars[key] || `{${key}}`);
  };

  const translate = (key, vars = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return typeof value === 'string' ? interpolate(value, vars) : value || key;
  };

  return {
    t: (key, vars = {}) => {
      return translate(key, vars);
    },
    locale: params.locale,
  };
}
