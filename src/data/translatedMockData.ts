import { Dish, CuisineType } from '../types';

export const translatedCuisineTypes: CuisineType[] = [
  { 
    id: '1', 
    name: 'Italian', 
    icon: '🍝', 
    color: '#E63946',
    translations: {
      en: 'Italian',
      fr: 'Italienne',
      ar: 'إيطالية',
      es: 'Italiana',
      it: 'Italiana'
    }
  },
  { 
    id: '2', 
    name: 'Asian', 
    icon: '🍜', 
    color: '#457B9D',
    translations: {
      en: 'Asian',
      fr: 'Asiatique',
      ar: 'آسيوية',
      es: 'Asiática',
      it: 'Asiatica'
    }
  },
  { 
    id: '3', 
    name: 'French', 
    icon: '🥐', 
    color: '#F77F00',
    translations: {
      en: 'French',
      fr: 'Française',
      ar: 'فرنسية',
      es: 'Francesa',
      it: 'Francese'
    }
  },
  { 
    id: '4', 
    name: 'Mexican', 
    icon: '🌮', 
    color: '#FCBF49',
    translations: {
      en: 'Mexican',
      fr: 'Mexicaine',
      ar: 'مكسيكية',
      es: 'Mexicana',
      it: 'Messicana'
    }
  },
  { 
    id: '5', 
    name: 'Indian', 
    icon: '🍛', 
    color: '#F72585',
    translations: {
      en: 'Indian',
      fr: 'Indienne',
      ar: 'هندية',
      es: 'India',
      it: 'Indiana'
    }
  },
  { 
    id: '6', 
    name: 'Mediterranean', 
    icon: '🫒', 
    color: '#4361EE',
    translations: {
      en: 'Mediterranean',
      fr: 'Méditerranéenne',
      ar: 'متوسطية',
      es: 'Mediterránea',
      it: 'Mediterranea'
    }
  },
  { 
    id: '7', 
    name: 'American', 
    icon: '🍔', 
    color: '#F72585',
    translations: {
      en: 'American',
      fr: 'Américaine',
      ar: 'أمريكية',
      es: 'Americana',
      it: 'Americana'
    }
  },
  { 
    id: '8', 
    name: 'Vegan', 
    icon: '🥗', 
    color: '#43AA8B',
    translations: {
      en: 'Vegan',
      fr: 'Végétalienne',
      ar: 'نباتية',
      es: 'Vegana',
      it: 'Vegana'
    }
  },
];

