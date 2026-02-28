import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChefHat, Upload as UploadIcon, Search, Sparkles } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-14 h-14 text-orange-600" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Welcome to <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Fridge to Fork</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Turn your fridge ingredients into delicious meals. Upload a photo, discover recipes, and never waste food again!
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 px-8 rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            <UploadIcon className="w-5 h-5" />
            Get Started
          </Link>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-4 rounded-xl mb-3">
                <UploadIcon className="w-8 h-8 text-orange-600 mx-auto" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Upload Photo</h3>
              <p className="text-sm text-slate-600">
                Take a clear photo of your fridge or pantry ingredients
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-4 rounded-xl mb-3">
                <Search className="w-8 h-8 text-orange-600 mx-auto" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">AI Detection</h3>
              <p className="text-sm text-slate-600">
                Our AI scans and identifies your ingredients automatically
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-4 rounded-xl mb-3">
                <Sparkles className="w-8 h-8 text-orange-600 mx-auto" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Set Preferences</h3>
              <p className="text-sm text-slate-600">
                Choose cuisine, skill level, time, budget, and meal type
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-4 rounded-xl mb-3">
                <ChefHat className="w-8 h-8 text-orange-600 mx-auto" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Cook & Enjoy</h3>
              <p className="text-sm text-slate-600">
                Get personalized recipes and start cooking delicious meals
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Smart Matching</h3>
            <p className="text-sm text-slate-600">
              Get recipes ranked by how many ingredients you already have
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Grocery List</h3>
            <p className="text-sm text-slate-600">
              Missing ingredients? Add them to your grocery list with one click
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ChefHat className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Detailed Recipes</h3>
            <p className="text-sm text-slate-600">
              Step-by-step instructions with cook time, difficulty, and more
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Cooking?</h2>
          <p className="text-lg mb-6 opacity-90">
            Upload your fridge photo now and discover amazing recipes!
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-white text-orange-600 py-3 px-8 rounded-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <UploadIcon className="w-5 h-5" />
            Upload Now
          </Link>
        </div>
      </main>
    </div>
  );
}
