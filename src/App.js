import * as React from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import './App.css';

import ErrorRoute from './components/routes/ErrorRoute.js';
import InformationRoute from './components/routes/InformationRoute.js';
import RsvpRoute from './components/routes/RsvpRoute.js';

import Head from './components/container/Head.js'

function App() {
  const Layout = () => (
    <>
      <Head />
      <Outlet />
    </>
  )
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/rsvp",
          element: <RsvpRoute />,
          errorElement: <ErrorRoute />
        },
        {
          path: "/info",
          element: <InformationRoute />,
          errorElement: <ErrorRoute />
        }
      ],
      errorElement: <ErrorRoute />
      
    }
  ]);

  return (
    <div className="wedding-container">
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
