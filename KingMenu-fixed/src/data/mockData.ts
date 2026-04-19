import { Dish, CuisineType } from '../types';

export const cuisineTypes: CuisineType[] = [
  { id: '1', name: 'Italian', icon: '🍝', color: '#E63946' },
  { id: '2', name: 'Asian', icon: '🍜', color: '#457B9D' },
  { id: '3', name: 'French', icon: '🥐', color: '#F77F00' },
  { id: '4', name: 'Mexican', icon: '🌮', color: '#FCBF49' },
  { id: '5', name: 'Indian', icon: '🍛', color: '#F72585' },
  { id: '6', name: 'Mediterranean', icon: '🫒', color: '#4361EE' },
  { id: '7', name: 'American', icon: '🍔', color: '#F72585' },
  { id: '8', name: 'Vegan', icon: '🥗', color: '#43AA8B' },
];

export const mockDishes: Dish[] = [
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
    ingredients: [
      { id: '1', name: 'Spaghetti', amount: '400', unit: 'g', category: 'pasta' },
      { id: '2', name: 'Eggs', amount: '4', unit: 'pieces', category: 'dairy' },
      { id: '3', name: 'Pancetta', amount: '150', unit: 'g', category: 'meat' },
      { id: '4', name: 'Parmesan cheese', amount: '100', unit: 'g', category: 'dairy' },
      { id: '5', name: 'Black pepper', amount: '1', unit: 'tsp', category: 'spices' },
    ],
    instructions: [
      'Cook spaghetti according to package instructions',
      'Fry pancetta until crispy',
      'Beat eggs with parmesan and pepper',
      'Combine hot pasta with egg mixture',
      'Serve immediately'
    ]
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
    ingredients: [
      { id: '6', name: 'Chicken breast', amount: '300', unit: 'g', category: 'meat' },
      { id: '7', name: 'Rice', amount: '200', unit: 'g', category: 'grains' },
      { id: '8', name: 'Soy sauce', amount: '3', unit: 'tbsp', category: 'condiments' },
      { id: '9', name: 'Honey', amount: '2', unit: 'tbsp', category: 'sweeteners' },
      { id: '10', name: 'Broccoli', amount: '200', unit: 'g', category: 'vegetables' },
    ],
    instructions: [
      'Cook rice according to package instructions',
      'Season and cook chicken breast',
      'Steam broccoli until tender',
      'Make teriyaki sauce with soy sauce and honey',
      'Serve chicken over rice with vegetables'
    ]
  },
  {
    id: '3',
    title: 'Mediterranean Quinoa Salad',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'Mediterranean',
    cookingTime: 20,
    rating: 4.7,
    difficulty: 'Easy',
    servings: 4,
    calories: 320,
    tags: ['healthy', 'vegan', 'fresh'],
    ingredients: [
      { id: '11', name: 'Quinoa', amount: '200', unit: 'g', category: 'grains' },
      { id: '12', name: 'Cherry tomatoes', amount: '250', unit: 'g', category: 'vegetables' },
      { id: '13', name: 'Cucumber', amount: '1', unit: 'piece', category: 'vegetables' },
      { id: '14', name: 'Feta cheese', amount: '150', unit: 'g', category: 'dairy' },
      { id: '15', name: 'Olive oil', amount: '3', unit: 'tbsp', category: 'oils' },
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Chop vegetables into bite-sized pieces',
      'Crumble feta cheese',
      'Mix all ingredients with olive oil',
      'Season with salt and pepper'
    ]
  },
  {
    id: '4',
    title: 'Beef Tacos',
    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'Mexican',
    cookingTime: 25,
    rating: 4.5,
    difficulty: 'Easy',
    servings: 4,
    calories: 380,
    tags: ['spicy', 'meat', 'quick'],
    ingredients: [
      { id: '16', name: 'Ground beef', amount: '500', unit: 'g', category: 'meat' },
      { id: '17', name: 'Taco shells', amount: '8', unit: 'pieces', category: 'bread' },
      { id: '18', name: 'Lettuce', amount: '1', unit: 'head', category: 'vegetables' },
      { id: '19', name: 'Tomatoes', amount: '2', unit: 'pieces', category: 'vegetables' },
      { id: '20', name: 'Cheddar cheese', amount: '100', unit: 'g', category: 'dairy' },
    ],
    instructions: [
      'Brown ground beef with taco seasoning',
      'Warm taco shells',
      'Chop lettuce and tomatoes',
      'Grate cheese',
      'Assemble tacos with desired toppings'
    ]
  },
  {
    id: '5',
    title: 'Chicken Curry',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'Indian',
    cookingTime: 45,
    rating: 4.9,
    difficulty: 'Medium',
    servings: 6,
    calories: 420,
    tags: ['spicy', 'aromatic', 'comfort'],
    ingredients: [
      { id: '21', name: 'Chicken thighs', amount: '800', unit: 'g', category: 'meat' },
      { id: '22', name: 'Coconut milk', amount: '400', unit: 'ml', category: 'dairy' },
      { id: '23', name: 'Onions', amount: '2', unit: 'pieces', category: 'vegetables' },
      { id: '24', name: 'Curry powder', amount: '2', unit: 'tbsp', category: 'spices' },
      { id: '25', name: 'Basmati rice', amount: '300', unit: 'g', category: 'grains' },
    ],
    instructions: [
      'Sauté onions until golden',
      'Add curry powder and cook for 1 minute',
      'Add chicken and brown on all sides',
      'Pour in coconut milk and simmer',
      'Serve over basmati rice'
    ]
  },
  {
    id: '6',
    title: 'Caesar Salad',
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    cuisine: 'American',
    cookingTime: 15,
    rating: 4.4,
    difficulty: 'Easy',
    servings: 2,
    calories: 280,
    tags: ['fresh', 'classic', 'light'],
    ingredients: [
      { id: '26', name: 'Romaine lettuce', amount: '2', unit: 'heads', category: 'vegetables' },
      { id: '27', name: 'Croutons', amount: '100', unit: 'g', category: 'bread' },
      { id: '28', name: 'Parmesan cheese', amount: '50', unit: 'g', category: 'dairy' },
      { id: '29', name: 'Caesar dressing', amount: '4', unit: 'tbsp', category: 'condiments' },
      { id: '30', name: 'Anchovies', amount: '4', unit: 'pieces', category: 'seafood' },
    ],
    instructions: [
      'Wash and chop romaine lettuce',
      'Toss lettuce with Caesar dressing',
      'Add croutons and anchovies',
      'Top with grated Parmesan',
      'Serve immediately'
    ]
  }
];