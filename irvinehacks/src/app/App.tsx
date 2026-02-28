import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { GroceryProvider } from './context/GroceryContext';

export interface RecipeFilters {
  cuisine: string;
  skillLevel: string;
  cookTime: string;
  budget: string;
  mealTime: string;
}

function App() {
  const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);

  // Create the browser router only on the client, after hydration.
  useEffect(() => {
    const r = createBrowserRouter(routes);
    setRouter(r);
  }, []);

  // On the server (and before router is created on the client), render nothing
  // so server and first client render match and avoid hydration issues.
  if (!router) return null;

  return (
    <GroceryProvider>
      <RouterProvider router={router} />
    </GroceryProvider>
  );
}

export default App;
