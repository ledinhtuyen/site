export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'vi', 'ja', 'cn'],
} as const;

export type Locale = (typeof i18n)["locales"][number];
