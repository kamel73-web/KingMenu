import React, { useState } from 'react';
import { ChefHat, Clock, Users, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RecipeViewer from '../components/Recipe/RecipeViewer';
import CookModeModal from '../components/Recipe/CookModeModal';
import { Dish } from '../types';

export default function MyRecipesPage() {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [cookModeDish, setCookModeDish] = useState<Dish | null>(null);

  const filteredDishes = state.selectedDishes.filter(dish => {
    const matchesSearch = dish.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || dish.cuisine === selectedCuisine;
    
    return matchesSearch && matchesCuisine;
  });

  const cuisines = [...new Set(state.selectedDishes.map(dish => dish.cuisine))];

  if (state.selectedDishes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            No Recipes Selected
          </h2>
          <p className="text-gray-600 font-body mb-6">
            Add some dishes to your menu to access their recipes here
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
          >
            Browse Dishes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              My Recipes
            </h1>
            <p className="text-gray-600 font-body">
              {state.selectedDishes.length} recipes ready to cook
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4 md:mt-0">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className="font-body">
                {state.selectedDishes.reduce((total, dish) => total + dish.cookingTime, 0)}m total
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="font-body">
                {state.selectedDishes.reduce((total, dish) => total + dish.servings, 0)} servings
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Cuisine Filter */}
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Cuisines</option>
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recipe Grid */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map(dish => (
            <div key={dish.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
              <img
                src={dish.image}
                alt={dish.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">
                  {dish.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{dish.cookingTime}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{dish.servings} servings</span>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {dish.difficulty}
                  </span>
                </div>
                <button
                  onClick={() => setCookModeDish(dish)}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-all flex items-center justify-center space-x-2"
                >
                  <ChefHat className="h-4 w-4" />
                  <span className="font-body font-medium">Start Cooking</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-600 font-body">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Recipe Viewer */}
      <RecipeViewer
        dishes={filteredDishes}
        onEnterCookMode={(dish) => setCookModeDish(dish)}
      />

      {/* Cook Mode Modal */}
      {cookModeDish && (
        <CookModeModal
          dish={cookModeDish}
          isOpen={!!cookModeDish}
          onClose={() => setCookModeDish(null)}
        />
      )}
    </div>
  );
}