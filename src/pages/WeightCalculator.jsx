import React, { useState } from "react";
import { FaRedo } from "react-icons/fa";

const WeightCalculator = () => {
    const [data, setData] = useState({
        page: "",
        weight: 0.0,
    });

    const [differenceData, setDifferenceData] = useState({
        new: "",
        page: "",
        rate: "",
        weight: "",
        totalWeight: "",
        value: "",
        amount: "",
        difference: ""
    });

    // Handler for weight calculator
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handler for difference calculator
    const handleDifferenceChange = (e) => {
        const { name, value } = e.target;
        setDifferenceData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateValue = data.page.trim() !== "";
    const validateDifference = differenceData.new.trim() !== "" && differenceData.page.trim() !== "" && differenceData.rate.trim() !== "";

    return (
        <div className="bg-backBackground md:pt-6 pt-10 w-full h-full overflow-y-auto">
            <header>
                <div className="mb-8">
                    <h1 className="text-white font-bold text-4xl">Calculator</h1>
                </div>
            </header>

            {/* Weight Calculator Section */}
            <div className="flex w-full mb-5">
                <div className="bg-[#363740] p-6 rounded-xl shadow-md w-full max-w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white">Weight Calculator</h2>
                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-white rounded"
                            onClick={() => setData({ page: "", weight: 0.0 })}
                        >
                            <FaRedo className="inline-block mr-1" size={10} /> Reset
                        </button>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <label htmlFor="page" className="text-gray-400 text-sm md:w-24">Pages</label>
                            <input
                                type="text"
                                id="page"
                                name="page"
                                value={data.page}
                                placeholder="Pages"
                                required
                                onChange={handleChange}
                                className="p-2 bg-gray-700 rounded-md text-white w-full"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <label htmlFor="weight" className="text-gray-400 text-sm md:w-24">Weight</label>
                            <input
                                type="text"
                                id="weight"
                                name="weight"
                                value={data.weight}
                                placeholder="Weight"
                                readOnly
                                className="p-2 bg-gray-700 rounded-md text-white w-full"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!validateValue}
                            onClick={() =>
                                setData((prev) => ({
                                    ...prev,
                                    weight: (parseFloat(prev.page) * 0.4).toFixed(2),
                                }))
                            }
                            className={`w-[40%] p-3 rounded-md font-medium ${validateValue ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 cursor-not-allowed"}`}
                        >
                            Calculate
                        </button>
                    </form>
                </div>
            </div>

            {/* Difference Calculator Section */}
            <div className="flex w-full mb-5">
                <div className="bg-[#363740] p-6 rounded-xl shadow-md w-full max-w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white">Difference Calculator</h2>
                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-white rounded"
                            onClick={() =>
                                setDifferenceData({
                                    new: "",
                                    page: "",
                                    rate: "",
                                    weight: "",
                                    totalWeight: "",
                                    value: "",
                                    amount: "",
                                    difference: ""
                                })
                            }
                        >
                            <FaRedo className="inline-block mr-1" size={10} /> Reset
                        </button>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={(e) => e.preventDefault()}>
                        {["new", "page", "rate"].map((field) => (
                            <div key={field} className="flex flex-col md:flex-row md:items-center gap-2">
                                <label className="text-gray-400 text-sm md:w-24">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={differenceData[field]}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    onChange={handleDifferenceChange}
                                    className="p-2 bg-gray-700 rounded-md text-white w-full md:w-[80%]"
                                />
                            </div>
                        ))}

                        {["weight", "totalWeight", "value", "amount", "difference"].map((field) => (
                            <div key={field} className="flex flex-col md:flex-row md:items-center gap-2">
                                <label className="text-gray-400 text-sm md:w-24">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={differenceData[field]}
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    readOnly
                                    className="p-2 bg-gray-700 rounded-md text-white w-full md:w-[80%]"
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={!validateDifference}
                            onClick={() => {
                                const newSupply = parseFloat(differenceData.new) || 0;
                                const pageCount = parseFloat(differenceData.page) || 0;
                                const rate = parseFloat(differenceData.rate) || 0;
                                const weight = (pageCount * 0.4).toFixed(2);
                                const totalWeight = ((weight * newSupply) / 100).toFixed(2);
                                const value = (newSupply * 4.7).toFixed(2);
                                const amount = (totalWeight * rate).toFixed(2);
                                const difference = (value - amount).toFixed(2);

                                setDifferenceData((prev) => ({
                                    ...prev,
                                    weight,
                                    totalWeight,
                                    value,
                                    amount,
                                    difference,
                                }));
                            }}
                            className={`w-[40%] p-3 rounded-md font-medium ${validateDifference ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 cursor-not-allowed"}`}
                        >
                            Calculate
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WeightCalculator;
