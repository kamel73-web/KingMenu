import { IngredientCategory } from '../types';

export const ingredientCategories: IngredientCategory[] = [
  {
    id: '1',
    name: 'Proteins',
    icon: '🥩',
    color: '#E63946',
    ingredients: [
      'Chicken breast', 'Ground beef', 'Salmon', 'Eggs', 'Tofu', 'Shrimp',
      'Pork chops', 'Turkey', 'Tuna', 'Bacon', 'Ham', 'Chicken thighs',
      'Ground turkey', 'Cod', 'Lamb', 'Beef steak'
    ]
  },
  {
    id: '2',
    name: 'Vegetables',
    icon: '🥕',
    color: '#43AA8B',
    ingredients: [
      'Onions', 'Tomatoes', 'Bell peppers', 'Carrots', 'Broccoli', 'Spinach',
      'Mushrooms', 'Garlic', 'Potatoes', 'Zucchini', 'Cucumber', 'Lettuce',
      'Celery', 'Green beans', 'Corn', 'Peas', 'Cauliflower', 'Asparagus'
    ]
  },
  {
    id: '3',
    name: 'Dairy & Eggs',
    icon: '🥛',
    color: '#457B9D',
    ingredients: [
      'Milk', 'Cheese', 'Butter', 'Yogurt', 'Cream', 'Sour cream',
      'Mozzarella', 'Parmesan cheese', 'Cheddar cheese', 'Feta cheese',
      'Cream cheese', 'Heavy cream', 'Eggs'
    ]
  },
  {
    id: '4',
    name: 'Grains & Starches',
    icon: '🌾',
    color: '#F77F00',
    ingredients: [
      'Rice', 'Pasta', 'Bread', 'Quinoa', 'Oats', 'Flour', 'Potatoes',
      'Sweet potatoes', 'Couscous', 'Barley', 'Bulgur', 'Noodles',
      'Tortillas', 'Crackers', 'Cereal'
    ]
  },
  {
    id: '5',
    name: 'Pantry Staples',
    icon: '🏺',
    color: '#F72585',
    ingredients: [
      'Olive oil', 'Salt', 'Black pepper', 'Garlic powder', 'Onion powder',
      'Paprika', 'Cumin', 'Oregano', 'Basil', 'Thyme', 'Bay leaves',
      'Cinnamon', 'Vanilla extract', 'Baking powder', 'Baking soda',
      'Sugar', 'Brown sugar', 'Honey', 'Soy sauce', 'Vinegar'
    ]
  },
  {
    id: '6',
    name: 'Fruits',
    icon: '🍎',
    color: '#FCBF49',
    ingredients: [
      'Apples', 'Bananas', 'Oranges', 'Lemons', 'Limes', 'Berries',
      'Grapes', 'Avocados', 'Tomatoes', 'Strawberries', 'Blueberries',
      'Raspberries', 'Pineapple', 'Mango', 'Peaches', 'Pears'
    ]
  },
  {
    id: '7',
    name: 'Condiments & Sauces',
    icon: '🍯',
    color: '#4361EE',
    ingredients: [
      'Ketchup', 'Mustard', 'Mayonnaise', 'Hot sauce', 'BBQ sauce',
      'Worcestershire sauce', 'Teriyaki sauce', 'Ranch dressing',
      'Italian dressing', 'Salsa', 'Pesto', 'Marinara sauce'
    ]
  },
  {
    id: '8',
    name: 'Herbs & Spices',
    icon: '🌿',
    color: '#2A9D8F',
    ingredients: [
      'Fresh basil', 'Fresh parsley', 'Fresh cilantro', 'Fresh dill',
      'Rosemary', 'Sage', 'Mint', 'Chives', 'Ginger', 'Turmeric',
      'Curry powder', 'Chili powder', 'Red pepper flakes'
    ]
  }
];

export const commonIngredients = [
  'Salt', 'Black pepper', 'Olive oil', 'Garlic', 'Onions', 'Eggs',
  'Butter', 'Flour', 'Sugar', 'Milk', 'Tomatoes', 'Cheese'
];