import { en } from './en';
import { ml } from './ml';

export type Lang = 'en' | 'ml';

const dictionaries: Record<Lang, Record<string, string>> = { en, ml };

/**
 * Look up a static text key, falling back to English if the key is missing.
 */
export const t = (key: string, lang: Lang): string =>
    dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;

/**
 * Get an AI insight field by name. For Malayalam, tries the `_ml` suffixed key first,
 * then falls back to the English version.
 */
export const aiText = (
    insights: Record<string, any> | undefined,
    field: string,
    lang: Lang,
): string => {
    if (!insights) return '';
    if (lang === 'ml') {
        const mlVal = insights[`${field}_ml`];
        if (mlVal && typeof mlVal === 'string') return mlVal;
    }
    const val = insights[field];
    return typeof val === 'string' ? val : '';
};
