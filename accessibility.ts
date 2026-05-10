import * as axe from 'axe-core';

/**
 * Configures axe-core with the appropriate locale provided in the project context.
 * Supported locales: pt_BR, pt_PT, it, es.
 */
export const setupAccessibilityAudit = async (lang: string) => {
  if (typeof window === 'undefined') return;

  let localeData;
  try {
    switch (lang) {
      case 'pt-BR':
        localeData = await import('../node_modules/axe-core/locales/pt_BR.json');
        break;
      case 'it':
        localeData = await import('../node_modules/axe-core/locales/it.json');
        break;
      case 'es':
        localeData = await import('../node_modules/axe-core/locales/es.json');
        break;
      default:
        return; // Default to English
    }
    axe.configure({ locale: localeData.default || localeData });
  } catch (err) {
    console.error('Failed to load accessibility locale data', err);
  }
};
