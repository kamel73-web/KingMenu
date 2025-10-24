import React from 'react';
import DishGrid from '../components/Home/DishGrid';
import SelectedDishesPanel from '../components/Home/SelectedDishesPanel';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <DishGrid />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SelectedDishesPanel />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
