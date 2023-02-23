import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Game from "./pages/Game";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    index: true,
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: `/:id`,
    element: <Game />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
