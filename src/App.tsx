/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, UtensilsCrossed, Sparkles, Clock, ChefHat, Flame, Brain, Heart, Zap } from 'lucide-react';
import { generateRecipe, Recipe } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VIBES = [
  { id: 'comforting', label: 'Comforting', icon: Heart, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'spicy-fast', label: 'Spicy & Fast', icon: Flame, color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'brain-food', label: 'Brain Food', icon: Brain, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'cheap-cheerful', label: 'Cheap & Cheerful', icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'gourmet-scrap', label: 'Gourmet Scrap', icon: Sparkles, color: 'bg-purple-100 text-purple-700 border-purple-200' },
];

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>(['', '', '']);
  const [selectedVibe, setSelectedVibe] = useState<string>('comforting');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => {
    if (ingredients.length < 6) {
      setIngredients([...ingredients, '']);
    }
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleGenerate = async () => {
    const filteredIngredients = ingredients.filter(i => i.trim() !== '');
    if (filteredIngredients.length < 1) {
      setError('Please add at least one ingredient!');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipe(filteredIngredients, selectedVibe);
      setRecipe(result);
      // Scroll to recipe
      setTimeout(() => {
        document.getElementById('recipe-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('Failed to cook up a recipe. Maybe the fridge is too empty?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <header className="pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-stone-900 text-white rounded-2xl mb-6 shadow-xl">
            <UtensilsCrossed size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-semibold tracking-tight mb-4">
            Crave Craft
          </h1>
          <p className="text-stone-500 text-lg md:text-xl max-w-xl mx-auto font-light">
            Turn your random fridge leftovers into a chef-worthy meal tailored to your mood.
          </p>
        </motion.div>
      </header>

      <main className="max-w-3xl mx-auto px-6 space-y-12">
        {/* Ingredients Section */}
        <section className="bg-white rounded-[32px] p-8 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-medium flex items-center gap-2">
              <ChefHat className="text-stone-400" size={24} />
              What's in the fridge?
            </h2>
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
              {ingredients.filter(i => i.trim() !== '').length} / 6 Scraps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}...`}
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all placeholder:text-stone-300"
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(index)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-stone-300 hover:text-red-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </motion.div>
            ))}
            
            {ingredients.length < 6 && (
              <button
                onClick={addIngredient}
                className="flex items-center justify-center gap-2 px-5 py-4 border-2 border-dashed border-stone-100 rounded-2xl text-stone-400 hover:bg-stone-50 hover:border-stone-200 transition-all"
              >
                <Plus size={20} />
                <span>Add scrap</span>
              </button>
            )}
          </div>
        </section>

        {/* Vibe Selection */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-medium text-center">What's the vibe?</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {VIBES.map((vibe) => {
              const Icon = vibe.icon;
              const isActive = selectedVibe === vibe.id;
              return (
                <button
                  key={vibe.id}
                  onClick={() => setSelectedVibe(vibe.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300",
                    isActive 
                      ? cn(vibe.color, "ring-2 ring-offset-2 ring-stone-100 scale-105 shadow-md")
                      : "bg-white border-stone-100 text-stone-500 hover:border-stone-200"
                  )}
                >
                  <Icon size={18} />
                  <span className="font-medium">{vibe.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={cn(
              "group relative overflow-hidden px-12 py-5 bg-stone-900 text-white rounded-full font-medium text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100",
              loading && "cursor-wait"
            )}
          >
            <span className={cn("flex items-center gap-3", loading && "opacity-0")}>
              Cook it up <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </button>
        </div>

        {error && (
          <p className="text-center text-red-500 font-medium animate-pulse">{error}</p>
        )}

        {/* Recipe Result */}
        <AnimatePresence>
          {recipe && (
            <motion.div
              id="recipe-result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="px-4 py-1.5 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-widest">
                    {selectedVibe.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-4 text-stone-400 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} /> {recipe.prepTime} prep
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UtensilsCrossed size={16} /> {recipe.cookTime} cook
                    </span>
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6 leading-tight">
                  {recipe.title}
                </h2>
                
                <p className="text-stone-500 text-lg mb-8 italic font-serif">
                  "{recipe.vibeMatch}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-5 space-y-8">
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400 mb-6">
                        Ingredients
                      </h3>
                      <ul className="space-y-4">
                        {recipe.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-start gap-3 text-stone-700">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="md:col-span-7">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400 mb-6">
                      Instructions
                    </h3>
                    <div className="space-y-8">
                      {recipe.instructions.map((step, i) => (
                        <div key={i} className="flex gap-6">
                          <span className="font-serif text-3xl text-stone-200 font-light italic shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="text-stone-700 leading-relaxed pt-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-stone-50 p-8 border-t border-stone-100 text-center">
                <p className="text-stone-400 text-sm">
                  Enjoy your {selectedVibe.replace('-', ' ')} creation!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 text-center text-stone-300 text-sm font-light">
        <p>© {new Date().getFullYear()} Crave Craft • Built for the hungry student</p>
      </footer>
    </div>
  );
}
