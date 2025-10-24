import React from 'react';
import { Heart } from 'lucide-react';

export default function FavoritesView() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          Favorites Coming Soon
        </h2>
        <p className="text-gray-600 font-body mb-6">
          We're working on adding the ability to save your favorite dishes and recipes.
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