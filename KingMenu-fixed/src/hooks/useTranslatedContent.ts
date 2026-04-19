import { useTranslation } from 'react-i18next';
import { getTranslatedContent, getTranslatedDish, getTranslatedCuisine } from '../data/translatedMockData';
import { getTranslatedIngredientName, getTranslatedCategoryName } from '../data/translatedIngredientCategories';

export const useTranslatedContent = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const translateContent = (content: any, fallback: string = '') => {
    return getTranslatedContent(content, currentLanguage, fallback);
  };

  const translateDish = (dish: any) => {
    return getTranslatedDish(dish, currentLanguage);
  };

  const translateCuisine = (cuisine: any) => {
    return getTranslatedCuisine(cuisine, currentLanguage);
  };

  const translateIngredientName = (categoryId: string, ingredientName: string) => {
    return getTranslatedIngredientName(categoryId, ingredientName, currentLanguage);
  };

  const translateCategoryName = (categoryId: string) => {
    return getTranslatedCategoryName(categoryId, currentLanguage);
  };

  const translateDifficulty = (difficulty: string) => {
    const difficultyTranslations: Record<string, Record<string, string>> = {
      'Easy': {
        en: 'Easy',
        fr: 'Facile',
        ar: 'سهل',
        es: 'Fácil',
        it: 'Facile'
      },
      'Medium': {
        en: 'Medium',
        fr: 'Moyen',
        ar: 'متوسط',
        es: 'Medio',
        it: 'Medio'
      },
      'Hard': {
        en: 'Hard',
        fr: 'Difficile',
        ar: 'صعب',
        es: 'Difícil',
        it: 'Difficile'
      }
    };

    return difficultyTranslations[difficulty]?.[currentLanguage] || difficulty;
  };

  const translateUnit = (unit: string) => {
    const unitTranslations: Record<string, Record<string, string>> = {
      'g': {
        en: 'g',
        fr: 'g',
        ar: 'غ',
        es: 'g',
        it: 'g'
      },
      'kg': {
        en: 'kg',
        fr: 'kg',
        ar: 'كغ',
        es: 'kg',
        it: 'kg'
      },
      'ml': {
        en: 'ml',
        fr: 'ml',
        ar: 'مل',
        es: 'ml',
        it: 'ml'
      },
      'l': {
        en: 'l',
        fr: 'l',
        ar: 'لتر',
        es: 'l',
        it: 'l'
      },
      'cup': {
        en: 'cup',
        fr: 'tasse',
        ar: 'كوب',
        es: 'taza',
        it: 'tazza'
      },
      'cups': {
        en: 'cups',
        fr: 'tasses',
        ar: 'أكواب',
        es: 'tazas',
        it: 'tazze'
      },
      'tbsp': {
        en: 'tbsp',
        fr: 'c. à s.',
        ar: 'م.ك',
        es: 'cda',
        it: 'cucchiaio'
      },
      'tsp': {
        en: 'tsp',
        fr: 'c. à c.',
        ar: 'م.ص',
        es: 'cdta',
        it: 'cucchiaino'
      },
      'piece': {
        en: 'piece',
        fr: 'pièce',
        ar: 'قطعة',
        es: 'pieza',
        it: 'pezzo'
      },
      'pieces': {
        en: 'pieces',
        fr: 'pièces',
        ar: 'قطع',
        es: 'piezas',
        it: 'pezzi'
      }
    };

    return unitTranslations[unit]?.[currentLanguage] || unit;
  };

  const translateTag = (tag: string) => {
    return t(`tags.${tag}`, tag);
  };

  return {
    currentLanguage,
    translateContent,
    translateDish,
    translateCuisine,
    translateIngredientName,
    translateCategoryName,
    translateDifficulty,
    translateUnit,
    translateTag
  };
};