export const translatedMockDishes: Dish[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'Italian',
    cookingTime: 25,
    rating: 4.8,
    difficulty: 'Medium',
    servings: 4,
    calories: 520,
    tags: ['pasta', 'creamy', 'classic'],
    translations: {
      title: {
        en: 'Spaghetti Carbonara',
        fr: 'Spaghetti à la Carbonara',
        ar: 'سباغيتي كاربونارا',
        es: 'Espaguetis a la Carbonara',
        it: 'Spaghetti alla Carbonara'
      },
      description: {
        en: 'Classic Italian pasta with eggs, cheese, and pancetta',
        fr: 'Pâtes italiennes classiques aux œufs, fromage et pancetta',
        ar: 'معكرونة إيطالية كلاسيكية بالبيض والجبن والبانشيتا',
        es: 'Pasta italiana clásica con huevos, queso y panceta',
        it: 'Pasta italiana classica con uova, formaggio e pancetta'
      },
      cuisine: {
        en: 'Italian',
        fr: 'Italienne',
        ar: 'إيطالية',
        es: 'Italiana',
        it: 'Italiana'
      }
    },
    ingredients: [
      { 
        id: '1', 
        name: 'Spaghetti', 
        amount: '400', 
        unit: 'g', 
        category: 'pasta',
        translations: {
          name: {
            en: 'Spaghetti',
            fr: 'Spaghetti',
            ar: 'سباغيتي',
            es: 'Espaguetis',
            it: 'Spaghetti'
          },
          unit: {
            en: 'g',
            fr: 'g',
            ar: 'غ',
            es: 'g',
            it: 'g'
          }
        }
      },
      { 
        id: '2', 
        name: 'Eggs', 
        amount: '4', 
        unit: 'pieces', 
        category: 'dairy',
        translations: {
          name: {
            en: 'Eggs',
            fr: 'Œufs',
            ar: 'بيض',
            es: 'Huevos',
            it: 'Uova'
          },
          unit: {
            en: 'pieces',
            fr: 'pièces',
            ar: 'قطع',
            es: 'piezas',
            it: 'pezzi'
          }
        }
      },
      { 
        id: '3', 
        name: 'Pancetta', 
        amount: '150', 
        unit: 'g', 
        category: 'meat',
        translations: {
          name: {
            en: 'Pancetta',
            fr: 'Pancetta',
            ar: 'بانشيتا',
            es: 'Panceta',
            it: 'Pancetta'
          },
          unit: {
            en: 'g',
            fr: 'g',
            ar: 'غ',
            es: 'g',
            it: 'g'
          }
        }
      },
      { 
        id: '4', 
        name: 'Parmesan cheese', 
        amount: '100', 
        unit: 'g', 
        category: 'dairy',
        translations: {
          name: {
            en: 'Parmesan cheese',
            fr: 'Fromage parmesan',
            ar: 'جبن البارميزان',
            es: 'Queso parmesano',
            it: 'Parmigiano Reggiano'
          },
          unit: {
            en: 'g',
            fr: 'g',
            ar: 'غ',
            es: 'g',
            it: 'g'
          }
        }
      },
      { 
        id: '5', 
        name: 'Black pepper', 
        amount: '1', 
        unit: 'tsp', 
        category: 'spices',
        translations: {
          name: {
            en: 'Black pepper',
            fr: 'Poivre noir',
            ar: 'فلفل أسود',
            es: 'Pimienta negra',
            it: 'Pepe nero'
          },
          unit: {
            en: 'tsp',
            fr: 'c. à c.',
            ar: 'م.ص',
            es: 'cdta',
            it: 'cucchiaino'
          }
        }
      },
    ],
    instructions: [
      'Cook spaghetti according to package instructions',
      'Fry pancetta until crispy',
      'Beat eggs with parmesan and pepper',
      'Combine hot pasta with egg mixture',
      'Serve immediately'
    ],
    instructionTranslations: {
      en: [
        'Cook spaghetti according to package instructions',
        'Fry pancetta until crispy',
        'Beat eggs with parmesan and pepper',
        'Combine hot pasta with egg mixture',
        'Serve immediately'
      ],
      fr: [
        'Cuire les spaghetti selon les instructions de l\'emballage',
        'Faire frire la pancetta jusqu\'à ce qu\'elle soit croustillante',
        'Battre les œufs avec le parmesan et le poivre',
        'Mélanger les pâtes chaudes avec le mélange d\'œufs',
        'Servir immédiatement'
      ],
      ar: [
        'اطبخ السباغيتي حسب تعليمات العبوة',
        'اقلي البانشيتا حتى تصبح مقرمشة',
        'اخفق البيض مع البارميزان والفلفل',
        'امزج المعكرونة الساخنة مع خليط البيض',
        'قدم فوراً'
      ],
      es: [
        'Cocinar los espaguetis según las instrucciones del paquete',
        'Freír la panceta hasta que esté crujiente',
        'Batir los huevos con parmesano y pimienta',
        'Combinar la pasta caliente con la mezcla de huevos',
        'Servir inmediatamente'
      ],
      it: [
        'Cuocere gli spaghetti secondo le istruzioni della confezione',
        'Friggere la pancetta fino a renderla croccante',
        'Sbattere le uova con parmigiano e pepe',
        'Unire la pasta calda al composto di uova',
        'Servire immediatamente'
      ]
    }
  },
  {
    id: '2',
    title: 'Chicken Teriyaki Bowl',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'Asian',
    cookingTime: 30,
    rating: 4.6,
    difficulty: 'Easy',
    servings: 2,
    calories: 450,
    tags: ['healthy', 'rice', 'chicken'],
    translations: {
      title: {
        en: 'Chicken Teriyaki Bowl',
        fr: 'Bol de Poulet Teriyaki',
        ar: 'وعاء دجاج تيرياكي',
        es: 'Bowl de Pollo Teriyaki',
        it: 'Ciotola di Pollo Teriyaki'
      },
      description: {
        en: 'Tender chicken glazed with teriyaki sauce over rice',
        fr: 'Poulet tendre glacé à la sauce teriyaki sur riz',
        ar: 'دجاج طري مغطى بصلصة التيرياكي على الأرز',
        es: 'Pollo tierno glaseado con salsa teriyaki sobre arroz',
        it: 'Pollo tenero glassato con salsa teriyaki su riso'
      },
      cuisine: {
        en: 'Asian',
        fr: 'Asiatique',
        ar: 'آسيوية',
        es: 'Asiática',
        it: 'Asiatica'
      }
    },
    ingredients: [
      { 
        id: '6', 
        name: 'Chicken breast', 
        amount: '300', 
        unit: 'g', 
        category: 'meat',
        translations: {
          name: {
            en: 'Chicken breast',
            fr: 'Blanc de poulet',
            ar: 'صدر دجاج',
            es: 'Pechuga de pollo',
            it: 'Petto di pollo'
          },
          unit: {
            en: 'g',
            fr: 'g',
            ar: 'غ',
            es: 'g',
            it: 'g'
          }
        }
      },
      { 
        id: '7', 
        name: 'Rice', 
        amount: '200', 
        unit: 'g', 
        category: 'grains',
        translations: {
          name: {
            en: 'Rice',
            fr: 'Riz',
            ar: 'أرز',
            es: 'Arroz',
            it: 'Riso'
          },
          unit: {
            en: 'g',
            fr: 'g',
            ar: 'غ',
            es: 'g',
            it: 'g'
          }
        }
      },
      { 
        id: '8', 
        name: 'Soy sauce', 
        amount: '3', 
        unit: 'tbsp', 
        category: 'condiments',
        translations: {
          name: {
            en: 'Soy sauce',
            fr: 'Sauce soja',
            ar: 'صلصة الصويا',
            es: 'Salsa de soja',
            it: 'Salsa di soia'
          },
          unit: {
            en: 'tbsp',
            fr: 'c. à s.',
            ar: 'م.ك',
            es: 'cda',
            it: 'cucchiaio'
          }
        }
      },
      { 
        id: '9', 
        name: 'Honey', 
        amount: '2', 
        unit: 'tbsp', 
        category: 'sweeteners',
        translations: {
          name: {
            en: 'Honey',
            fr: 'Miel',
            ar: 'عسل',
            es: 'Miel',
            it: 'Miele'
          },
          unit: {
            en: 'tbsp',
            fr: 'c. à s.',
            ar: 'م.ك',
            es: 'cda',
            it: 'cucchiaio'
          }
        }
      },
      { 
        id: '10', 
        name: 'Broccoli', 
        amount: '200', 
        unit: 'g', 
        category: 'vegetables',
        translations: {
          name: {
            en: 'Broccoli',
            fr: 'Brocoli',
            ar: 'بروكلي',
            es: 'Brócoli',
            it: 'Broccoli'
          },
          unit: {
            en: 'g',
            fr: 'g',
            ar: 'غ',
            es: 'g',
            it: 'g'
          }
        }
      },
    ],
    instructions: [
      'Cook rice according to package instructions',
      'Season and cook chicken breast',
      'Steam broccoli until tender',
      'Make teriyaki sauce with soy sauce and honey',
      'Serve chicken over rice with vegetables'
    ],
    instructionTranslations: {
      en: [
        'Cook rice according to package instructions',
        'Season and cook chicken breast',
        'Steam broccoli until tender',
        'Make teriyaki sauce with soy sauce and honey',
        'Serve chicken over rice with vegetables'
      ],
      fr: [
        'Cuire le riz selon les instructions de l\'emballage',
        'Assaisonner et cuire le blanc de poulet',
        'Cuire le brocoli à la vapeur jusqu\'à tendreté',
        'Préparer la sauce teriyaki avec sauce soja et miel',
        'Servir le poulet sur le riz avec les légumes'
      ],
      ar: [
        'اطبخ الأرز حسب تعليمات العبوة',
        'تبل واطبخ صدر الدجاج',
        'اطبخ البروكلي بالبخار حتى ينضج',
        'حضر صلصة التيرياكي بصلصة الصويا والعسل',
        'قدم الدجاج على الأرز مع الخضار'
      ],
      es: [
        'Cocinar el arroz según las instrucciones del paquete',
        'Sazonar y cocinar la pechuga de pollo',
        'Cocinar el brócoli al vapor hasta que esté tierno',
        'Hacer salsa teriyaki con salsa de soja y miel',
        'Servir el pollo sobre arroz con verduras'
      ],
      it: [
        'Cuocere il riso secondo le istruzioni della confezione',
        'Condire e cuocere il petto di pollo',
        'Cuocere i broccoli al vapore fino a renderli teneri',
        'Preparare la salsa teriyaki con salsa di soia e miele',
        'Servire il pollo sul riso con le verdure'
      ]
    }
  }
];

