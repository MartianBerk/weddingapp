import * as React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css';

import ErrorRoute from './components/routes/ErrorRoute.js';
import RsvpRoute from './components/routes/RsvpRoute.js';

function App() {
  const router = createBrowserRouter([
    {
      path: "/rsvp",
      element: <RsvpRoute />,
      errorElement: <ErrorRoute />
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App;
