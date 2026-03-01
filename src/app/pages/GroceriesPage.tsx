import { useGrocery } from '../context/GroceryContext';
import { Trash2, ShoppingBag, Check } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export function GroceriesPage() {
  const { groceries, removeFromGroceries, togglePurchased, clearGroceries } = useGrocery();

  const unpurchasedItems = groceries.filter(g => !g.purchased);
  const purchasedItems = groceries.filter(g => g.purchased);

  return (
    <div className="min-h-screen bg-teal-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-watermelon-200 p-3 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-watermelon-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Grocery List</h1>
                <p className="text-slate-600">
                  {groceries.length} {groceries.length === 1 ? 'item' : 'items'} total
                </p>
              </div>
            </div>
            
            {groceries.length > 0 && (
              <button
                onClick={clearGroceries}
                className="text-sm text-watermelon-600 hover:text-watermelon-700 font-medium px-4 py-2 hover:bg-watermelon-50 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {groceries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-teal-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-slate-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No Items Yet</h2>
              <p className="text-slate-600 mb-6">
                Your grocery list is empty. Browse recipes and add missing ingredients to get started!
              </p>
              <a
                href="/upload"
                className="inline-block bg-watermelon-300 text-watermelon-900 py-3 px-6 rounded-lg hover:bg-watermelon-400 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Find Recipes
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unpurchased Items */}
            {unpurchasedItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  To Buy ({unpurchasedItems.length})
                </h2>
                <div className="space-y-2">
                  {unpurchasedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <button
                        onClick={() => togglePurchased(item.id)}
                        className="flex-shrink-0 w-6 h-6 border-2 border-slate-300 rounded hover:border-celadon-500 transition-colors"
                        aria-label="Mark as purchased"
                      />
                      <span className="flex-1 text-slate-800 font-medium capitalize">
                        {item.name}
                        {item.quantity && (
                          <span className="text-slate-500 text-sm ml-2">({item.quantity})</span>
                        )}
                      </span>
                      <button
                        onClick={() => removeFromGroceries(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchased Items */}
            {purchasedItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Purchased ({purchasedItems.length})
                </h2>
                <div className="space-y-2">
                  {purchasedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-celadon-50 rounded-lg hover:bg-celadon-100 transition-colors group"
                    >
                      <button
                        onClick={() => togglePurchased(item.id)}
                        className="flex-shrink-0 w-6 h-6 bg-celadon-500 rounded flex items-center justify-center hover:bg-celadon-600 transition-colors"
                        aria-label="Mark as unpurchased"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </button>
                      <span className="flex-1 text-slate-500 line-through capitalize">
                        {item.name}
                        {item.quantity && (
                          <span className="text-slate-400 text-sm ml-2">({item.quantity})</span>
                        )}
                      </span>
                      <button
                        onClick={() => removeFromGroceries(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
