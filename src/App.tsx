import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Tracks } from '@/pages/Tracks';
import { TrackDetail } from '@/pages/TrackDetail';
import { Events } from '@/pages/Events';
import { EventDetail } from '@/pages/EventDetail';
import { Faq } from '@/pages/Faq';
import { Join } from '@/pages/Join';
import { Login } from '@/pages/Login';
import { Account } from '@/pages/Account';
import { Verify } from '@/pages/Verify';
import { Admin } from '@/pages/Admin';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { NotFound } from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'tracks', element: <Tracks /> },
      { path: 'tracks/:slug', element: <TrackDetail /> },
      { path: 'events', element: <Events /> },
      { path: 'events/:slug', element: <EventDetail /> },
      { path: 'faq', element: <Faq /> },
      { path: 'join', element: <Join /> },
      { path: 'login', element: <Login /> },
      { path: 'account', element: <Account /> },
      { path: 'verify/:code', element: <Verify /> },
      { path: 'admin', element: <Admin /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
