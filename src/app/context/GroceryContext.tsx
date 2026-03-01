import { createContext, useContext, useState, ReactNode } from 'react';

export interface GroceryItem {
  id: string;
  name: string;
  purchased: boolean;
  quantity?: string;
}

interface GroceryContextType {
  groceries: GroceryItem[];
  addToGroceries: (item: string, quantity?: string) => void;
  removeFromGroceries: (id: string) => void;
  togglePurchased: (id: string) => void;
  clearGroceries: () => void;
  isInGroceries: (item: string) => boolean;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export function GroceryProvider({ children }: { children: ReactNode }) {
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);

  const addToGroceries = (item: string, quantity?: string) => {
    const id = item.toLowerCase().replace(/\s+/g, '-');
    setGroceries((prevGroceries) => {
      if (prevGroceries.find((g) => g.id === id)) {
        return prevGroceries;
      }
      return [...prevGroceries, { id, name: item, purchased: false, quantity }];
    });
  };

  const removeFromGroceries = (id: string) => {
    setGroceries((prevGroceries) => prevGroceries.filter((g) => g.id !== id));
  };

  const togglePurchased = (id: string) => {
    setGroceries((prevGroceries) =>
      prevGroceries.map((g) =>
        g.id === id ? { ...g, purchased: !g.purchased } : g,
      ),
    );
  };

  const clearGroceries = () => {
    setGroceries([]);
  };

  const isInGroceries = (item: string) => {
    const id = item.toLowerCase().replace(/\s+/g, '-');
    return groceries.some(g => g.id === id);
  };

  return (
    <GroceryContext.Provider value={{ 
      groceries, 
      addToGroceries, 
      removeFromGroceries, 
      togglePurchased, 
      clearGroceries,
      isInGroceries 
    }}>
      {children}
    </GroceryContext.Provider>
  );
}

export function useGrocery() {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
}
