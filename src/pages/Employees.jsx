import React, { useEffect, useState } from 'react'
import { FaRedo, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import { useSelector } from 'react-redux';
import AllUser from '../components/AllUser';

const Employees = () => {
    const user = useSelector((state) => state?.user)
    const [loading, setLoading] = useState(false);
    const [sampleData, setsampleData] = useState({
        users: [],
    })
    const [userData, setUserData] = useState({
        name: "",
        mobile: "",
        agencyNo: "",
        centerName: "",
        password: "",
        role: "USER"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const validateValue = Object.values(userData).every((el) => el);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateValue) {
            toast.error("Please fill all fields");
            return;
        }

        const transformData = {
            name: userData.name,
            mobile: userData.mobile,
            agencyNo: Number(userData.agencyNo),
            centerName: userData.centerName,
            password: userData.password,
            role: "USER"
        };

        try {
            setLoading(true);
            const response = await fetch(SummaryApi.createUser.url, {
                method: SummaryApi.createUser.method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformData),
            });

            const result = await response.json();
            setLoading(false);

            if (result.error) {
                toast.error(result.message);
                return;
            }
            if (result.success) {
                toast.success(result.message);
                setUserData({
                    name: "",
                    mobile: "",
                    agencyNo: "",
                    centerName: "",
                    password: "",
                    role: "USER"
                });
            }

        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
            setLoading(false);
        }
    };

    const fetchAllUser = async () => {
        try {
            const response = await fetch(SummaryApi.allUser.url, {
                method: SummaryApi.allUser.method,
                credentials: "include"
            })
            const result = await response.json();
            if (result.error) {
                toast.error(result.message);
                return;
            }

            if (result.success && result.users) {
                toast.success("Employees fetched successfully");
                const formattedUsersData = result.users.map((item) => ({
                    ...item,
                    last_login_date: item.last_login_date?.split("T")[0],
                }));

                setsampleData({
                    users: formattedUsersData
                })
            } else {
                toast.error("Invalid data format received from the server.");
            }

        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
        }
    }

    useEffect(() => {
        {
            if (user.role === 'ADMIN') {
                fetchAllUser();
            }
        }
    }, [])


    return (
        <div className="bg-backBackground md:pt-6 pt-10 w-full h-full overflow-y-auto ">
            {user.role === 'USER' ? (
                <div className='w-full min-h-full flex items-center justify-center'>
                    <h2 className='text-red-600 p-5'>You are not allowed to user this feature.</h2>
                </div>
            ) :
                (
                    <>
                        <header>
                            <div className="mb-8">
                                <h1 className="text-white font-bold text-4xl">Employees</h1>
                            </div>
                        </header>
                        <div className="flex w-full mb-5">
                            <div className="bg-[#363740] p-6 rounded-xl shadow-md w-full max-w-full">
                                {loading ? (
                                    <div className="bg-[#363740] bg-opacity-50 p-10 rounded-xl w-full h-full flex items-center justify-center">
                                        <FaSpinner className="animate-spin text-green-500 text-3xl" />
                                        <span className="text-green-500 m-2 text-xl">Saving Data</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-md md:text-2xl font-semibold text-white">Register Employee</h2>
                                            <button
                                                type="button"
                                                onClick={() => setUserData({
                                                    name: "",
                                                    mobile: "",
                                                    agencyNo: "",
                                                    centerName: "",
                                                    password: "",
                                                    role: "USER"
                                                })}
                                                className="p-2 text-gray-400 hover:text-white rounded text-xs"
                                            >
                                                <FaRedo className="inline-block mr-1" size={10} /> Reset
                                            </button>
                                        </div>

                                        {/* Responsive Form */}
                                        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
                                            {[
                                                { label: "Name", id: "name" },
                                                { label: "Mobile", id: "mobile" },
                                                { label: "AgencyNo", id: "agencyNo" },
                                                { label: "Center", id: "centerName" },
                                                { label: "Password", id: "password", type: "password" },
                                            ].map(({ label, id, type = "text" }) => (
                                                <div key={id} className="flex flex-col md:flex-row md:items-center gap-2">
                                                    <label htmlFor={id} className="text-gray-400 text-sm md:w-24">{label}</label>
                                                    <input
                                                        type={type}
                                                        id={id}
                                                        name={id}
                                                        value={userData[id]}
                                                        placeholder={label}
                                                        required
                                                        onChange={handleChange}
                                                        className="p-2 bg-gray-700 rounded-md text-white w-full"
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                type="submit"
                                                disabled={!validateValue}
                                                className={`w-full p-3 rounded-md font-medium ${validateValue ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 cursor-not-allowed"}`}
                                            >
                                                Save
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="w-full h-full md:h-max overflow-auto">
                            <AllUser users={sampleData.users} />
                        </div>
                    </>
                )
            }

        </div>
    );
};

export default Employees;
