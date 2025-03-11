import React, { useContext } from 'react';
import '../assets/Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userslice';

import Context from '../context';

const Login = () => {
    const { setLoginform } = useContext(Context); 

    const [data, setData] = useState({
        mobile: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateValue = Object.values(data).every((el) => el);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateValue) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const response = await fetch(SummaryApi.login.url, {
                method: SummaryApi.login.method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.error) {
                toast.error(result.message);
                return;
            }

            if (result.success) {
                toast.success(result.message);
                dispatch(setUserDetails(result?.data?.updateUser)); 
                setData({
                    mobile: "",
                    password: "",
                });
                setLoginform(); 
                navigate("/home");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className='md:m-3 w-full md:rounded-4xl flex bg-[#242529] justify-center items-center md:h-[97%] h-screen'>
            <section className="container">
                <div className="login-container">
                    <div className="circle circle-one"></div>
                    <div className="form-container">
                        <img
                            src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
                            alt="illustration"
                            className="illustration"
                        />
                        <h1 className="opacity">LOGIN</h1>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile"
                                value={data.mobile}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="PASSWORD"
                                value={data.password}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="opacity" disabled={!validateValue}>
                                SUBMIT
                            </button>
                        </form>
                    </div>
                    <div className="circle circle-two"></div>
                </div>
                <div className="theme-btn-container"></div>
            </section>
        </div>
    );
};

export default Login;
