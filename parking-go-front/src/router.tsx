import { createBrowserRouter } from 'react-router';
import App from './App';
import { LandingPage } from './modules/landing/presentation/pages/LandingPage';
import About from './pages/About';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'about',
        element: <About />
      }
    ]
  }
]);
