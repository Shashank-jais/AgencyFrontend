import React, { useContext, useState } from 'react';
import { FaChartBar, FaCalculator, FaUsers, FaCalendarAlt, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userslice';
import Context from '../context';

const SideNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { setLoginform } = useContext(Context); 

    const handleLogout = async () => {
        try {
            const response = await fetch(SummaryApi.logout.url, {
                method: SummaryApi.logout.method,
                credentials: "include"
            })
            const result = await response.json();

            if (result.error) {
                toast.error(result.message);
                return;
            }
            if (result.success) {
                toast.success(result.message);
                dispatch(setUserDetails(null));
                setLoginform()
                navigate("/")
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
        }
    }



    return (
        <>
            <button
                className={`md:hidden fixed top-0 left-4 z-50 text-white p-2 pt-5 pb-5 rounded-lg bg-[#242529] ${isOpen ? "" : "w-full "}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 md:top-9 md:left-9 h-full md:h-[90%] w-64 bg-[#242529] text-gray-300 p-5 
                transform ${isOpen ? "translate-x-2" : "-translate-x-full"} 
                md:translate-x-0 md:block transition-transform duration-300 ease-in-out
            `}>
                <div className='flex justify-center items-center mb-6'>
                    <h1 className="text-xl font-bold text-white">PressLedger</h1>
                </div>
                <nav>
                    <ul className='space-y-4 mt-4'>
                        <NavItem to="/home" icon={<FaChartBar color='cyan'/>} text="Dashboard" location={location} />
                        <NavItem to="/summary" icon={<FaCalculator color='cyan' />} text="Summary Report" location={location} />
                        <NavItem to="/employees" icon={<FaUsers color='cyan' />} text="Employees" location={location} />
                        <NavItem to="/weightcalculator" icon={<FaCalendarAlt color='cyan' />} text="Weight Calculator" location={location} />
                    </ul>
                </nav>
                <button className="flex items-center space-x-2 text-red-400 mt-6 hover:text-red-600 p-3" onClick={handleLogout}>
                    <FaSignOutAlt /> <span>Log out</span>
                </button>
            </aside>
        </>
    );
};

const NavItem = ({ to, icon, text }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to}>
            <li className={`flex items-center space-x-2 p-3 rounded-lg mb-2 transition-all duration-300 
                ${isActive ? "text-white bg-gray-700 bg-opacity-60 backdrop-blur-md shadow-md" : "text-gray-400 hover:text-white hover:bg-gray-800"}
            `}>
                {icon}<span>{text}</span>
            </li>
        </Link>
    );
};

export default SideNavbar;