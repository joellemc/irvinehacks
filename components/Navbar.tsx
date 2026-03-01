import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Home, Upload, ShoppingCart } from 'lucide-react';
import { useGrocery } from '../src/app/context/GroceryContext';

export function Navbar() {
  const location = useLocation();
  const { groceries } = useGrocery();
  
  const isActive = (path: string) => location.pathname === path;

  const groceryCount = groceries.filter(g => !g.purchased).length;

  return (
    <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2.5 rounded-xl">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Pantry Pal
              </h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
                ${isActive('/') 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                }
              `}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link
              to="/upload"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
                ${isActive('/upload') 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                }
              `}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Link>
            
            <Link
              to="/groceries"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm relative
                ${isActive('/groceries') 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                }
              `}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Groceries</span>
              {groceryCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {groceryCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
