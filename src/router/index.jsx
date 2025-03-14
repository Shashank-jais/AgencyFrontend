import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SummaryReport from "../pages/SummaryReport";
import Login from "../pages/Login";
import Employees from "../pages/Employees";
import WeightCalculator from "../pages/WeightCalculator";

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
            },
            {
                path: 'employees',
                element: <Employees />
            },
            {
                path: "weightcalculator",
                element: <WeightCalculator />
            }
        ]
    }
])

export default router