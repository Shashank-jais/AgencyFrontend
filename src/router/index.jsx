import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SummaryReport from "../pages/SummaryReport";
import Login from "../pages/Login";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '',
                element: <Login />
            },
            {
                path: 'home',
                element: <Home />
            },

            {
                path: 'summary',
                element: <SummaryReport />
            }
        ]
    }
])

export default router