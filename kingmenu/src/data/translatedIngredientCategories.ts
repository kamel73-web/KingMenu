import { IngredientCategory } from '../types';

export const translatedIngredientCategories: IngredientCategory[] = [
  {
    id: '1',
    name: 'Proteins',
    icon: '🥩',
    color: '#E63946',
    translations: {
      name: {
        en: 'Proteins',
        fr: 'Protéines',
        ar: 'البروتينات',
        es: 'Proteínas',
        it: 'Proteine'
      }
    },
    ingredients: [
      'Chicken breast', 'Ground beef', 'Salmon', 'Eggs', 'Tofu', 'Shrimp',
      'Pork chops', 'Turkey', 'Tuna', 'Bacon', 'Ham', 'Chicken thighs',
      'Ground turkey', 'Cod', 'Lamb', 'Beef steak'
    ],
    ingredientTranslations: {
      'Chicken breast': {
        en: 'Chicken breast',
        fr: 'Blanc de poulet',
        ar: 'صدر دجاج',
        es: 'Pechuga de pollo',
        it: 'Petto di pollo'
      },
      'Ground beef': {
        en: 'Ground beef',
        fr: 'Bœuf haché',
        ar: 'لحم بقر مفروم',
        es: 'Carne molida',
        it: 'Carne macinata'
      },
      'Salmon': {
        en: 'Salmon',
        fr: 'Saumon',
        ar: 'سلمون',
        es: 'Salmón',
        it: 'Salmone'
      },
      'Eggs': {
        en: 'Eggs',
        fr: 'Œufs',
        ar: 'بيض',
        es: 'Huevos',
        it: 'Uova'
      },
      'Tofu': {
        en: 'Tofu',
        fr: 'Tofu',
        ar: 'توفو',
        es: 'Tofu',
        it: 'Tofu'
      },
      'Shrimp': {
        en: 'Shrimp',
        fr: 'Crevettes',
        ar: 'جمبري',
        es: 'Camarones',
        it: 'Gamberetti'
      },
      'Pork chops': {
        en: 'Pork chops',
        fr: 'Côtelettes de porc',
        ar: 'قطع لحم خنزير',
        es: 'Chuletas de cerdo',
        it: 'Braciole di maiale'
      },
      'Turkey': {
        en: 'Turkey',
        fr: 'Dinde',
        ar: 'ديك رومي',
        es: 'Pavo',
        it: 'Tacchino'
      },
      'Tuna': {
        en: 'Tuna',
        fr: 'Thon',
        ar: 'تونة',
        es: 'Atún',
        it: 'Tonno'
      },
      'Bacon': {
        en: 'Bacon',
        fr: 'Bacon',
        ar: 'لحم مقدد',
        es: 'Tocino',
        it: 'Pancetta'
      },
      'Ham': {
        en: 'Ham',
        fr: 'Jambon',
        ar: 'لحم خنزير',
        es: 'Jamón',
        it: 'Prosciutto'
      },
      'Chicken thighs': {
        en: 'Chicken thighs',
        fr: 'Cuisses de poulet',
        ar: 'أفخاذ دجاج',
        es: 'Muslos de pollo',
        it: 'Cosce di pollo'
      }
    }
  },
  {
    id: '2',
    name: 'Vegetables',
    icon: '🥕',
    color: '#43AA8B',
    translations: {
      name: {
        en: 'Vegetables',
        fr: 'Légumes',
        ar: 'الخضروات',
        es: 'Verduras',
        it: 'Verdure'
      }
    },
    ingredients: [
      'Onions', 'Tomatoes', 'Bell peppers', 'Carrots', 'Broccoli', 'Spinach',
      'Mushrooms', 'Garlic', 'Potatoes', 'Zucchini', 'Cucumber', 'Lettuce',
      'Celery', 'Green beans', 'Corn', 'Peas', 'Cauliflower', 'Asparagus'
    ],
    ingredientTranslations: {
      'Onions': {
        en: 'Onions',
        fr: 'Oignons',
        ar: 'بصل',
        es: 'Cebollas',
        it: 'Cipolle'
      },
      'Tomatoes': {
        en: 'Tomatoes',
        fr: 'Tomates',
        ar: 'طماطم',
        es: 'Tomates',
        it: 'Pomodori'
      },
      'Bell peppers': {
        en: 'Bell peppers',
        fr: 'Poivrons',
        ar: 'فلفل حلو',
        es: 'Pimientos',
        it: 'Peperoni'
      },
      'Carrots': {
        en: 'Carrots',
        fr: 'Carottes',
        ar: 'جزر',
        es: 'Zanahorias',
        it: 'Carote'
      },
      'Broccoli': {
        en: 'Broccoli',
        fr: 'Brocoli',
        ar: 'بروكلي',
        es: 'Brócoli',
        it: 'Broccoli'
      },
      'Spinach': {
        en: 'Spinach',
        fr: 'Épinards',
        ar: 'سبانخ',
        es: 'Espinacas',
        it: 'Spinaci'
      },
      'Mushrooms': {
        en: 'Mushrooms',
        fr: 'Champignons',
        ar: 'فطر',
        es: 'Champiñones',
        it: 'Funghi'
      },
      'Garlic': {
        en: 'Garlic',
        fr: 'Ail',
        ar: 'ثوم',
        es: 'Ajo',
        it: 'Aglio'
      },
      'Potatoes': {
        en: 'Potatoes',
        fr: 'Pommes de terre',
        ar: 'بطاطس',
        es: 'Papas',
        it: 'Patate'
      },
      'Zucchini': {
        en: 'Zucchini',
        fr: 'Courgettes',
        ar: 'كوسة',
        es: 'Calabacín',
        it: 'Zucchine'
      },
      'Cucumber': {
        en: 'Cucumber',
        fr: 'Concombre',
        ar: 'خيار',
        es: 'Pepino',
        it: 'Cetriolo'
      },
      'Lettuce': {
        en: 'Lettuce',
        fr: 'Laitue',
        ar: 'خس',
        es: 'Lechuga',
        it: 'Lattuga'
      }
    }
  },
  {
    id: '3',
    name: 'Dairy & Eggs',
    icon: '🥛',
    color: '#457B9D',
    translations: {
      name: {
        en: 'Dairy & Eggs',
        fr: 'Produits Laitiers & Œufs',
        ar: 'الألبان والبيض',
        es: 'Lácteos y Huevos',
        it: 'Latticini e Uova'
      }
    },
    ingredients: [
      'Milk', 'Cheese', 'Butter', 'Yogurt', 'Cream', 'Sour cream',
      'Mozzarella', 'Parmesan cheese', 'Cheddar cheese', 'Feta cheese',
      'Cream cheese', 'Heavy cream', 'Eggs'
    ],
    ingredientTranslations: {
      'Milk': {
        en: 'Milk',
        fr: 'Lait',
        ar: 'حليب',
        es: 'Leche',
        it: 'Latte'
      },
      'Cheese': {
        en: 'Cheese',
        fr: 'Fromage',
        ar: 'جبن',
        es: 'Queso',
        it: 'Formaggio'
      },
      'Butter': {
        en: 'Butter',
        fr: 'Beurre',
        ar: 'زبدة',
        es: 'Mantequilla',
        it: 'Burro'
      },
      'Yogurt': {
        en: 'Yogurt',
        fr: 'Yaourt',
        ar: 'زبادي',
        es: 'Yogur',
        it: 'Yogurt'
      },
      'Cream': {
        en: 'Cream',
        fr: 'Crème',
        ar: 'كريمة',
        es: 'Crema',
        it: 'Panna'
      },
      'Sour cream': {
        en: 'Sour cream',
        fr: 'Crème aigre',
        ar: 'كريمة حامضة',
        es: 'Crema agria',
        it: 'Panna acida'
      },
      'Mozzarella': {
        en: 'Mozzarella',
        fr: 'Mozzarella',
        ar: 'موزاريلا',
        es: 'Mozzarella',
        it: 'Mozzarella'
      },
      'Parmesan cheese': {
        en: 'Parmesan cheese',
        fr: 'Fromage parmesan',
        ar: 'جبن البارميزان',
        es: 'Queso parmesano',
        it: 'Parmigiano Reggiano'
      }
    }
  },
  {
    id: '4',
    name: 'Grains & Starches',
    icon: '🌾',
    color: '#F77F00',
    translations: {
      name: {
        en: 'Grains & Starches',
        fr: 'Céréales & Féculents',
        ar: 'الحبوب والنشويات',
        es: 'Granos y Almidones',
        it: 'Cereali e Amidi'
      }
    },
    ingredients: [
      'Rice', 'Pasta', 'Bread', 'Quinoa', 'Oats', 'Flour', 'Potatoes',
      'Sweet potatoes', 'Couscous', 'Barley', 'Bulgur', 'Noodles',
      'Tortillas', 'Crackers', 'Cereal'
    ],
    ingredientTranslations: {
      'Rice': {
        en: 'Rice',
        fr: 'Riz',
        ar: 'أرز',
        es: 'Arroz',
        it: 'Riso'
      },
      'Pasta': {
        en: 'Pasta',
        fr: 'Pâtes',
        ar: 'معكرونة',
        es: 'Pasta',
        it: 'Pasta'
      },
      'Bread': {
        en: 'Bread',
        fr: 'Pain',
        ar: 'خبز',
        es: 'Pan',
        it: 'Pane'
      },
      'Quinoa': {
        en: 'Quinoa',
        fr: 'Quinoa',
        ar: 'كينوا',
        es: 'Quinoa',
        it: 'Quinoa'
      },
      'Oats': {
        en: 'Oats',
        fr: 'Avoine',
        ar: 'شوفان',
        es: 'Avena',
        it: 'Avena'
      },
      'Flour': {
        en: 'Flour',
        fr: 'Farine',
        ar: 'دقيق',
        es: 'Harina',
        it: 'Farina'
      }
    }
  },
  {
    id: '5',
    name: 'Pantry Staples',
    icon: '🏺',
    color: '#F72585',
    translations: {
      name: {
        en: 'Pantry Staples',
        fr: 'Produits de Base',
        ar: 'المواد الأساسية',
        es: 'Productos Básicos',
        it: 'Prodotti Base'
      }
    },
    ingredients: [
      'Olive oil', 'Salt', 'Black pepper', 'Garlic powder', 'Onion powder',
      'Paprika', 'Cumin', 'Oregano', 'Basil', 'Thyme', 'Bay leaves',
      'Cinnamon', 'Vanilla extract', 'Baking powder', 'Baking soda',
      'Sugar', 'Brown sugar', 'Honey', 'Soy sauce', 'Vinegar'
    ],
    ingredientTranslations: {
      'Olive oil': {
        en: 'Olive oil',
        fr: 'Huile d\'olive',
        ar: 'زيت زيتون',
        es: 'Aceite de oliva',
        it: 'Olio d\'oliva'
      },
      'Salt': {
        en: 'Salt',
        fr: 'Sel',
        ar: 'ملح',
        es: 'Sal',
        it: 'Sale'
      },
      'Black pepper': {
        en: 'Black pepper',
        fr: 'Poivre noir',
        ar: 'فلفل أسود',
        es: 'Pimienta negra',
        it: 'Pepe nero'
      },
      'Garlic powder': {
        en: 'Garlic powder',
        fr: 'Poudre d\'ail',
        ar: 'مسحوق الثوم',
        es: 'Ajo en polvo',
        it: 'Aglio in polvere'
      },
      'Paprika': {
        en: 'Paprika',
        fr: 'Paprika',
        ar: 'بابريكا',
        es: 'Pimentón',
        it: 'Paprika'
      },
      'Cumin': {
        en: 'Cumin',
        fr: 'Cumin',
        ar: 'كمون',
        es: 'Comino',
        it: 'Cumino'
      },
      'Oregano': {
        en: 'Oregano',
        fr: 'Origan',
        ar: 'أوريجانو',
        es: 'Orégano',
        it: 'Origano'
      },
      'Basil': {
        en: 'Basil',
        fr: 'Basilic',
        ar: 'ريحان',
        es: 'Albahaca',
        it: 'Basilico'
      }
    }
  },
  {
    id: '6',
    name: 'Fruits',
    icon: '🍎',
    color: '#FCBF49',
    translations: {
      name: {
        en: 'Fruits',
        fr: 'Fruits',
        ar: 'الفواكه',
        es: 'Frutas',
        it: 'Frutta'
      }
    },
    ingredients: [
      'Apples', 'Bananas', 'Oranges', 'Lemons', 'Limes', 'Berries',
      'Grapes', 'Avocados', 'Strawberries', 'Blueberries',
      'Raspberries', 'Pineapple', 'Mango', 'Peaches', 'Pears'
    ],
    ingredientTranslations: {
      'Apples': {
        en: 'Apples',
        fr: 'Pommes',
        ar: 'تفاح',
        es: 'Manzanas',
        it: 'Mele'
      },
      'Bananas': {
        en: 'Bananas',
        fr: 'Bananes',
        ar: 'موز',
        es: 'Plátanos',
        it: 'Banane'
      },
      'Oranges': {
        en: 'Oranges',
        fr: 'Oranges',
        ar: 'برتقال',
        es: 'Naranjas',
        it: 'Arance'
      },
      'Lemons': {
        en: 'Lemons',
        fr: 'Citrons',
        ar: 'ليمون',
        es: 'Limones',
        it: 'Limoni'
      },
      'Limes': {
        en: 'Limes',
        fr: 'Citrons verts',
        ar: 'ليمون أخضر',
        es: 'Limas',
        it: 'Lime'
      },
      'Berries': {
        en: 'Berries',
        fr: 'Baies',
        ar: 'توت',
        es: 'Bayas',
        it: 'Bacche'
      },
      'Grapes': {
        en: 'Grapes',
        fr: 'Raisins',
        ar: 'عنب',
        es: 'Uvas',
        it: 'Uva'
      },
      'Avocados': {
        en: 'Avocados',
        fr: 'Avocats',
        ar: 'أفوكادو',
        es: 'Aguacates',
        it: 'Avocado'
      }
    }
  },
  {
    id: '7',
    name: 'Condiments & Sauces',
    icon: '🍯',
    color: '#4361EE',
    translations: {
      name: {
        en: 'Condiments & Sauces',
        fr: 'Condiments & Sauces',
        ar: 'التوابل والصلصات',
        es: 'Condimentos y Salsas',
        it: 'Condimenti e Salse'
      }
    },
    ingredients: [
      'Ketchup', 'Mustard', 'Mayonnaise', 'Hot sauce', 'BBQ sauce',
      'Worcestershire sauce', 'Teriyaki sauce', 'Ranch dressing',
      'Italian dressing', 'Salsa', 'Pesto', 'Marinara sauce'
    ],
    ingredientTranslations: {
      'Ketchup': {
        en: 'Ketchup',
        fr: 'Ketchup',
        ar: 'كاتشب',
        es: 'Ketchup',
        it: 'Ketchup'
      },
      'Mustard': {
        en: 'Mustard',
        fr: 'Moutarde',
        ar: 'خردل',
        es: 'Mostaza',
        it: 'Senape'
      },
      'Mayonnaise': {
        en: 'Mayonnaise',
        fr: 'Mayonnaise',
        ar: 'مايونيز',
        es: 'Mayonesa',
        it: 'Maionese'
      },
      'Hot sauce': {
        en: 'Hot sauce',
        fr: 'Sauce piquante',
        ar: 'صلصة حارة',
        es: 'Salsa picante',
        it: 'Salsa piccante'
      }
    }
  },
  {
    id: '8',
    name: 'Herbs & Spices',
    icon: '🌿',
    color: '#2A9D8F',
    translations: {
      name: {
        en: 'Herbs & Spices',
        fr: 'Herbes & Épices',
        ar: 'الأعشاب والبهارات',
        es: 'Hierbas y Especias',
        it: 'Erbe e Spezie'
      }
    },
    ingredients: [
      'Fresh basil', 'Fresh parsley', 'Fresh cilantro', 'Fresh dill',
      'Rosemary', 'Sage', 'Mint', 'Chives', 'Ginger', 'Turmeric',
      'Curry powder', 'Chili powder', 'Red pepper flakes'
    ],
    ingredientTranslations: {
      'Fresh basil': {
        en: 'Fresh basil',
        fr: 'Basilic frais',
        ar: 'ريحان طازج',
        es: 'Albahaca fresca',
        it: 'Basilico fresco'
      },
      'Fresh parsley': {
        en: 'Fresh parsley',
        fr: 'Persil frais',
        ar: 'بقدونس طازج',
        es: 'Perejil fresco',
        it: 'Prezzemolo fresco'
      },
      'Fresh cilantro': {
        en: 'Fresh cilantro',
        fr: 'Coriandre fraîche',
        ar: 'كزبرة طازجة',
        es: 'Cilantro fresco',
        it: 'Coriandolo fresco'
      },
      'Ginger': {
        en: 'Ginger',
        fr: 'Gingembre',
        ar: 'زنجبيل',
        es: 'Jengibre',
        it: 'Zenzero'
      },
      'Turmeric': {
        en: 'Turmeric',
        fr: 'Curcuma',
        ar: 'كركم',
        es: 'Cúrcuma',
        it: 'Curcuma'
      }
    }
  }
];

// Helper function to get translated ingredient name
export const getTranslatedIngredientName = (categoryId: string, ingredientName: string, language: string): string => {
  const category = translatedIngredientCategories.find(cat => cat.id === categoryId);
  if (!category?.ingredientTranslations?.[ingredientName]?.[language]) {
    return ingredientName; // Fallback to original name
  }
  return category.ingredientTranslations[ingredientName][language];
};

// Helper function to get translated category name
export const getTranslatedCategoryName = (categoryId: string, language: string): string => {
  const category = translatedIngredientCategories.find(cat => cat.id === categoryId);
  if (!category?.translations?.name?.[language]) {
    return category?.name || 'Unknown Category';
  }
  return category.translations.name[language];
};