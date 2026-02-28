import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { IngredientReview } from "./pages/IngredientReview";
import { RecipeResults } from "./pages/RecipeResults";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/review",
    Component: IngredientReview,
  },
  {
    path: "/results",
    Component: RecipeResults,
  },
]);
