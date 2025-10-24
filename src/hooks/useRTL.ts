import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function useRTL() {
  const { i18n } = useTranslation();
  
  const isRTL = RTL_LANGUAGES.includes(i18n.language);
  
  useEffect(() => {
    const direction = isRTL ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
    
    // Add/remove RTL class for custom styling
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [isRTL, i18n.language]);
  
  return { isRTL, direction: isRTL ? 'rtl' : 'ltr' };
}