import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Header } from './components';
import { About, Education, Software, Work } from './modules';

import "./styles/global.scss"

const router = createBrowserRouter([
    {
        path: "/",
        element: <>
            <Header />
            <About />
            <Education />
            <Work />
            <Software />
        </>
    }
])

ReactDOM
    .createRoot(document.getElementById('root'))
    .render(<RouterProvider router={router} />);
