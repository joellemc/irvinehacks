import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { GroceriesPage } from './pages/GroceriesPage';

export const routes = [
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/upload',
    Component: UploadPage,
  },
  {
    path: '/groceries',
    Component: GroceriesPage,
  },
];