// Helper function to get translated content
export const getTranslatedContent = (content: any, language: string, fallback: string = '') => {
  if (typeof content === 'string') return content;
  if (content?.translations?.[language]) return content.translations[language];
  if (content?.[language]) return content[language];
  if (content?.translations?.en) return content.translations.en;
  if (content?.en) return content.en;
  return fallback;
};

// Helper function to get translated dish
export const getTranslatedDish = (dish: any, language: string) => {
  return {
    ...dish,
    title: getTranslatedContent(dish.translations?.title || dish.title, language, dish.title),
    description: getTranslatedContent(dish.translations?.description, language, ''),
    cuisine: getTranslatedContent(dish.translations?.cuisine || dish.cuisine, language, dish.cuisine),
    instructions: dish.instructionTranslations?.[language] || dish.instructions || [],
    ingredients: dish.ingredients?.map((ingredient: any) => ({
      ...ingredient,
      name: getTranslatedContent(ingredient.translations?.name || ingredient.name, language, ingredient.name),
      unit: getTranslatedContent(ingredient.translations?.unit || ingredient.unit, language, ingredient.unit)
    })) || []
  };
};

// Helper function to get translated cuisine
export const getTranslatedCuisine = (cuisine: any, language: string) => {
  return {
    ...cuisine,
    name: getTranslatedContent(cuisine.translations || cuisine.name, language, cuisine.name)
  };
};